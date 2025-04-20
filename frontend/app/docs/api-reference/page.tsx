import { Metadata } from "next";
import { DocLayout } from '@/app/components/docs/DocLayout';

export const metadata: Metadata = {
    title: "API Reference | xmem Documentation",
    description: "Detailed API reference for integrating and extending xmem.",
};

export default function ApiReferencePage() {
    return (
        <DocLayout>
            <h1>API Reference</h1>

            <h2>Overview</h2>
            <p>
                The xmem API provides a powerful interface for managing memories and their semantic relationships.
                Built with Python and ChromaDB, it offers vector-based semantic search capabilities while maintaining
                strict user isolation and data security through the MCP (Memory Control Protocol) architecture.
            </p>

            <h2>MCP Client</h2>
            <p>
                The MCP client is the primary interface for interacting with xmem. It handles authentication,
                collection management, and all memory operations automatically.
            </p>
            <pre>
                {`from mcp_client import MCPClient

# Initialize the client
client = MCPClient()

# The client automatically handles user-specific collections
# No need to pass user_id in individual operations`}
            </pre>

            <h2>Memory Operations</h2>
            
            <h3>Creating Memories</h3>
            <pre>
                {`# Create a new memory
memory_id = client.create_memory(
    content="Memory content",
    tags=["tag1", "tag2"],
    project_id="optional-project-id",  # Optional
    metadata={
        "source": "meeting",
        "participants": ["alice", "bob"]
    }
)`}
            </pre>

            <h3>Querying Memories</h3>
            <pre>
                {`# Semantic search
results = client.query_memories(
    query="search query",
    n_results=10,
    project_id="optional-project-id",  # Optional
    tags=["optional", "tags"]  # Optional
)

# Get project-specific memories
project_memories = client.get_project_memories(
    project_id="project-id",
    tags=["optional", "tags"]  # Optional
)`}
            </pre>

            <h3>Updating and Deleting</h3>
            <pre>
                {`# Update a memory
client.update_memory(
    memory_id="memory-id",
    content="Updated content",
    metadata={"updated_field": "new value"}
)

# Delete a memory
client.delete_memory(memory_id="memory-id")

# Assign to project
client.assign_to_project(
    memory_id="memory-id",
    project_id="project-id"
)`}
            </pre>

            <h2>Collection Management</h2>
            <p>
                Collections are automatically managed by the MCP client. Each user has their own collection,
                and the client handles all collection operations internally. There's no need to manually
                manage collections or pass user IDs.
            </p>

            <h2>Error Handling</h2>
            <pre>
                {`from mcp_client.exceptions import MCPError

try:
    client.create_memory(content="test")
except MCPError as e:
    print(f"Error: {e}")  # Handles all MCP-specific errors

# Common error types:
# - MCPAuthenticationError: Authentication issues
# - MCPPermissionError: Attempting to access unauthorized resources
# - MCPNotFoundError: Resource not found
# - MCPValidationError: Invalid input data`}
            </pre>

            <h2>Best Practices</h2>
            <ul>
                <li>Initialize one MCP client per user session</li>
                <li>Use appropriate exception handling for error cases</li>
                <li>Leverage tags and metadata for better organization</li>
                <li>Use project_id when organizing memories by context</li>
            </ul>

            <h2>Rate Limits and Quotas</h2>
            <p>
                The API implements rate limiting to ensure fair usage:
            </p>
            <ul>
                <li>100 requests per minute per user</li>
                <li>Maximum of 1MB per memory content</li>
                <li>Up to 50 tags per memory</li>
                <li>Maximum of 100 results per query</li>
            </ul>
        </DocLayout>
    );
} 