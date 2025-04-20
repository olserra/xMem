from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from app.services.chat_service import ChatService
from app.db.chroma_client import ChromaClient
from app.core.deps import get_current_user

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    context_used: list[str]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_memory(
    message: ChatMessage,
    current_user: Dict[str, Any] = Depends(get_current_user),
    chroma_client: ChromaClient = Depends(ChromaClient)
):
    """Chat with the AI using user's memory context"""
    try:
        chat_service = ChatService(chroma_client)
        result = await chat_service.chat(
            user_id=current_user["id"],
            message=message.message
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 