from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import chromadb
from chromadb.config import Settings
import os
from .services.knowledge_base import KnowledgeBaseService
from .services.llm_service import LLMService
from .services.audio_service import AudioService

app = FastAPI(title="WhatsApp Agent API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
knowledge_base = KnowledgeBaseService()
llm_service = LLMService()
audio_service = AudioService()

class QueryRequest(BaseModel):
    user_id: str
    query: str
    audio_url: Optional[str] = None

class DocumentUpload(BaseModel):
    user_id: str
    document_type: str  # 'pdf' or 'webpage'
    content: str  # URL for webpage, base64 for PDF

@app.post("/query")
async def process_query(request: QueryRequest):
    try:
        # If audio URL is provided, transcribe it first
        if request.audio_url:
            request.query = await audio_service.transcribe(request.audio_url)

        # Get relevant context from the knowledge base
        context = knowledge_base.get_relevant_context(request.user_id, request.query)

        # Generate response using LLM
        response = llm_service.generate_response(request.query, context)

        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(document: DocumentUpload, background_tasks: BackgroundTasks):
    try:
        # Process document in the background
        background_tasks.add_task(
            knowledge_base.add_document,
            user_id=document.user_id,
            doc_type=document.document_type,
            content=document.content
        )
        return {"message": "Document processing started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 