import sys
import os
import shutil
import tempfile
from pathlib import Path

# Add project root to sys.path so backend package can be imported
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# In Vercel Serverless, the root directory is read-only.
# Copy pre-seeded SQLite database to temp directory if it doesn't already exist.
temp_dir = Path(tempfile.gettempdir())
tmp_db = temp_dir / "foodbridge.db"
local_db = root_dir / "backend" / "foodbridge.db"

if not tmp_db.exists() and local_db.exists():
    try:
        shutil.copyfile(local_db, tmp_db)
    except Exception as e:
        print(f"Notice: Could not copy initial database to temp directory: {e}")

os.environ.setdefault("VERCEL", "1")

from backend.app.main import app
