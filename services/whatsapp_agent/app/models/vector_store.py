from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings
import os
from datetime import datetime
import PyPDF2
import requests
from bs4 import BeautifulSoup
import base64
import io
from langchain.text_splitter import RecursiveCharacterTextSplitter

class VectorStore:
    def __init__(self, persist_directory: str = "chroma_data"):
        self.persist_directory = persist_directory
        self.client = chromadb.Client(Settings(
            persist_directory=persist_directory,
            is_persistent=True
        ))
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    def get_or_create_collection(self, name: str):
        """Get or create a collection."""
        try:
            return self.client.get_collection(name=name)
        except:
            return self.client.create_collection(
                name=name,
                metadata={"hnsw:space": "cosine"}
            )
    
    async def store_conversation(
        self,
        text: str,
        labels: List[str],
        user_id: str,
        embeddings: List[float],
        metadata: Dict[str, Any] = None
    ) -> str:
        """Store a conversation chunk with its embeddings and metadata."""
        collection = self.get_or_create_collection("conversations")
        
        # Prepare metadata
        timestamp = datetime.utcnow().isoformat()
        meta = {
            "user_id": user_id,
            "timestamp": timestamp,
            "labels": labels,
            **(metadata or {})
        }
        
        # Generate a unique ID for the chunk
        chunk_id = f"{user_id}_{timestamp}"
        
        # Add the data to ChromaDB
        collection.add(
            ids=[chunk_id],
            embeddings=[embeddings],
            documents=[text],
            metadatas=[meta]
        )
        
        return chunk_id
    
    async def search_conversations(
        self,
        query_embedding: List[float],
        user_id: str = None,
        labels: List[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar conversations with optional filters."""
        collection = self.get_or_create_collection("conversations")
        
        # Prepare the filter conditions
        where = {}
        if user_id:
            where["user_id"] = user_id
        if labels:
            where["labels"] = {"$in": labels}
        
        # Query the collection
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where=where if where else None
        )
        
        # Format the results
        formatted_results = []
        for i in range(len(results['ids'][0])):
            formatted_results.append({
                "id": results['ids'][0][i],
                "text": results['documents'][0][i],
                "metadata": results['metadatas'][0][i],
                "distance": results['distances'][0][i]
            })
        
        return formatted_results
    
    async def get_user_conversations(
        self,
        user_id: str,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Retrieve conversations for a specific user."""
        collection = self.get_or_create_collection("conversations")
        results = collection.get(
            where={"user_id": user_id},
            limit=limit,
            offset=offset
        )
        
        # Format the results
        conversations = []
        for i in range(len(results['ids'])):
            conversations.append({
                "id": results['ids'][i],
                "text": results['documents'][i],
                "metadata": results['metadatas'][i]
            })
        
        return conversations

    async def add_document(
        self,
        user_id: str,
        doc_type: str,
        content: str,
        embeddings_function: Any
    ) -> List[str]:
        """Add a document to the knowledge base and return chunk IDs."""
        collection = self.get_or_create_collection(f"docs_{user_id}")
        
        # Process the document based on type
        if doc_type == "webpage":
            text = self._process_webpage(content)
        elif doc_type == "pdf":
            text = self._process_pdf(content)
        else:
            raise ValueError(f"Unsupported document type: {doc_type}")

        # Split text into chunks
        chunks = self.text_splitter.split_text(text)
        
        # Generate embeddings for chunks
        chunk_embeddings = [embeddings_function(chunk) for chunk in chunks]
        
        # Generate IDs for chunks
        chunk_ids = [f"{doc_type}_{user_id}_{i}_{datetime.utcnow().isoformat()}" 
                    for i in range(len(chunks))]
        
        # Add chunks to ChromaDB
        collection.add(
            ids=chunk_ids,
            embeddings=chunk_embeddings,
            documents=chunks,
            metadatas=[{
                "source": content,
                "type": doc_type,
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            } for _ in chunks]
        )
        
        return chunk_ids

    def _process_webpage(self, url: str) -> str:
        """Extract text content from a webpage."""
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        return soup.get_text(separator='\n')

    def _process_pdf(self, pdf_base64: str) -> str:
        """Extract text content from a base64 encoded PDF."""
        pdf_bytes = base64.b64decode(pdf_base64)
        pdf_file = io.BytesIO(pdf_bytes)
        
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        return text 