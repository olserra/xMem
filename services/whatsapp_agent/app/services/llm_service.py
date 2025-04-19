from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from typing import List
import os

class LLMService:
    def __init__(self):
        # Using Mistral 7B as our open source model
        self.model_name = "mistralai/Mistral-7B-Instruct-v0.1"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )

    def generate_response(self, query: str, context: List[str]) -> str:
        """Generate a response using the LLM based on the query and context"""
        # Prepare the prompt with context
        context_text = "\n".join(context) if context else ""
        prompt = f"""<s>[INST] Context:
{context_text}

Question: {query}

Please provide a helpful response based on the context above. If the context doesn't contain relevant information, provide a general response.[/INST]
"""

        # Tokenize and generate
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        
        # Generate response with specific parameters
        outputs = self.model.generate(
            inputs["input_ids"],
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id
        )

        # Decode and clean up response
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract the actual response (after the prompt)
        response = response.split("[/INST]")[-1].strip()
        
        return response 