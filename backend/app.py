#yash will discuss and let us know which libraries to use , 
# then we will create the code to detect the emotion from the captured photo
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import SessionLocal, User, MoodHistory, create_tables
from deepface import DeepFace
import base64
import numpy as np
import cv2
import logging
import os
import tensorflow as tf

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

app = Flask(__name__)
CORS(app)

# Set up detailed logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables if they don’t exist
create_tables()

# Cache DeepFace model at startup
logger.info("Loading DeepFace model with opencv backend...")
try:
    test_img = np.zeros((128, 128, 3), dtype=np.uint8)  # Dummy image to initialize
    DeepFace.analyze(test_img, actions=['emotion'], enforce_detection=False, detector_backend='opencv')
    logger.info("DeepFace model loaded successfully")
except Exception as e:
    logger.error(f"Failed to preload DeepFace model: {str(e)}")

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not name or not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == username).first():
            return jsonify({'message': 'Username already taken'}), 400
        if db.query(User).filter(User.email == email).first():
            return jsonify({'message': 'Email already registered'}), 400

        password_hash = generate_password_hash(password)
        new_user = User(name=name, username=username, email=email, password_hash=password_hash)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        user_data = {
            'user_id': new_user.user_id,
            'name': new_user.name,
            'username': new_user.username,
            'email': new_user.email,
            'created_at': new_user.created_at.isoformat()
        }
        return jsonify({'user': user_data}), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        db.rollback()
        return jsonify({'message': 'Signup failed'}), 500
    finally:
        db.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        if not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Incorrect password'}), 401

        user_data = {
            'user_id': user.user_id,
            'name': user.name,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        }
        return jsonify({'user': user_data}), 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed'}), 500
    finally:
        db.close()

@app.route('/detect-mood', methods=['POST'])
def detect_mood():
    db = SessionLocal()
    try:
        data = request.json
        image_data = data.get('image')
        user_id = data.get('user_id')  

        if not image_data:
            logger.warning("No image provided in request")
            return jsonify({'error': 'No image provided'}), 400

        # Decode image
        logger.info("Decoding base64 image...")
        image_str = image_data.split(",")[1]
        img_bytes = base64.b64decode(image_str)
        np_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if img is None:
            logger.error("Failed to decode image")
            return jsonify({'mood': 'neutral', 'error': 'Invalid image data'}), 400

        # Log original image dimensions
        logger.info(f"Original image dimensions: {img.shape}")

        # Save original image for debugging
        debug_path = 'debug_image.jpg'
        cv2.imwrite(debug_path, img)
        logger.info(f"Saved original image to {debug_path}")

        # Preprocess image: Enhance and crop to face
        logger.info("Preprocessing image...")
        img = cv2.convertScaleAbs(img, alpha=1.5, beta=50)  # Boost brightness/contrast

        # Detect face with OpenCV Haar Cascade
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            logger.warning("No face detected by OpenCV Haar Cascade")
            img_resized = cv2.resize(img, (128, 128))  # Fallback to full image
        else:
            # Crop to the first detected face
            x, y, w, h = faces[0]
            face_img = img[y:y+h, x:x+w]
            logger.info(f"Detected face region: x={x}, y={y}, w={w}, h={h}")
            img_resized = cv2.resize(face_img, (128, 128))  # Resize cropped face
            cv2.imwrite('debug_face.jpg', img_resized)
            logger.info("Saved cropped face image to debug_face.jpg")

        # Analyze mood with DeepFace
        logger.info("Attempting mood detection with opencv backend...")
        analysis = DeepFace.analyze(
            img_resized,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv'
        )
        logger.info(f"Raw DeepFace analysis result: {analysis}")

        if not analysis or 'dominant_emotion' not in analysis[0]:
            logger.warning("No face detected or analysis failed")
            mood = 'neutral'
        else:
            emotions = analysis[0]['emotion']
            dominant_emotion = analysis[0]['dominant_emotion']
            logger.info(f"Emotion scores: {emotions}")
            logger.info(f"Dominant emotion: {dominant_emotion}")
            mood = dominant_emotion

        # Save mood to database if user_id is provided
        if user_id:
            user = db.query(User).filter(User.user_id == user_id).first()
            if user:
                mood_entry = MoodHistory(user_id=user_id, mood=mood, image_reference=image_data[:50])
                db.add(mood_entry)
                db.commit()
                logger.info(f"Saved mood '{mood}' for user {user_id}")

        return jsonify({'mood': mood})

    except Exception as e:
        logger.error(f"Mood detection error: {str(e)}")
        return jsonify({'mood': 'neutral', 'error': str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)