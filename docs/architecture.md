# Software Architecture Document (SAD)

This document provides an overview of the architecture for the project.

## Overview

- Brief description of the system, its goals, and its main components.

## Key Decisions

- See [ADR records](./adr/) for all architectural decisions.

## Components

- List and describe the main components/modules of the system.

## MCP (Model Context Protocol) Integration

xmem supports the Model Context Protocol (MCP) for standardized context and memory management, enabling interoperability with other LLM/agent tools and frameworks.

### MCP API Endpoint

- **Path:** `/api/mcp/`
- **Method:** POST
- **Actions:** `store`, `retrieve`, `update`, `delete`
- **Payload Example:**

```json
{
  "action": "store",
  "context": {
    "id": "context-123",
    "sessionId": "session-abc",
    "text": "User message or context text",
    "metadata": { "source": "user", "timestamp": "2024-06-04T12:00:00Z" }
  }
}
```

### Usage

- To store context: send a POST request with `action: 'store'` and a `context` object.
- To retrieve context: send a POST request with `action: 'retrieve'` and a `query` object (e.g., `{ "id": "context-123", "sessionId": "session-abc" }`).
- To update context: use `action: 'update'` with a `context` object.
- To delete context: use `action: 'delete'` with a `context` object containing the `id` (and optionally `sessionId`).

### Example curl Request

```sh
curl -X POST https://your-domain/api/mcp/ \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "store",
    "context": {
      "id": "context-123",
      "sessionId": "session-abc",
      "text": "User message or context text",
      "metadata": { "source": "user", "timestamp": "2024-06-04T12:00:00Z" }
    }
  }'
```

## Deployment

- Overview of deployment process and environments.

## References

- Link to additional documentation, diagrams, or resources.
