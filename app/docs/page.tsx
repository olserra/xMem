import { Metadata } from "next";
import { DocLayout } from '@/app/components/docs/DocLayout';

export const metadata: Metadata = {
    title: "Documentation | xmem",
    description: "Documentation for xmem - Your Personal Memory Extension",
};

export default function DocsPage() {
    return (
        <DocLayout>
            <h1>xmem Documentation</h1>
            
            <p className="lead">
                Welcome to xmem documentation. xmem is a powerful personal memory extension tool
                that helps you store, organize, and retrieve your thoughts and information using
                advanced semantic search capabilities.
            </p>

            <h2>Quick Start</h2>
            <p>
                xmem uses Python and the Memory Control Protocol (MCP) for seamless integration.
                Here's a quick example to get you started:
            </p>

            <pre>
                {`from mcp_client import MCPClient

# Initialize the client
client = MCPClient()

# Create a memory
memory_id = client.create_memory(
    content="Important meeting notes about project X",
    tags=["meeting", "project-x"],
    metadata={"date": "2024-04-18", "participants": ["Alice", "Bob"]}
)

# Search your memories
results = client.query_memories(
    query="What was discussed about project X?",
    n_results=5
)`}
            </pre>

            <h2>Key Features</h2>
            <ul>
                <li>Semantic search powered by ChromaDB</li>
                <li>Automatic user-specific collection management</li>
                <li>Project-based organization</li>
                <li>Rich metadata and tagging support</li>
                <li>Python-first approach with MCP client</li>
            </ul>

            <h2>Next Steps</h2>
            <ul>
                <li>Read the <a href="/docs/getting-started/introduction">Introduction</a> for a comprehensive overview</li>
                <li>Check out the <a href="/docs/api-reference">API Reference</a> for detailed documentation</li>
                <li>Learn about <a href="/docs/core-concepts/memories">Core Concepts</a></li>
            </ul>
        </DocLayout>
    );
} 