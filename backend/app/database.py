from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import DATABASE_URL

# connect_args={"check_same_thread": False} is required for SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_schema_columns():
    """Safely add new columns to existing SQLite tables without losing data."""
    if "sqlite" not in DATABASE_URL:
        return
    with engine.begin() as conn:
        donation_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(food_donations)")).fetchall()]
        if donation_cols and "expired_at" not in donation_cols:
            conn.execute(text("ALTER TABLE food_donations ADD COLUMN expired_at DATETIME"))

        user_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
        if user_cols and "profile_picture" not in user_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN profile_picture TEXT"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
