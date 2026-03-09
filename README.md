# 🎵 Moodify - AI-Powered Mood-Based Music Recommendation System

> An intelligent music recommendation platform that analyzes mood detection and suggests personalized music to match and enhance your emotional state.

![Language](https://img.shields.io/badge/JavaScript-55.6%25-yellow)
![Python](https://img.shields.io/badge/Python-12.3%25-blue)
![CSS](https://img.shields.io/badge/CSS-32.1%25-purple)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0-blue)

---

## 📌 Overview

**Moodify** is a full-stack application that combines mood detection technology with intelligent music recommendations. The platform analyzes your current emotional state and suggests music that perfectly matches your mood, helping you stay productive, motivated, or relaxed based on your needs.

Whether you're looking to energize your workout, focus on deep work, or wind down after a long day, Moodify intelligently curates the perfect soundtrack for your mood.

### Key Highlights

- 🧠 **AI-Powered Mood Detection** - Analyzes emotional state through multiple inputs
- 🎶 **Smart Music Recommendations** - Personalized playlist suggestions based on mood
- 🔊 **Audio Processing** - Advanced audio analysis with dedicated audio server
- 📊 **Mood Tracking** - Track emotional patterns over time
- 🎯 **Mood-to-Music Mapping** - Intelligent algorithm connecting emotions to music
- ⚡ **Fast Performance** - Optimized backend for quick recommendations
- 📱 **Responsive UI** - Beautiful interface for all devices

---

## 🏗️ Project Architecture

### Three-Tier Architecture

```
Frontend (React/JavaScript)
        ↓
Backend (Python/Node.js)
        ↓
Audio Server (Audio Processing)
        ↓
Music Database & Recommendations Engine
```

### Component Structure

```
Moodify/
├── src/                          # Frontend application
│   ├── components/              # React components
│   │   ├── MoodDetector/       # Mood analysis interface
│   │   ├── MusicPlayer/        # Audio playback component
│   │   ├── PlaylistManager/    # Playlist handling
│   │   └── Dashboard/          # Main dashboard
│   ├── pages/                  # Page components
│   ├── styles/                 # CSS styling
│   ├── utils/                  # Helper functions
│   ├── App.js                  # Main app component
│   └── index.js               # Entry point
│
├── backend/                     # Python/Node.js backend
│   ├── models/                # ML models for mood detection
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   │   ├── mood_service.py   # Mood analysis
│   │   ├── recommendation_engine.py  # Recommendation logic
│   │   └── music_service.py   # Music database management
│   ├── utils/                 # Utility functions
│   ├── config.py              # Configuration
│   └── app.py                 # Flask/FastAPI application
│
├── audio-server/               # Audio processing service
│   ├── processors/            # Audio processing modules
│   ├── models/                # Audio ML models
│   ├── api/                   # Audio processing APIs
│   └── server.js              # Audio server main file
│
└── README.md                  # This file
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **JavaScript/React** | UI components and user interface |
| **CSS3** | Responsive styling and animations |
| **Axios** | HTTP client for API calls |
| **Web Audio API** | Browser-based audio handling |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python** | Core backend logic and ML integration |
| **Flask/FastAPI** | RESTful API development |
| **TensorFlow/PyTorch** | Machine learning for mood detection |
| **Scikit-learn** | Data processing and ML algorithms |
| **SQLite/PostgreSQL** | Database for music catalog and user data |

### Audio Server
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime for audio server |
| **WebSocket** | Real-time audio streaming |
| **Audio Libraries** | Audio processing and analysis |
| **Express.js** | Audio API endpoints |

### Additional Tools
- **Git** - Version control
- **Docker** - Containerization (optional)
- **Postman** - API testing

---

## 🎯 Core Features

### 1. Mood Detection
- Analyzes user input through text, voice, or behavioral patterns
- Uses advanced ML models to determine emotional state
- Supports multiple mood categories (Happy, Sad, Energetic, Calm, Focused, etc.)
- Real-time mood analysis with confidence scores

### 2. Music Recommendation Engine
- Intelligent algorithm matching mood to music characteristics
- Considers:
  - Tempo (BPM)
  - Energy level
  - Acousticness
  - Danceability
  - Valence (musical positiveness)
  - Genre compatibility
- Learns from user feedback to improve recommendations

### 3. Audio Processing
- Advanced audio analysis features
- Real-time audio streaming
- Audio fingerprinting for music identification
- Playlist generation based on mood parameters

### 4. User Dashboard
- Visual mood indicators
- Personalized recommendations display
- Playlist management
- Mood history tracking
- User preferences customization

### 5. Music Database
- Comprehensive music catalog
- Song metadata and audio features
- Genre and artist information
- Real-time search and filtering

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 14.x or higher
- **Python** 3.8+
- **npm** or **yarn**
- **pip** (Python package manager)
- **Git**

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env
   ```
   Add:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_AUDIO_SERVER_URL=http://localhost:3001
   ```

4. **Start frontend development server**
   ```bash
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   touch .env
   ```
   Add:
   ```env
   FLASK_ENV=development
   FLASK_APP=app.py
   DATABASE_URL=sqlite:///moodify.db
   MUSIC_API_KEY=your_api_key_here
   ```

5. **Initialize database**
   ```bash
   python -c "from app import db; db.create_all()"
   ```

6. **Start backend server**
   ```bash
   python app.py
   ```
   Backend runs on `http://localhost:5000`

### Audio Server Setup

1. **Navigate to audio-server directory**
   ```bash
   cd audio-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start audio server**
   ```bash
   npm start
   ```
   Audio server runs on `http://localhost:3001`

### Complete Startup

In separate terminal windows:

```bash
# Terminal 1: Frontend
cd src && npm start

# Terminal 2: Backend
cd backend && source venv/bin/activate && python app.py

# Terminal 3: Audio Server
cd audio-server && npm start
```

---

## 🔌 API Endpoints

### Mood Detection Endpoints

```
POST   /api/mood/detect         - Analyze and detect mood
GET    /api/mood/history        - Get mood history
GET    /api/mood/:id            - Get specific mood details
DELETE /api/mood/:id            - Delete mood record
```

### Music Recommendation Endpoints

```
GET    /api/recommendations     - Get mood-based recommendations
POST   /api/recommendations     - Create custom recommendation
GET    /api/playlists           - Get user playlists
POST   /api/playlists           - Create new playlist
PUT    /api/playlists/:id       - Update playlist
DELETE /api/playlists/:id       - Delete playlist
```

### Music Catalog Endpoints

```
GET    /api/music/search        - Search music catalog
GET    /api/music/genres        - Get available genres
GET    /api/music/:id           - Get song details
GET    /api/music/similar       - Get similar songs
```

### Audio Server Endpoints

```
GET    /api/audio/stream/:id    - Stream audio
POST   /api/audio/analyze       - Analyze audio features
GET    /api/audio/features/:id  - Get audio features
```

---

## 🧠 How Mood Detection Works

### Step 1: Data Collection
- User input analysis (text, voice, or selection)
- Behavioral patterns
- Time of day and contextual data

### Step 2: Feature Extraction
- Text sentiment analysis
- Voice tone analysis
- Behavioral pattern recognition

### Step 3: ML Model Prediction
- Multiple ML models analyzing different aspects
- Ensemble approach for accuracy
- Confidence scoring

### Step 4: Mood Classification
- Maps detected mood to predefined categories
- Generates mood intensity score (0-100)

### Step 5: Recommendation Generation
- Maps mood to music characteristics
- Filters music database
- Ranks recommendations by relevance

---

## 🎵 Music Feature Mapping

The app maps mood dimensions to music features:

| Mood Characteristic | Music Feature | How It's Used |
|-------------------|---|---|
| **Happy** | High Valence, Upbeat Tempo | Energetic, positive songs |
| **Sad** | Low Valence, Slow Tempo | Melancholic, emotional songs |
| **Energetic** | High Energy, Fast BPM | High-intensity tracks |
| **Calm** | Low Energy, Slow BPM | Relaxing, meditative songs |
| **Focused** | Instrumental, Consistent Tempo | Study-friendly music |
| **Social** | Danceable, Upbeat | Party and group songs |

---

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- username
- email
- password_hash
- preferences
- created_at
- updated_at
```

### Mood Records Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- mood_type
- intensity (0-100)
- confidence_score
- timestamp
- context (optional)
```

### Playlists Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- mood_type
- songs (array/relationship)
- created_at
- updated_at
```

### Music Catalog Table
```sql
- id (Primary Key)
- title
- artist
- genre
- tempo (BPM)
- energy
- valence
- acousticness
- danceability
- duration
- audio_features
```

---

## 🚀 Key Algorithms

### Mood Detection Algorithm
1. Collect multiple input signals
2. Normalize and standardize inputs
3. Feed into ML models (Neural Networks, SVM, etc.)
4. Apply ensemble voting
5. Output confidence-weighted mood

### Recommendation Algorithm
1. Get current mood vector
2. Convert mood to music feature targets
3. Calculate similarity between target and catalog
4. Rank by relevance score
5. Apply diversity filter
6. Return top N recommendations

### Learning Algorithm
1. Collect user feedback on recommendations
2. Track which songs user listens to fully
3. Adjust mood-to-music mappings
4. Improve model accuracy over time

---

## 📈 Performance Optimization

### Frontend
- React.lazy() for code splitting
- Memoization for component optimization
- Lazy loading of playlists
- Efficient state management

### Backend
- Database query optimization
- Caching frequently accessed data
- Background job processing
- Connection pooling

### Audio Server
- Audio streaming optimization
- Efficient audio processing
- Memory management for large files
- WebSocket for real-time updates

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication for API
- CORS protection
- Input validation and sanitization
- Environment variable configuration
- Rate limiting on API endpoints
- Secure audio streaming

---

## 🧪 Testing

### Frontend Testing
```bash
cd src
npm test
```

### Backend Testing
```bash
cd backend
python -m pytest
```

### API Testing
```bash
# Using Postman or curl
curl -X GET http://localhost:5000/api/recommendations
```

---

## 📱 Usage Examples

### Example 1: Get Mood-Based Recommendations

```javascript
// Frontend code
const getMoodRecommendations = async (moodType) => {
  const response = await fetch(`http://localhost:5000/api/recommendations?mood=${moodType}`);
  const recommendations = await response.json();
  return recommendations;
};

// Usage
const songs = await getMoodRecommendations('happy');
```

### Example 2: Detect User Mood

```javascript
const detectMood = async (userInput) => {
  const response = await fetch('http://localhost:5000/api/mood/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: userInput })
  });
  const moodData = await response.json();
  return moodData;
};
```

### Example 3: Create Playlist

```javascript
const createPlaylist = async (playlistName, moodType) => {
  const response = await fetch('http://localhost:5000/api/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: playlistName, mood_type: moodType })
  });
  return await response.json();
};
```

---

## 🎨 UI Components

### Main Components

1. **MoodDetector** - Interface for mood input and analysis
2. **MusicPlayer** - Audio playback with controls
3. **PlaylistManager** - Create and manage playlists
4. **Dashboard** - Overview of moods and recommendations
5. **MoodHistory** - Track mood patterns over time
6. **RecommendationCard** - Display individual song recommendations
7. **AudioVisualizer** - Visual representation of audio

---

## 📝 Project Structure Explanation

### Frontend (src/)
- **Components**: Reusable UI elements
- **Pages**: Full page components
- **Styles**: CSS files for styling
- **Utils**: Helper functions and constants
- **App.js**: Main component routing
- **index.js**: React entry point

### Backend (backend/)
- **Models**: Database models and data structures
- **Routes**: API endpoint definitions
- **Services**: Business logic and algorithms
- **Utils**: Helper functions
- **Config**: Configuration settings
- **app.py**: Flask/FastAPI application setup

### Audio Server (audio-server/)
- **Processors**: Audio processing algorithms
- **Models**: ML models for audio analysis
- **API**: Express.js routes for audio endpoints
- **server.js**: Server initialization

---

## 🔄 Data Flow

```
User Input
   ↓
Frontend (React) - Mood Detection Interface
   ↓
Backend API - Process Input
   ↓
ML Model - Detect Mood
   ↓
Recommendation Engine - Generate Recommendations
   ↓
Music Database - Query Songs
   ↓
Audio Server - Prepare Audio
   ↓
Frontend - Display Results & Play Audio
```

---

## 🚀 Future Enhancements

- [ ] Multi-language support
- [ ] Voice-based mood detection
- [ ] Social features (share playlists)
- [ ] Advanced mood analytics
- [ ] Spotify/Apple Music integration
- [ ] Offline mode
- [ ] Mobile app (React Native)
- [ ] Real-time collaborative playlists
- [ ] Mood-based exercise recommendations
- [ ] Integration with smart home devices
- [ ] Emotion recognition from facial expressions
- [ ] Haptic feedback for mood reinforcement


### Development Guidelines
- Follow PEP 8 for Python code
- Follow ESLint rules for JavaScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📋 File Structure Quick Reference

```
Moodify/
├── src/                    # React Frontend Application
├── backend/               # Python Backend API
├── audio-server/          # Node.js Audio Processing Server
├── README.md             # This file
├── .gitignore            # Git ignore rules
└── requirements.txt      # Python dependencies (in backend/)
```

---



## 🙏 Acknowledgments

- Music feature extraction inspired by Spotify API
- Mood detection algorithms based on NLP and ML research
- Audio processing using industry-standard libraries
- Community feedback and contributions

---

## 📞 Support & Questions

For questions, issues, or suggestions:
- Open an [Issue](https://github.com/avneetxsingh/Moodify/issues)
- Start a [Discussion](https://github.com/avneetxsingh/Moodify/discussions)
- Email: [your-email@example.com](mailto:your-email@example.com)

---

## 🎯 Project Status

- ✅ Core mood detection implemented
- ✅ Basic recommendation engine
- ✅ Frontend UI components
- 🔄 Audio streaming optimization (in progress)
- ⏳ Advanced ML models (planned)
- ⏳ Integration with music platforms (planned)

---

## 📊 Project Statistics

- **Total Commits**: 4
- **Languages**: JavaScript, Python, CSS
- **Tech Stack Complexity**: High (Frontend + Backend + Audio Server)
- **Development Time**: Active Development

---

**Last Updated**: May 2025   
**Status**: ⏸️ Development Paused

---

> "Music has a magic that transcends mood. Moodify amplifies it by understanding your emotions." 🎵
