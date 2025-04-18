import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from typing import List, Optional, Dict, Any
import json
from datetime import datetime

class ChromaClient:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.client = chromadb.Client(Settings(
            persist_directory=persist_directory,
            anonymized_telemetry=False
        ))
        
        # Usando sentence-transformers para embeddings
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Coleção principal para memórias
        self.memories = self.client.get_or_create_collection(
            name="memories",
            embedding_function=self.embedding_function,
            metadata={"hnsw:space": "cosine"}
        )
        
    async def create_memory(
        self,
        content: str,
        user_id: str,
        metadata: Dict[str, Any] = {},
        tags: List[str] = [],
        project_id: Optional[str] = None,
        type: str = "memory"
    ) -> str:
        """Cria uma nova memória com embeddings"""
        memory_id = chromadb.utils.generate_uuid()
        
        # Preparar metadados
        full_metadata = {
            "user_id": user_id,
            "tags": tags,
            "project_id": project_id,
            "type": type,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **metadata
        }
        
        # Adicionar à coleção
        self.memories.add(
            ids=[memory_id],
            documents=[content],
            metadatas=[full_metadata]
        )
        
        return memory_id
    
    async def query_memories(
        self,
        query: str,
        user_id: str,
        filter_metadata: Optional[Dict[str, Any]] = None,
        n_results: int = 10
    ) -> Dict[str, Any]:
        """Busca memórias semanticamente similares"""
        where = {"user_id": user_id}
        if filter_metadata:
            where.update(filter_metadata)
            
        results = self.memories.query(
            query_texts=[query],
            n_results=n_results,
            where=where
        )
        
        return {
            "ids": results["ids"][0],
            "documents": results["documents"][0],
            "metadatas": results["metadatas"][0],
            "distances": results["distances"][0]
        }
    
    async def get_project_memories(
        self,
        user_id: str,
        project_id: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Recupera todas as memórias de um projeto"""
        where = {"user_id": user_id}
        if project_id:
            where["project_id"] = project_id
        if tags:
            where["tags"] = {"$in": tags}
            
        results = self.memories.get(
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
        user_id: str,
        content: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Atualiza uma memória existente"""
        current = self.memories.get(
            ids=[memory_id],
            where={"user_id": user_id}
        )
        
        if not current["ids"]:
            raise ValueError(f"Memory {memory_id} not found or access denied")
            
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
            self.memories.update(
                ids=[memory_id],
                **update_data
            )
    
    async def delete_memory(
        self,
        memory_id: str,
        user_id: str
    ):
        """Remove uma memória"""
        # Verifica se o usuário tem acesso
        current = self.memories.get(
            ids=[memory_id],
            where={"user_id": user_id}
        )
        
        if not current["ids"]:
            raise ValueError(f"Memory {memory_id} not found or access denied")
            
        self.memories.delete(ids=[memory_id])
    
    async def assign_to_project(
        self,
        memory_id: str,
        user_id: str,
        project_id: str
    ):
        """Associa uma memória a um projeto"""
        await self.update_memory(
            memory_id=memory_id,
            user_id=user_id,
            metadata={"project_id": project_id}
        )
        
    async def semantic_search(
        self,
        query: str,
        user_id: str,
        project_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        n_results: int = 10
    ) -> Dict[str, Any]:
        """Busca semântica em memórias com filtros"""
        filter_metadata = {"user_id": user_id}
        if project_id:
            filter_metadata["project_id"] = project_id
        if tags:
            filter_metadata["tags"] = {"$in": tags}
            
        return await self.query_memories(
            query=query,
            user_id=user_id,
            filter_metadata=filter_metadata,
            n_results=n_results
        ) 