from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.config import DB_CONNECTION_STRING

engine = create_engine(DB_CONNECTION_STRING)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()