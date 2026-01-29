from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Robust Database Configuration
# 1. Attempt to get from environment
env_db_url = os.getenv("DATABASE_URL")

# 2. Validation & Fallback Logic
if not env_db_url or not env_db_url.strip():
    # Case A: Variable is missing or empty -> Use local SQLite
    print("WARNING: DATABASE_URL is missing or empty. Using local SQLite fallback.")
    DATABASE_URL = "sqlite:///./sql_app.db"
    
    # Ensure the directory exists for SQLite
    os.makedirs(os.path.dirname(os.path.abspath("sql_app.db")), exist_ok=True)
else:
    # Case B: Variable exists
    DATABASE_URL = env_db_url.strip()
    
    # 3. Railway/Heroku Fix: Convert 'postgres://' to 'postgresql://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 4. Create Engine
try:
    engine = create_engine(DATABASE_URL)
except Exception as e:
    print(f"CRITICAL: Failed to connect to provided DATABASE_URL: {e}")
    print("Falling back to SQLite to prevent crash.")
    DATABASE_URL = "sqlite:///./sql_app.db"
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
