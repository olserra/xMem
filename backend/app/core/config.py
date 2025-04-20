from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Frontend
        "http://localhost:5678",  # n8n
    ]

    # Database Configuration
    DATABASE_URL: str

    # OAuth2 Configuration
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    # OpenAI Configuration
    OPENAI_API_KEY: str

    class Config:
        case_sensitive = True
        env_file = ".env.docker"

settings = Settings() 