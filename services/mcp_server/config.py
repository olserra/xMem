from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configurações do MCP
    MCP_SERVER_NAME: str = "xmem-mcp"
    MCP_SERVER_VERSION: str = "1.0.0"
    MCP_SERVER_DESCRIPTION: str = "xmem Memory and Project Management MCP Server"
    
    class Config:
        env_file = ".env"

settings = Settings() 