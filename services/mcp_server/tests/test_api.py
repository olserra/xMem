import pytest
from fastapi.testclient import TestClient
from ..main import app

def test_initialize_collection(test_client, auth_headers):
    """Test collection initialization endpoint"""
    response = test_client.post("/api/collections/initialize", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "collection_name" in data
    assert "user_id" in data

def test_create_memory(test_client, auth_headers):
    """Test memory creation endpoint"""
    # Initialize collection first
    test_client.post("/api/collections/initialize", headers=auth_headers)
    
    # Create memory
    memory_data = {
        "content": "Test memory content",
        "tags": ["test", "api"],
        "project_id": "test-project",
        "metadata": {"source": "api-test"},
        "type": "memory"
    }
    response = test_client.post(
        "/api/memories",
        headers=auth_headers,
        json=memory_data
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "memory_id" in data

def test_update_memory(test_client, auth_headers):
    """Test memory update endpoint"""
    # Create a memory first
    test_client.post("/api/collections/initialize", headers=auth_headers)
    create_response = test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={"content": "Initial content"}
    )
    memory_id = create_response.json()["memory_id"]
    
    # Update memory
    update_data = {
        "content": "Updated content",
        "metadata": {"updated": True}
    }
    response = test_client.put(
        f"/api/memories/{memory_id}",
        headers=auth_headers,
        json=update_data
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_delete_memory(test_client, auth_headers):
    """Test memory deletion endpoint"""
    # Create a memory first
    test_client.post("/api/collections/initialize", headers=auth_headers)
    create_response = test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={"content": "To be deleted"}
    )
    memory_id = create_response.json()["memory_id"]
    
    # Delete memory
    response = test_client.delete(
        f"/api/memories/{memory_id}",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_assign_to_project(test_client, auth_headers):
    """Test project assignment endpoint"""
    # Create a memory first
    test_client.post("/api/collections/initialize", headers=auth_headers)
    create_response = test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={"content": "Unassigned memory"}
    )
    memory_id = create_response.json()["memory_id"]
    
    # Assign to project
    assignment_data = {
        "memory_id": memory_id,
        "project_id": "new-project"
    }
    response = test_client.post(
        "/api/memories/assign",
        headers=auth_headers,
        json=assignment_data
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_list_memories(test_client, auth_headers):
    """Test memory listing endpoint"""
    # Create test memories
    test_client.post("/api/collections/initialize", headers=auth_headers)
    test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={
            "content": "Test memory 1",
            "tags": ["test"],
            "project_id": "test-project"
        }
    )
    test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={
            "content": "Test memory 2",
            "tags": ["test"],
            "project_id": "test-project"
        }
    )
    
    # List memories
    response = test_client.get(
        "/api/memories",
        headers=auth_headers,
        params={
            "project_id": "test-project",
            "tags": ["test"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["ids"]) == 2
    assert len(data["documents"]) == 2
    assert len(data["metadatas"]) == 2

def test_semantic_search(test_client, auth_headers):
    """Test semantic search endpoint"""
    # Create test memories
    test_client.post("/api/collections/initialize", headers=auth_headers)
    test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={
            "content": "Python is a great programming language",
            "tags": ["coding"]
        }
    )
    test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={
            "content": "Machine learning is fascinating",
            "tags": ["ai"]
        }
    )
    
    # Perform search
    search_data = {
        "query": "programming languages",
        "project_id": None,
        "tags": None,
        "n_results": 1
    }
    response = test_client.post(
        "/api/memories/search",
        headers=auth_headers,
        json=search_data
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["ids"]) == 1
    assert "python" in data["documents"][0].lower()

def test_authentication_required(test_client):
    """Test that authentication is required"""
    response = test_client.post("/api/collections/initialize")
    assert response.status_code == 401
    assert "Authorization header required" in response.json()["detail"]

def test_error_handling(test_client, auth_headers):
    """Test API error handling"""
    # Test non-existent memory
    response = test_client.delete(
        "/api/memories/non-existent-id",
        headers=auth_headers
    )
    assert response.status_code == 403
    
    # Test invalid request body
    response = test_client.post(
        "/api/memories",
        headers=auth_headers,
        json={}  # Missing required fields
    )
    assert response.status_code == 422  # Validation error 