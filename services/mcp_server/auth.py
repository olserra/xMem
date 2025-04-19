from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
import asyncpg
from .config import settings

security = HTTPBearer()

class User(BaseModel):
    id: str
    email: Optional[str] = None
    name: Optional[str] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Valida o token JWT do Next.js e retorna o usuário"""
    try:
        token = credentials.credentials
        
        # Decodifica o token usando a mesma chave secreta do Next.js
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Extrai o ID do usuário do token
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        # Busca informações adicionais do usuário no banco
        async with asyncpg.create_pool(settings.DATABASE_URL) as pool:
            async with pool.acquire() as conn:
                user = await conn.fetchrow(
                    """
                    SELECT id, email, name
                    FROM "User"
                    WHERE id = $1
                    """,
                    user_id
                )
                
                if not user:
                    raise HTTPException(status_code=401, detail="User not found")
                    
                return User(
                    id=user["id"],
                    email=user["email"],
                    name=user["name"]
                )
                
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dependência para obter o usuário atual
def get_user_dependency():
    """Dependência FastAPI para obter o usuário atual"""
    async def dependency(user: User = Depends(get_current_user)):
        return user
    return dependency 