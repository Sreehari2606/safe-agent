"""
SafeRoute – FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn

from config import CORS_ORIGINS, APP_ENV
from database import init_db, SessionLocal
from routes import hazards, weather, assistant
from services.seed import seed_demo_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialise DB and seed demo data."""
    init_db()
    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="SafeRoute – AI Delivery Safety Assistant",
    description=(
        "API for SafeRoute: real-time hazard reporting, weather integration "
        "and AI-powered safety guidance for delivery partners."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(hazards.router)
app.include_router(weather.router)
app.include_router(assistant.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "app": "SafeRoute", "env": APP_ENV}


@app.get("/", tags=["System"])
def root():
    return JSONResponse({
        "message": "SafeRoute API is running 🚀",
        "docs": "/docs",
        "health": "/health",
    })


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

