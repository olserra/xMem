import pytest
from ..db.chroma_client import ChromaClient

@pytest.mark.asyncio
async def test_initialize_collection(chroma_client, test_user):
    """Test collection initialization"""
    result = await chroma_client.initialize_collection(test_user["id"])
    assert result["collection_name"] == f"user_{test_user['id']}_memories"
    assert result["user_id"] == test_user["id"]

@pytest.mark.asyncio
async def test_create_memory(chroma_client, test_user):
    """Test memory creation"""
    # Initialize collection
    await chroma_client.initialize_collection(test_user["id"])
    
    # Create memory
    memory_id = await chroma_client.create_memory(
        content="Test memory",
        tags=["test", "memory"],
        project_id="test-project",
        metadata={"source": "test"},
        type="memory",
        user_id=test_user["id"]
    )
    
    assert memory_id is not None
    
    # Verify memory exists
    collection = chroma_client._get_current_collection()
    result = collection.get(ids=[memory_id])
    assert result["documents"][0] == "Test memory"
    assert result["metadatas"][0]["tags"] == ["test", "memory"]
    assert result["metadatas"][0]["project_id"] == "test-project"
    assert result["metadatas"][0]["source"] == "test"

@pytest.mark.asyncio
async def test_update_memory(chroma_client, test_user):
    """Test memory update"""
    # Create initial memory
    await chroma_client.initialize_collection(test_user["id"])
    memory_id = await chroma_client.create_memory(
        content="Initial content",
        user_id=test_user["id"]
    )
    
    # Update memory
    await chroma_client.update_memory(
        memory_id=memory_id,
        content="Updated content",
        metadata={"updated": True}
    )
    
    # Verify update
    collection = chroma_client._get_current_collection()
    result = collection.get(ids=[memory_id])
    assert result["documents"][0] == "Updated content"
    assert result["metadatas"][0]["updated"] is True

@pytest.mark.asyncio
async def test_delete_memory(chroma_client, test_user):
    """Test memory deletion"""
    # Create memory
    await chroma_client.initialize_collection(test_user["id"])
    memory_id = await chroma_client.create_memory(
        content="To be deleted",
        user_id=test_user["id"]
    )
    
    # Delete memory
    await chroma_client.delete_memory(memory_id)
    
    # Verify deletion
    collection = chroma_client._get_current_collection()
    result = collection.get(ids=[memory_id])
    assert len(result["ids"]) == 0

@pytest.mark.asyncio
async def test_query_memories(chroma_client, test_user):
    """Test memory querying"""
    # Initialize and create test memories
    await chroma_client.initialize_collection(test_user["id"])
    await chroma_client.create_memory(
        content="Python programming",
        tags=["coding"],
        user_id=test_user["id"]
    )
    await chroma_client.create_memory(
        content="Machine learning concepts",
        tags=["ai"],
        user_id=test_user["id"]
    )
    
    # Test semantic search
    results = await chroma_client.query_memories(
        query="programming languages",
        n_results=1
    )
    assert len(results["ids"]) == 1
    assert "Python programming" in results["documents"]

@pytest.mark.asyncio
async def test_get_project_memories(chroma_client, test_user):
    """Test project-based memory retrieval"""
    # Initialize and create test memories
    await chroma_client.initialize_collection(test_user["id"])
    memory_id = await chroma_client.create_memory(
        content="Project note",
        project_id="test-project",
        tags=["note"],
        user_id=test_user["id"]
    )
    
    # Test project filtering
    results = await chroma_client.get_project_memories(
        project_id="test-project",
        tags=["note"]
    )
    assert len(results["ids"]) == 1
    assert results["ids"][0] == memory_id

@pytest.mark.asyncio
async def test_assign_to_project(chroma_client, test_user):
    """Test project assignment"""
    # Create memory
    await chroma_client.initialize_collection(test_user["id"])
    memory_id = await chroma_client.create_memory(
        content="Unassigned note",
        user_id=test_user["id"]
    )
    
    # Assign to project
    await chroma_client.assign_to_project(
        memory_id=memory_id,
        project_id="new-project"
    )
    
    # Verify assignment
    collection = chroma_client._get_current_collection()
    result = collection.get(ids=[memory_id])
    assert result["metadatas"][0]["project_id"] == "new-project"

@pytest.mark.asyncio
async def test_user_isolation(chroma_client):
    """Test user data isolation"""
    # Create memories for two different users
    await chroma_client.initialize_collection("user1")
    memory1 = await chroma_client.create_memory(
        content="User 1 memory",
        user_id="user1"
    )
    
    await chroma_client.initialize_collection("user2")
    memory2 = await chroma_client.create_memory(
        content="User 2 memory",
        user_id="user2"
    )
    
    # Try to access user2's memory as user1
    await chroma_client.initialize_collection("user1")
    with pytest.raises(ValueError, match="Memory .* not found or access denied"):
        await chroma_client.update_memory(memory2, "Unauthorized update")

@pytest.mark.asyncio
async def test_semantic_search(chroma_client, test_user):
    """Test semantic search functionality"""
    # Create test memories
    await chroma_client.initialize_collection(test_user["id"])
    await chroma_client.create_memory(
        content="The quick brown fox jumps over the lazy dog",
        tags=["animals"],
        user_id=test_user["id"]
    )
    await chroma_client.create_memory(
        content="Python is a popular programming language",
        tags=["coding"],
        user_id=test_user["id"]
    )
    
    # Test semantic search with different queries
    results1 = await chroma_client.semantic_search("animals jumping")
    assert "fox" in results1["documents"][0].lower()
    
    results2 = await chroma_client.semantic_search("coding languages")
    assert "python" in results2["documents"][0].lower()

@pytest.mark.asyncio
async def test_error_handling(chroma_client):
    """Test error handling"""
    # Test accessing collection without initialization
    with pytest.raises(ValueError, match="No active user collection"):
        await chroma_client.create_memory("Test")
    
    # Test invalid memory ID
    await chroma_client.initialize_collection("test-user")
    with pytest.raises(ValueError, match="Memory .* not found"):
        await chroma_client.delete_memory("non-existent-id") 