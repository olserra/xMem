from typing import List, Optional, Dict, Tuple
from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os

class LLMHandler:
    def __init__(self):
        # Initialize callback manager for streaming
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        
        # Initialize the Mistral model for main interactions
        self.model_name = "mistralai/Mistral-7B-Instruct-v0.1"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        
        # Initialize LlamaCpp for specific tasks (like labeling)
        self.llama = LlamaCpp(
            model_path="models/llama-2-7b-chat.gguf",
            temperature=0.7,
            max_tokens=2000,
            top_p=1,
            callback_manager=callback_manager,
            verbose=True,
            n_ctx=4096,
        )
        
        # Initialize embeddings model
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Initialize conversation memory
        self.memory = ConversationBufferMemory(
            return_messages=True,
            memory_key="chat_history"
        )
        
        # Initialize conversation chain with Mistral
        self.conversation = ConversationChain(
            llm=self.llama,  # Using LlamaCpp for conversation to save GPU memory
            memory=self.memory,
            prompt=self._get_prompt_template(),
            verbose=True
        )

    def _get_prompt_template(self) -> ChatPromptTemplate:
        """Creates the prompt template for the conversation."""
        system_message = """You are a helpful AI assistant that helps users manage their knowledge and information.
        You can help them understand their data, answer questions, and provide insights.
        Always be concise and clear in your responses."""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        return prompt

    async def process_message(self, message: str, context: List[str] = None) -> str:
        """Process a message and return the response."""
        try:
            if context:
                # If context is provided, use Mistral for better context understanding
                context_text = "\n".join(context)
                prompt = f"""<s>[INST] Context:
{context_text}

Question: {message}

Please provide a helpful response based on the context above. If the context doesn't contain relevant information, provide a general response.[/INST]
"""
                inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
                outputs = self.model.generate(
                    inputs["input_ids"],
                    max_new_tokens=512,
                    temperature=0.7,
                    top_p=0.95,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                response = response.split("[/INST]")[-1].strip()
            else:
                # For regular conversation, use the conversation chain with LlamaCpp
                response = self.conversation.predict(input=message)
            
            return response
        except Exception as e:
            print(f"Error processing message: {e}")
            return "I apologize, but I encountered an error processing your message. Please try again."
    
    def extract_labels(self, text: str, max_labels: int = 5) -> List[str]:
        """Extract relevant labels from the text using the LLM."""
        label_prompt = f"""Extract up to {max_labels} relevant labels/tags from the following text. 
        Return only the labels, separated by commas:
        
        Text: {text}
        
        Labels:"""
        
        try:
            response = self.llama.predict(label_prompt)
            labels = [label.strip() for label in response.split(',')]
            return labels[:max_labels]
        except Exception as e:
            print(f"Error extracting labels: {e}")
            return []

    @staticmethod
    async def __download_model():
        """Download the LLaMA model if not present."""
        from huggingface_hub import hf_hub_download
        import os
        
        model_path = "models/llama-2-7b-chat.gguf"
        if not os.path.exists(model_path):
            os.makedirs("models", exist_ok=True)
            # Download the GGUF format model from HuggingFace
            hf_hub_download(
                repo_id="TheBloke/Llama-2-7B-Chat-GGUF",
                filename="llama-2-7b-chat.Q4_K_M.gguf",
                local_dir="models",
                local_dir_use_symlinks=False
            )
            # Rename for consistency
            os.rename(
                "models/llama-2-7b-chat.Q4_K_M.gguf",
                model_path
            ) 

    async def process_whatsapp_message(
        self,
        message: str,
        user_id: str,
        user_config: Dict,
        context: List[str] = None
    ) -> Tuple[str, List[str], Dict]:
        """Process a WhatsApp message with user-specific configuration."""
        try:
            # Add user configuration to context
            config_context = f"""User Configuration:
            - Knowledge Base Enabled: {user_config.get('knowledgeBaseEnabled', False)}
            - Welcome Message: {user_config.get('welcomeMessage', '')}
            """
            
            full_context = [config_context] + (context or [])
            
            # Process message
            response = await self.process_message(message, full_context)
            
            # Extract labels
            labels = self.extract_labels(message + "\n" + response)
            
            # Prepare metadata
            metadata = {
                "source": "whatsapp",
                "phone_number": user_config.get('phoneNumber'),
                "knowledge_base_enabled": user_config.get('knowledgeBaseEnabled', False)
            }
            
            return response, labels, metadata
            
        except Exception as e:
            print(f"Error processing WhatsApp message: {e}")
            return (
                "I apologize, but I encountered an error processing your message. Please try again.",
                ["error", "whatsapp"],
                {"error": str(e)}
            ) 