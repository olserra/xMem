import chromadb
from chromadb.config import Settings
from typing import List, Dict
import PyPDF2
import requests
from bs4 import BeautifulSoup
import base64
import io
from langchain.text_splitter import RecursiveCharacterTextSplitter

class KnowledgeBaseService:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            chroma_api_impl="rest",
            chroma_server_host="chroma",
            chroma_server_http_port=8000
        ))
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

    def get_or_create_collection(self, user_id: str):
        """Get or create a collection for a specific user"""
        try:
            return self.client.get_collection(name=f"user_{user_id}")
        except:
            return self.client.create_collection(name=f"user_{user_id}")

    def get_relevant_context(self, user_id: str, query: str, k: int = 5) -> List[str]:
        """Retrieve relevant context from the user's knowledge base"""
        collection = self.get_or_create_collection(user_id)
        results = collection.query(
            query_texts=[query],
            n_results=k
        )
        return results['documents'][0] if results['documents'] else []

    async def add_document(self, user_id: str, doc_type: str, content: str):
        """Add a document to the user's knowledge base"""
        collection = self.get_or_create_collection(user_id)
        
        if doc_type == "webpage":
            text = self._process_webpage(content)
        elif doc_type == "pdf":
            text = self._process_pdf(content)
        else:
            raise ValueError(f"Unsupported document type: {doc_type}")

        # Split text into chunks
        chunks = self.text_splitter.split_text(text)
        
        # Add chunks to ChromaDB
        collection.add(
            documents=chunks,
            ids=[f"{doc_type}_{i}" for i in range(len(chunks))],
            metadatas=[{"source": content, "type": doc_type} for _ in chunks]
        )

    def _process_webpage(self, url: str) -> str:
        """Extract text content from a webpage"""
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        return soup.get_text(separator='\n')

    def _process_pdf(self, pdf_base64: str) -> str:
        """Extract text content from a base64 encoded PDF"""
        pdf_bytes = base64.b64decode(pdf_base64)
        pdf_file = io.BytesIO(pdf_bytes)
        
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        return text 