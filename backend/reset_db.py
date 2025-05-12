# This script is used to reset the database by dropping all tables and creating them again.
from database import Base, engine
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
