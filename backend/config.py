import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./saferoute.db")
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3737,http://localhost:5173,http://localhost:3000,http://localhost:4173"
).split(",")
APP_ENV: str = os.getenv("APP_ENV", "development")
GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
