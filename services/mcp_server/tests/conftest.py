import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from ..main import app
from ..db.chroma_client import ChromaClient

@pytest.fixture
def temp_db_path():
    """Create a temporary directory for ChromaDB data"""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir

@pytest.fixture
def chroma_client(temp_db_path):
    """Create a ChromaClient instance with temporary storage"""
    client = ChromaClient(persist_directory=temp_db_path)
    yield client
    # Cleanup happens automatically when temp_dir is deleted

@pytest.fixture
def test_client():
    """Create a FastAPI TestClient"""
    return TestClient(app)

@pytest.fixture
def test_user():
    """Create a test user context"""
    return {
        "id": "test-user-id",
        "token": "test-bearer-token"
    }

@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers"""
    return {"Authorization": f"Bearer {test_user['token']}"} 