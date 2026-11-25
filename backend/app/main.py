import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal, ensure_schema_columns
from .config import CORS_ORIGINS
from .seed_data import seed_initial_data
from .routes import auth, donations, requests, matching, analytics, notifications
from .routes.donations import mark_expired_donations


async def _periodic_expiry_check():
    """Periodically mark food donations as Expired once their consumption deadline passes."""
    while True:
        try:
            await asyncio.sleep(15)
            db = SessionLocal()
            try:
                mark_expired_donations(db)
            finally:
                db.close()
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Notice in _periodic_expiry_check: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite Database Tables & safe column migrations
    Base.metadata.create_all(bind=engine)
    ensure_schema_columns()
    
    # 2. Seed initial realistic demo data if needed & transition any expired items
    db = SessionLocal()
    try:
        seed_initial_data(db)
        mark_expired_donations(db)
    finally:
        db.close()

    cleanup_task = asyncio.create_task(_periodic_expiry_check())
    try:
        yield
    finally:
        cleanup_task.cancel()
        try:
            await cleanup_task
        except asyncio.CancelledError:
            pass

app = FastAPI(
    title="FoodBridge AI – Smart Food Redistribution Platform",
    description="Intelligent AI-driven food waste reduction and surplus food redistribution platform for sustainability exhibitions.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def normalize_api_path_middleware(request, call_next):
    path = request.scope.get("path", "")
    if (
        not path.startswith("/api")
        and not path.startswith("/docs")
        and not path.startswith("/openapi.json")
        and not path.startswith("/redoc")
        and path != "/"
    ):
        request.scope["path"] = "/api" + path
    return await call_next(request)

# Register route modules
app.include_router(auth.router)
app.include_router(donations.router)
app.include_router(requests.router)
app.include_router(matching.router)
app.include_router(analytics.router)
app.include_router(notifications.router)

@app.get("/")
def root():
    return {
        "platform": "FoodBridge AI – Smart Food Redistribution Platform",
        "tagline": "Don't Waste Food. Share Hope.",
        "version": "1.0.0",
        "category": "Sustainability & Environment",
        "theme": "Technology for a Sustainable and Smarter Future",
        "status": "Operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
