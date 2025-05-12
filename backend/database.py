# from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, JSON
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker, relationship
# from datetime import datetime

# # Update this DATABASE_URL with your PostgreSQL credentials.
# DATABASE_URL = "postgresql://postgres:209175@localhost:5432/moodify_db"

# # Create the engine and session maker
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Create a base class for our models
# Base = declarative_base()

# # ---------------------------
# # Define the ORM Models
# # ---------------------------

# from sqlalchemy import Column, Integer, String, DateTime
# from sqlalchemy.orm import declarative_base
# from datetime import datetime

# Base = declarative_base()

# class User(Base):
#     __tablename__ = 'users'

#     user_id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     username = Column(String, unique=True, nullable=False)  # NEW
#     email = Column(String, unique=True, nullable=False)
#     password_hash = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)


#     # Relationships to other tables
#     moods = relationship("MoodHistory", back_populates="user", cascade="all, delete")
#     playlist_history = relationship("UserPlaylistHistory", back_populates="user", cascade="all, delete")


# class MoodHistory(Base):
#     __tablename__ = "mood_history"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
#     mood = Column(String(50), nullable=False)
#     detected_at = Column(DateTime, default=datetime.utcnow)
#     image_reference = Column(String(255))  # e.g., file path or URL (optional)

#     # Relationship: Each mood record is linked to a user
#     user = relationship("User", back_populates="moods")


# class Playlist(Base):
#     __tablename__ = "playlists"
#     id = Column(Integer, primary_key=True, index=True)
#     mood = Column(String(50), unique=True, nullable=False)
#     playlist_info = Column(JSON)  # JSON to store details (playlist id, title, url, etc.)


# class UserPlaylistHistory(Base):
#     __tablename__ = "user_playlist_history"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
#     mood = Column(String(50), nullable=False)
#     playlist_id = Column(Integer, ForeignKey("playlists.id"))
#     played_at = Column(DateTime, default=datetime.utcnow)

#     # Relationships linking to user and playlist
#     user = relationship("User", back_populates="playlist_history")
#     playlist = relationship("Playlist")


# # ---------------------------
# # Utility Functions
# # ---------------------------

# def create_tables():
#     """Create tables in the database."""
#     Base.metadata.create_all(bind=engine)

# def get_db():
#     """Generator function to get a database session."""
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()



# # Testing the Integration

# if __name__ == '__main__':
#     # Create tables if they don't exist
#     create_tables()
    
#     # Create a sample user for testing
#     db = SessionLocal()
#     try:
#         new_user = User(name="John Doe", email="john@example.com", password_hash="hashed_password")
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)
#         print(f"Added user: {new_user.name} with ID: {new_user.user_id}")
#     except Exception as e:
#         print("Error:", e)
#         db.rollback()
#     finally:
#         db.close()

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database URL (update if different)
DATABASE_URL = "postgresql://postgres:209175@localhost:5432/moodify_db"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for our models
Base = declarative_base()

# Define the User model
class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_new_user = Column(Boolean, default=True, nullable=False)
    preferences = Column(JSON, default=dict, nullable=False)

    # Relationships
    mood_history = relationship("MoodHistory", back_populates="user")
    playlists = relationship("Playlist", back_populates="user")
    user_playlist_history = relationship("UserPlaylistHistory", back_populates="user")

# Define the MoodHistory model
class MoodHistory(Base):
    __tablename__ = 'mood_history'

    mood_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    mood = Column(String, nullable=False)
    image_reference = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mood_history")

# Define the Playlist model
class Playlist(Base):
    __tablename__ = 'playlists'

    playlist_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="playlists")
    user_playlist_history = relationship("UserPlaylistHistory", back_populates="playlist")

# Define the UserPlaylistHistory model
class UserPlaylistHistory(Base):
    __tablename__ = 'user_playlist_history'

    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    playlist_id = Column(Integer, ForeignKey('playlists.playlist_id'), nullable=False)
    played_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_playlist_history")
    playlist = relationship("Playlist", back_populates="user_playlist_history")

# Function to create tables
def create_tables():
    print("Dropping tables defined in models...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables defined in models...")
    Base.metadata.create_all(bind=engine)

# Create a sample user for testing
if __name__ == "__main__":
    create_tables()
    db = SessionLocal()
    try:
        from werkzeug.security import generate_password_hash
        new_user = User(
            name="John Doe",
            username="johndoe",
            email="john@example.com",
            password_hash=generate_password_hash("hashed_password"),
            is_new_user=True,
            preferences={}
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Added user: {new_user.name} with ID: {new_user.user_id}")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()