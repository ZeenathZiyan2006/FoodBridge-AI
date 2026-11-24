import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "foodbridge-super-secret-key-2026-sustainability")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    if os.getenv("VERCEL"):
        # In Vercel serverless functions, the root filesystem is read-only.
        # Copy the pre-seeded SQLite database to temp dir so write operations succeed.
        import tempfile
        import shutil
        temp_dir = Path(tempfile.gettempdir())
        tmp_db = temp_dir / "foodbridge.db"
        orig_db = BASE_DIR / "foodbridge.db"
        if not tmp_db.exists() and orig_db.exists():
            try:
                shutil.copyfile(orig_db, tmp_db)
            except Exception as e:
                print(f"Warning: Could not copy initial DB to temp directory: {e}")
        DATABASE_URL = f"sqlite:///{tmp_db.as_posix()}"
    else:
        DATABASE_URL = f"sqlite:///{BASE_DIR}/foodbridge.db"

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]
