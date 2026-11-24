from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .config import CORS_ORIGINS
from .seed_data import seed_initial_data, ensure_fresh_demo_data
from .routes import auth, donations, requests, matching, analytics, notifications

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite Database Tables
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial realistic demo data if needed & ensure deadlines are fresh
    db = SessionLocal()
    try:
        seed_initial_data(db)
        ensure_fresh_demo_data(db)
    finally:
        db.close()
        
    yield

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
