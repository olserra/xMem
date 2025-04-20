from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
from .models.llm import LLMHandler
from .models.vector_store import VectorStore
from .services.audio_service import AudioService

app = FastAPI(title="WhatsApp Chat Agent")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
llm_handler = LLMHandler()
vector_store = VectorStore(persist_directory="/chroma/data")
audio_service = AudioService()

class Message(BaseModel):
    text: str
    user_id: str
    metadata: Optional[Dict] = None
    audio_url: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    labels: List[str]
    conversation_id: str

class DocumentUpload(BaseModel):
    user_id: str
    document_type: str  # 'pdf' or 'webpage'
    content: str  # URL for webpage, base64 for PDF

class SearchQuery(BaseModel):
    query: str
    user_id: Optional[str] = None
    labels: Optional[List[str]] = None
    limit: Optional[int] = 5

class WhatsAppConfig(BaseModel):
    user_id: str
    enabled: bool
    phoneNumber: str
    welcomeMessage: str
    knowledgeBaseEnabled: bool

class WhatsAppMessage(BaseModel):
    message: str
    user_id: str
    phone_number: str
    message_type: str = "text"  # text, audio, document
    media_url: Optional[str] = None

class WhatsAppResponse(BaseModel):
    response: str
    labels: List[str]
    conversation_id: str
    metadata: Dict

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(message: Message):
    """Process a chat message and store the conversation."""
    try:
        # If audio URL is provided, transcribe it first
        if message.audio_url:
            message.text = await audio_service.transcribe(message.audio_url)

        # Get relevant context from previous conversations
        query_embedding = llm_handler.embeddings.embed_query(message.text)
        context_results = await vector_store.search_conversations(
            query_embedding=query_embedding,
            user_id=message.user_id,
            limit=3
        )
        context = [result["text"] for result in context_results]
        
        # Process the message with LLM
        response = await llm_handler.process_message(message.text, context)
        
        # Extract labels from the conversation
        labels = llm_handler.extract_labels(message.text + "\n" + response)
        
        # Generate embeddings for storage
        conversation_embedding = llm_handler.embeddings.embed_query(
            message.text + "\n" + response
        )
        
        # Store the conversation
        conversation_id = await vector_store.store_conversation(
            text=message.text + "\n" + response,
            labels=labels,
            user_id=message.user_id,
            embeddings=conversation_embedding,
            metadata=message.metadata
        )
        
        return ChatResponse(
            response=response,
            labels=labels,
            conversation_id=conversation_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(document: DocumentUpload, background_tasks: BackgroundTasks):
    """Upload and process a document."""
    try:
        # Process document in the background
        chunk_ids = await vector_store.add_document(
            user_id=document.user_id,
            doc_type=document.document_type,
            content=document.content,
            embeddings_function=llm_handler.embeddings.embed_query
        )
        return {
            "message": "Document processing completed",
            "chunk_ids": chunk_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search_conversations(query: SearchQuery):
    """Search for similar conversations."""
    try:
        # Generate query embeddings
        query_embedding = llm_handler.embeddings.embed_query(query.query)
        
        # Search in vector store
        results = await vector_store.search_conversations(
            query_embedding=query_embedding,
            user_id=query.user_id,
            labels=query.labels,
            limit=query.limit
        )
        
        return {"results": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{user_id}")
async def get_user_conversations(
    user_id: str,
    limit: int = 100,
    offset: int = 0
):
    """Retrieve conversations for a specific user."""
    try:
        conversations = await vector_store.get_user_conversations(
            user_id=user_id,
            limit=limit,
            offset=offset
        )
        return {"conversations": conversations}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/whatsapp/config")
async def update_whatsapp_config(config: WhatsAppConfig):
    """Update WhatsApp configuration for a user."""
    try:
        # Store in vector store metadata for context
        metadata = {
            "type": "whatsapp_config",
            "enabled": config.enabled,
            "phone_number": config.phoneNumber,
            "welcome_message": config.welcomeMessage,
            "knowledge_base_enabled": config.knowledgeBaseEnabled
        }
        
        # Store as a special document
        config_embedding = llm_handler.embeddings.embed_query(
            f"WhatsApp Configuration: {config.welcomeMessage}"
        )
        
        await vector_store.store_conversation(
            text=f"WhatsApp Configuration:\n{config.welcomeMessage}",
            labels=["whatsapp", "config"],
            user_id=config.user_id,
            embeddings=config_embedding,
            metadata=metadata
        )
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/whatsapp/webhook", response_model=WhatsAppResponse)
async def whatsapp_webhook(message: WhatsAppMessage):
    """Handle incoming WhatsApp messages."""
    try:
        # Get user configuration
        config_results = await vector_store.search_conversations(
            query_embedding=llm_handler.embeddings.embed_query("WhatsApp Configuration"),
            user_id=message.user_id,
            labels=["whatsapp", "config"],
            limit=1
        )
        
        user_config = config_results[0]["metadata"] if config_results else {}
        
        # Handle different message types
        if message.message_type == "audio" and message.media_url:
            message.message = await audio_service.transcribe(message.media_url)
        
        # Get conversation context
        query_embedding = llm_handler.embeddings.embed_query(message.message)
        context_results = await vector_store.search_conversations(
            query_embedding=query_embedding,
            user_id=message.user_id,
            limit=3
        )
        context = [result["text"] for result in context_results]
        
        # Process message with WhatsApp-specific handling
        response, labels, metadata = await llm_handler.process_whatsapp_message(
            message=message.message,
            user_id=message.user_id,
            user_config=user_config,
            context=context
        )
        
        # Store the conversation
        conversation_embedding = llm_handler.embeddings.embed_query(
            message.message + "\n" + response
        )
        
        conversation_id = await vector_store.store_conversation(
            text=message.message + "\n" + response,
            labels=labels,
            user_id=message.user_id,
            embeddings=conversation_embedding,
            metadata={
                **metadata,
                "message_type": message.message_type
            }
        )
        
        return WhatsAppResponse(
            response=response,
            labels=labels,
            conversation_id=conversation_id,
            metadata=metadata
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"} 