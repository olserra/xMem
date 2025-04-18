import { Metadata } from 'next';
import { DocLayout } from '@/app/components/docs/DocLayout';

export const metadata: Metadata = {
    title: 'Memory Management | xmem Documentation',
    description: 'Understanding memory management in xmem',
};

export default function MemoriesPage() {
    return (
        <DocLayout>
            <h1>Memory Management</h1>

            <h2>Understanding Memories</h2>
            <p>
                In xmem, memories are the fundamental unit of information storage. Each memory
                represents a piece of information that you want to store and retrieve later.
                The MCP client provides a simple interface for managing memories while handling
                all the complexity of semantic embedding and storage.
            </p>

            <h2>Memory Structure</h2>
            <pre>
                {`# Memory structure example
memory = {
    "content": "The main text or information",
    "tags": ["tag1", "tag2"],  # For organization
    "metadata": {
        "source": "meeting",
        "date": "2024-04-18",
        "custom_field": "value"
    },
    "project_id": "optional-project-uuid"  # For grouping
}`}
            </pre>

            <h3>Content</h3>
            <p>
                The content field contains the main information of your memory. This can be
                text, structured data, or any information you want to store. The content is
                automatically processed to create semantic embeddings for search.
            </p>

            <h3>Tags</h3>
            <p>
                Tags help organize memories and make them easier to find. They're flexible
                labels that you can use to categorize memories in any way that makes sense
                for your use case.
            </p>

            <h3>Metadata</h3>
            <p>
                Metadata provides additional structured information about your memory. This
                can include any custom fields that help describe or categorize the memory.
                Common uses include:
            </p>
            <ul>
                <li>Source information</li>
                <li>Timestamps</li>
                <li>Related people or entities</li>
                <li>Custom categorization</li>
            </ul>

            <h2>Working with Memories</h2>
            <h3>Creating Memories</h3>
            <pre>
                {`from mcp_client import MCPClient

client = MCPClient()

# Create a simple memory
memory_id = client.create_memory(
    content="Important meeting notes",
    tags=["meeting", "project-x"]
)

# Create a memory with metadata
memory_id = client.create_memory(
    content="Customer feedback discussion",
    tags=["feedback", "customer"],
    metadata={
        "customer_id": "12345",
        "sentiment": "positive",
        "priority": "high"
    }
)`}
            </pre>

            <h3>Updating Memories</h3>
            <pre>
                {`# Update content and metadata
client.update_memory(
    memory_id="memory-id",
    content="Updated meeting notes",
    metadata={"status": "reviewed"}
)

# Assign to a project
client.assign_to_project(
    memory_id="memory-id",
    project_id="project-id"
)`}
            </pre>

            <h3>Searching Memories</h3>
            <pre>
                {`# Semantic search
results = client.query_memories(
    query="What was discussed about customer feedback?",
    n_results=5
)

# Project-specific search
project_memories = client.get_project_memories(
    project_id="project-id",
    tags=["meeting"]  # Optional filtering
)`}
            </pre>

            <h2>Best Practices</h2>
            <ul>
                <li>
                    <strong>Consistent Tagging</strong>: Develop a consistent tagging system
                    that makes sense for your use case
                </li>
                <li>
                    <strong>Rich Metadata</strong>: Use metadata to add structured information
                    that can help with filtering and organization
                </li>
                <li>
                    <strong>Project Organization</strong>: Use projects to group related
                    memories when it makes sense
                </li>
                <li>
                    <strong>Semantic Queries</strong>: Write natural language queries that
                    focus on meaning rather than exact matches
                </li>
            </ul>

            <h2>Advanced Usage</h2>
            <p>
                For more advanced memory management features and customization options,
                check out the <a href="/docs/advanced/customization">Advanced Usage</a> guide.
            </p>
        </DocLayout>
    );
}
