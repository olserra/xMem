import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from typing import List, Optional, Dict, Any
from datetime import datetime
import os

class ChromaClient:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            chroma_api_impl="rest",
            chroma_server_host=os.getenv("CHROMA_HOST", "localhost"),
            chroma_server_http_port=int(os.getenv("CHROMA_PORT", "8000"))
        ))
        
        # Using sentence-transformers for embeddings
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Collections cache
        self.collections = {}
        self._current_user_id = None
    
    def _get_collection_name(self, user_id: str) -> str:
        """Generate a consistent collection name for a user"""
        return f"user_{user_id}_memories"
    
    async def initialize_collection(self, user_id: str) -> Dict[str, str]:
        """Initialize or get a collection for a user"""
        collection_name = self._get_collection_name(user_id)
        self._current_user_id = user_id
        
        if collection_name not in self.collections:
            self.collections[collection_name] = self.client.get_or_create_collection(
                name=collection_name,
                embedding_function=self.embedding_function,
                metadata={
                    "hnsw:space": "cosine",
                    "user_id": user_id,
                    "created_at": datetime.utcnow().isoformat()
                }
            )
        
        return {
            "collection_name": collection_name,
            "user_id": user_id
        }
    
    def _get_current_collection(self) -> chromadb.Collection:
        """Get the current user's collection"""
        if not self._current_user_id:
            raise ValueError("No active user collection. Call initialize_collection first.")
        
        collection_name = self._get_collection_name(self._current_user_id)
        if collection_name not in self.collections:
            raise ValueError("Collection not initialized. Call initialize_collection first.")
            
        return self.collections[collection_name]
        
    async def create_memory(
        self,
        content: str,
        metadata: Dict[str, Any] = {},
        tags: List[str] = [],
        project_id: Optional[str] = None,
        type: str = "memory",
        user_id: Optional[str] = None  # For initial collection setup only
    ) -> str:
        """Create a new memory with embeddings in user's collection"""
        if user_id:
            await self.initialize_collection(user_id)
            
        collection = self._get_current_collection()
        memory_id = chromadb.utils.generate_uuid()
        
        # Prepare metadata
        full_metadata = {
            "user_id": self._current_user_id,
            "tags": tags,
            "project_id": project_id,
            "type": type,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **metadata
        }
        
        # Add to collection
        collection.add(
            ids=[memory_id],
            documents=[content],
            metadatas=[full_metadata]
        )
        
        return memory_id
    
    async def query_memories(
        self,
        query: str,
        filter_metadata: Optional[Dict[str, Any]] = None,
        n_results: int = 10
    ) -> Dict[str, Any]:
        """Search semantically similar memories in user's collection"""
        collection = self._get_current_collection()
        where = {}
        if filter_metadata:
            where.update(filter_metadata)
            
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where
        )
        
        return {
            "ids": results["ids"][0] if results["ids"] else [],
            "documents": results["documents"][0] if results["documents"] else [],
            "metadatas": results["metadatas"][0] if results["metadatas"] else [],
            "distances": results["distances"][0] if results["distances"] else []
        }
    
    async def get_project_memories(
        self,
        project_id: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Retrieve all memories from a project in user's collection"""
        collection = self._get_current_collection()
        where = {}
        if project_id:
            where["project_id"] = project_id
        if tags:
            where["tags"] = {"$in": tags}
            
        results = collection.get(
            where=where
        )
        
        return {
            "ids": results["ids"],
            "documents": results["documents"],
            "metadatas": results["metadatas"]
        }
    
    async def update_memory(
        self,
        memory_id: str,
        content: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Update an existing memory in user's collection"""
        collection = self._get_current_collection()
        current = collection.get(
            ids=[memory_id]
        )
        
        if not current["ids"]:
            raise ValueError(f"Memory {memory_id} not found or access denied")
            
        # Verify memory belongs to current user
        if current["metadatas"][0]["user_id"] != self._current_user_id:
            raise ValueError("Access denied: Memory belongs to another user")
            
        update_data = {}
        if content:
            update_data["documents"] = [content]
        if metadata:
            current_metadata = current["metadatas"][0]
            update_metadata = {
                **current_metadata,
                **metadata,
                "updated_at": datetime.utcnow().isoformat()
            }
            update_data["metadatas"] = [update_metadata]
            
        if update_data:
            collection.update(
                ids=[memory_id],
                **update_data
            )
    
    async def delete_memory(
        self,
        memory_id: str
    ):
        """Remove a memory from user's collection"""
        collection = self._get_current_collection()
        current = collection.get(
            ids=[memory_id]
        )
        
        if not current["ids"]:
            raise ValueError(f"Memory {memory_id} not found or access denied")
            
        # Verify memory belongs to current user
        if current["metadatas"][0]["user_id"] != self._current_user_id:
            raise ValueError("Access denied: Memory belongs to another user")
            
        collection.delete(ids=[memory_id])
    
    async def assign_to_project(
        self,
        memory_id: str,
        project_id: str
    ):
        """Associate a memory with a project in user's collection"""
        await self.update_memory(
            memory_id=memory_id,
            metadata={"project_id": project_id}
        ) 