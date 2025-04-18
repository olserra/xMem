from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from .db.chroma_client import ChromaClient
import os

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaClient
chroma_client = ChromaClient(
    persist_directory=os.getenv("CHROMA_DB_PATH", "./chroma_db")
)

class Memory(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = {}
    tags: Optional[List[str]] = []
    project_id: Optional[str] = None
    type: Optional[str] = "memory"

class SearchQuery(BaseModel):
    query: str
    project_id: Optional[str] = None
    tags: Optional[List[str]] = None
    n_results: Optional[int] = 10

class ProjectAssignment(BaseModel):
    memory_id: str
    project_id: str

async def get_user_id(authorization: str = Depends(lambda x: x)) -> str:
    """Extract user ID from authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    return authorization  # In production, validate and extract actual user ID

@app.post("/api/collections/initialize")
async def initialize_collection(user_id: str = Depends(get_user_id)):
    """Initialize a collection for a user"""
    try:
        result = await chroma_client.initialize_collection(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories")
async def create_memory(
    memory: Memory,
    user_id: str = Depends(get_user_id)
):
    """Create a new memory"""
    try:
        memory_id = await chroma_client.create_memory(
            content=memory.content,
            metadata=memory.metadata,
            tags=memory.tags or [],
            project_id=memory.project_id,
            type=memory.type,
            user_id=user_id  # Only needed for initial setup
        )
        return {"memory_id": memory_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/memories/{memory_id}")
async def update_memory(
    memory_id: str,
    memory: Memory,
    _: str = Depends(get_user_id)  # Ensures user is authenticated
):
    """Update an existing memory"""
    try:
        await chroma_client.update_memory(
            memory_id=memory_id,
            content=memory.content,
            metadata=memory.metadata
        )
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/{memory_id}")
async def delete_memory(
    memory_id: str,
    _: str = Depends(get_user_id)  # Ensures user is authenticated
):
    """Delete a memory"""
    try:
        await chroma_client.delete_memory(memory_id)
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories/assign")
async def assign_to_project(
    assignment: ProjectAssignment,
    _: str = Depends(get_user_id)  # Ensures user is authenticated
):
    """Assign a memory to a project"""
    try:
        await chroma_client.assign_to_project(
            memory_id=assignment.memory_id,
            project_id=assignment.project_id
        )
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memories")
async def list_memories(
    project_id: Optional[str] = None,
    tags: Optional[List[str]] = None,
    _: str = Depends(get_user_id)  # Ensures user is authenticated
):
    """List memories, optionally filtered by project and tags"""
    try:
        result = await chroma_client.get_project_memories(
            project_id=project_id,
            tags=tags
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories/search")
async def semantic_search(
    query: SearchQuery,
    _: str = Depends(get_user_id)  # Ensures user is authenticated
):
    """Search memories semantically"""
    try:
        result = await chroma_client.semantic_search(
            query=query.query,
            project_id=query.project_id,
            tags=query.tags,
            n_results=query.n_results
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 