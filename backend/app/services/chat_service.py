from typing import List, Dict, Any
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from app.db.chroma_client import ChromaClient

class ChatService:
    def __init__(self, chroma_client: ChromaClient):
        self.chroma_client = chroma_client
        self.model_name = "facebook/opt-350m"  # Smaller model for testing, can be changed to larger ones
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.pipeline = pipeline(
            "text-generation",
            model=self.model_name,
            tokenizer=self.tokenizer,
            max_length=200,
            temperature=0.7,
        )
        
    async def get_conversation_context(self, user_id: str, query: str) -> List[str]:
        """Retrieve relevant context from user's memory"""
        results = await self.chroma_client.query_memories(
            query=query,
            n_results=5
        )
        return results["documents"]
        
    async def chat(self, user_id: str, message: str) -> Dict[str, Any]:
        """Process a chat message and return the response"""
        # Get relevant context from user's memory
        context = await self.get_conversation_context(user_id, message)
        
        # Create prompt with context
        prompt = f"""Context from memory:
{' '.join(context)}

User: {message}
Assistant:"""
        
        # Get response
        response = self.pipeline(prompt)[0]['generated_text']
        # Extract only the assistant's response
        response = response.split("Assistant:")[-1].strip()
        
        # Store the conversation in ChromaDB
        await self.chroma_client.create_memory(
            content=f"User: {message}\nAssistant: {response}",
            metadata={
                "type": "conversation",
                "role": "assistant"
            },
            tags=["conversation"],
            user_id=user_id
        )
        
        return {
            "response": response,
            "context_used": context
        } 