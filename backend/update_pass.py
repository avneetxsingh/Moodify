from werkzeug.security import generate_password_hash
from database import SessionLocal, User

# Dictionary of usernames and their plain-text passwords
USER_PASSWORDS = {
    'abc': '12345',  # From your login attempt
    # Add more users as needed
}

db = SessionLocal()
try:
    for username, plain_password in USER_PASSWORDS.items():
        user = db.query(User).filter(User.username == username).first()
        if user:
            # Check if the password_hash is plain text (not hashed)
            if not user.password_hash.startswith('pbkdf2:sha256'):
                # Re-hash the password using werkzeug.security
                hashed_password = generate_password_hash(plain_password)
                user.password_hash = hashed_password
                print(f"Updated password hash for {username}: {hashed_password}")
            else:
                print(f"Password for {username} is already hashed")
        else:
            print(f"User {username} not found")
    db.commit()
except Exception as e:
    print("Error:", e)
    db.rollback()
finally:
    db.close()