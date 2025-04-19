import whisper
import requests
import tempfile
import os
from typing import Optional

class AudioService:
    def __init__(self):
        # Load the small model for faster processing
        self.model = whisper.load_model("small")

    async def transcribe(self, audio_url: str) -> str:
        """Transcribe audio from URL to text"""
        try:
            # Download the audio file
            response = requests.get(audio_url)
            response.raise_for_status()

            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                temp_file.write(response.content)
                temp_path = temp_file.name

            try:
                # Transcribe the audio
                result = self.model.transcribe(temp_path)
                return result["text"].strip()
            finally:
                # Clean up the temporary file
                os.unlink(temp_path)

        except Exception as e:
            raise Exception(f"Failed to transcribe audio: {str(e)}")

    def _is_valid_audio_url(self, url: str) -> bool:
        """Check if the URL points to a valid audio file"""
        try:
            response = requests.head(url)
            content_type = response.headers.get('content-type', '')
            return content_type.startswith('audio/') or content_type == 'application/octet-stream'
        except:
            return False 