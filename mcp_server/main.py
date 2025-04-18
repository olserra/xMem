from fastapi import FastAPI, HTTPException, Depends
from model_context_protocol import MCPServer, MCPFunction, MCPResponse
from typing import List, Optional, Dict, Any
from .db.chroma_client import ChromaClient
from .auth import User, get_user_dependency
import json

app = FastAPI()
mcp_server = MCPServer()
chroma_client = ChromaClient()

# Funções MCP para Memórias
@mcp_server.function()
async def create_memory(
    content: str,
    tags: List[str] = [],
    project_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        memory_id = await chroma_client.create_memory(
            content=content,
            user_id=user.id,
            tags=tags,
            project_id=project_id,
            metadata=metadata or {}
        )
        return MCPResponse(
            status="success",
            data={"memory_id": memory_id}
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )

@mcp_server.function()
async def update_memory(
    memory_id: str,
    content: Optional[str] = None,
    tags: Optional[List[str]] = None,
    metadata: Optional[Dict[str, Any]] = None,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        update_metadata = {}
        if tags is not None:
            update_metadata["tags"] = tags
        if metadata:
            update_metadata.update(metadata)
            
        await chroma_client.update_memory(
            memory_id=memory_id,
            user_id=user.id,
            content=content,
            metadata=update_metadata if update_metadata else None
        )
        return MCPResponse(
            status="success",
            data={"message": "Memory updated successfully"}
        )
    except ValueError as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=f"Unexpected error: {str(e)}"
        )

@mcp_server.function()
async def delete_memory(
    memory_id: str,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        await chroma_client.delete_memory(memory_id, user.id)
        return MCPResponse(
            status="success",
            data={"message": "Memory deleted successfully"}
        )
    except ValueError as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=f"Unexpected error: {str(e)}"
        )

@mcp_server.function()
async def assign_to_project(
    memory_id: str,
    project_id: str,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        await chroma_client.assign_to_project(
            memory_id=memory_id,
            user_id=user.id,
            project_id=project_id
        )
        return MCPResponse(
            status="success",
            data={"message": "Memory assigned to project successfully"}
        )
    except ValueError as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=f"Unexpected error: {str(e)}"
        )

@mcp_server.function()
async def list_memories(
    project_id: Optional[str] = None,
    tags: Optional[List[str]] = None,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        memories = await chroma_client.get_project_memories(
            user_id=user.id,
            project_id=project_id,
            tags=tags
        )
        return MCPResponse(
            status="success",
            data={"memories": memories}
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )

@mcp_server.function()
async def semantic_search(
    query: str,
    project_id: Optional[str] = None,
    tags: Optional[List[str]] = None,
    n_results: int = 10,
    user: User = Depends(get_user_dependency())
) -> MCPResponse:
    try:
        results = await chroma_client.semantic_search(
            query=query,
            user_id=user.id,
            project_id=project_id,
            tags=tags,
            n_results=n_results
        )
        return MCPResponse(
            status="success",
            data={"results": results}
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )

# Funções MCP para Projetos
@mcp_server.function()
async def create_project(name: str, description: Optional[str] = None) -> MCPResponse:
    try:
        # Implementar criação de projeto
        return MCPResponse(
            status="success",
            data={"message": "Project created successfully"}
        )
    except Exception as e:
        return MCPResponse(
            status="error",
            error=str(e)
        )

# Integração com FastAPI
app.include_router(mcp_server.router, prefix="/mcp")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 