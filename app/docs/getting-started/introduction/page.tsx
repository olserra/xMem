import { Metadata } from "next";
import { DocLayout } from '@/app/components/docs/DocLayout';

export const metadata: Metadata = {
    title: "Introduction | xmem Documentation",
    description: "Introduction to xmem and its core concepts",
};

export default function IntroductionPage() {
    return (
        <DocLayout>
            <h1>Introduction to xmem</h1>

            <h2>What is xmem?</h2>
            <p>
                xmem is your personal memory extension, designed to help you store, organize,
                and retrieve information using advanced semantic search capabilities. Built with
                Python and ChromaDB, it provides a powerful yet simple interface for managing
                your digital memories.
            </p>

            <h2>Core Architecture</h2>
            <p>
                xmem is built on three main pillars:
            </p>
            <ul>
                <li>
                    <strong>MCP (Memory Control Protocol)</strong>: A Python-based protocol that
                    handles all memory operations, user management, and data security.
                </li>
                <li>
                    <strong>ChromaDB Backend</strong>: Powers the semantic search capabilities,
                    storing and indexing your memories for efficient retrieval.
                </li>
                <li>
                    <strong>User-Specific Collections</strong>: Automatically manages isolated
                    collections for each user, ensuring data privacy and organization.
                </li>
            </ul>

            <h2>Key Concepts</h2>
            <h3>Memories</h3>
            <p>
                In xmem, a memory is any piece of information you want to store and retrieve later.
                Each memory can have:
            </p>
            <ul>
                <li>Content: The main text or information</li>
                <li>Tags: Labels for organization</li>
                <li>Metadata: Additional structured information</li>
                <li>Project Association: Optional grouping by project</li>
            </ul>

            <h3>Semantic Search</h3>
            <p>
                Unlike traditional keyword search, xmem uses semantic search to find relevant
                memories based on meaning rather than exact matches. This means you can find
                information even if you don't remember the exact words used.
            </p>

            <h3>Projects</h3>
            <p>
                Projects help you organize related memories together. They're optional but
                useful for grouping memories by context, such as work projects, research
                topics, or personal goals.
            </p>

            <h2>Getting Started</h2>
            <p>
                The easiest way to get started with xmem is through the Python MCP client:
            </p>
            <pre>
                {`# Install the client
pip install mcp-client

# Initialize
from mcp_client import MCPClient
client = MCPClient()

# Start creating memories
memory_id = client.create_memory(
    content="My first memory",
    tags=["getting-started"]
)`}
            </pre>

            <h2>Next Steps</h2>
            <ul>
                <li>
                    Check out the <a href="/docs/api-reference">API Reference</a> for detailed
                    documentation on all available operations
                </li>
                <li>
                    Learn about <a href="/docs/core-concepts/memories">Memory Management</a> for
                    best practices and advanced features
                </li>
                <li>
                    Explore <a href="/docs/advanced/customization">Advanced Usage</a> for
                    customization options and integration patterns
                </li>
            </ul>
        </DocLayout>
    );
}
