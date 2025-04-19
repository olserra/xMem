# WhatsApp Agent Service

This service provides a WhatsApp agent that can process text and audio queries using open-source models and maintain separate knowledge bases for different users.

## Features

- Process text and audio queries using Mistral 7B (open source LLM)
- Audio transcription using Whisper
- PDF and webpage content ingestion
- Per-user knowledge base using ChromaDB
- n8n integration for WhatsApp connectivity

## Setup

1. Make sure you have Docker and Docker Compose installed

2. Start the services:
```bash
docker-compose up -d
```

3. The following services will be available:
- WhatsApp Agent API: http://localhost:8080
- n8n: http://localhost:5678
- ChromaDB: http://localhost:8000

## API Endpoints

### Query Endpoint
```http
POST /query
Content-Type: application/json

{
    "user_id": "string",
    "query": "string",
    "audio_url": "string" (optional)
}
```

### Upload Document
```http
POST /upload
Content-Type: application/json

{
    "user_id": "string",
    "document_type": "pdf" | "webpage",
    "content": "string" (URL for webpage, base64 for PDF)
}
```

## n8n Setup

1. Access n8n at http://localhost:5678
2. Create a new workflow
3. Add a WhatsApp Trigger node
4. Connect it to an HTTP Request node pointing to the WhatsApp Agent API
5. Deploy the workflow

## Models Used

- LLM: Mistral 7B Instruct
- Audio Transcription: Whisper (small model)
- Embeddings: Sentence Transformers

## Environment Variables

The service uses the following environment variables:
- `N8N_HOST`: n8n host (default: localhost)
- `N8N_PROTOCOL`: n8n protocol (default: http)

## Notes

- The service uses ChromaDB for vector storage, allowing efficient retrieval of relevant context
- Each user has their own isolated knowledge base
- The service can process both text and audio queries
- Documents (PDFs and webpages) are automatically chunked and embedded for efficient retrieval 