# xmem Memory Context Protocol Server

A FastAPI-based server that provides semantic memory storage and retrieval using ChromaDB.

## Features

- User-specific memory collections
- Semantic search using sentence transformers
- Project-based memory organization
- Tag-based filtering
- Metadata support
- Built-in security with user isolation

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
export CHROMA_DB_PATH="./chroma_db"  # Path to store ChromaDB data
```

## Architecture

### ChromaClient

The `ChromaClient` class (`db/chroma_client.py`) is the core component that handles:

- Memory storage and retrieval using ChromaDB
- User-specific collection management
- Semantic embeddings using sentence transformers
- Access control and user isolation

Key concepts:
- Each user gets their own isolated collection named `user_{id}_memories`
- Collections are lazily initialized when first needed
- All operations are scoped to the current user's collection
- Metadata is used to store tags, project associations, and other structured data

### FastAPI Routes

The API (`main.py`) provides RESTful endpoints for:

- Collection initialization
- Memory CRUD operations
- Project assignment
- Semantic search
- Memory listing with filters

All routes use bearer token authentication and maintain user isolation.

## API Reference

See the [API Documentation](../app/docs/getting-started/api/page.tsx) for detailed endpoint information.

## Development

### Running the Server

```bash
uvicorn mcp_server.main:app --reload
```

### Running Tests

```bash
pytest tests/
```

### Project Structure

```
mcp_server/
├── db/
│   └── chroma_client.py   # ChromaDB integration
├── main.py               # FastAPI application
├── tests/               # Test suite
│   ├── conftest.py     # Test fixtures
│   ├── test_chroma.py  # ChromaClient tests
│   └── test_api.py     # API endpoint tests
└── requirements.txt    # Python dependencies
```

## Testing Strategy

The test suite covers:

1. Unit Tests
   - ChromaClient functionality
   - Collection management
   - Memory operations
   - Search functionality

2. Integration Tests
   - API endpoints
   - Authentication flow
   - Error handling
   - User isolation

3. Performance Tests
   - Search response times
   - Collection scaling
   - Concurrent access

## Security Considerations

1. User Isolation
   - Each user's data is stored in a separate collection
   - Cross-collection access is prevented
   - User verification on all operations

2. Authentication
   - Bearer token required for all operations
   - Token validation and user extraction

3. Error Handling
   - Proper error status codes
   - Informative error messages
   - No sensitive information in responses

## Performance Optimization

1. Collection Management
   - Lazy collection initialization
   - Collection caching
   - Efficient metadata handling

2. Search Optimization
   - Efficient embedding model (all-MiniLM-L6-v2)
   - Metadata-based filtering
   - Configurable result limits

3. Resource Usage
   - Connection pooling
   - Proper cleanup of resources
   - Async operations where possible 