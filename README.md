<!-- Banner -->
<p align="center">
  <img src="public/xmem-banner.svg" alt="xmem banner" width="600"/>
</p>

<p align="center">
  <a href="https://github.com/Olserra/xmem/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License"></a>
  <a href="https://huggingface.co/spaces/Olserra/xmem"><img src="https://img.shields.io/badge/HuggingFace-Spaces-yellow" alt="Hugging Face"></a>
  <a href="https://github.com/Olserra/xmem"><img src="https://img.shields.io/github/stars/Olserra/xmem?style=social" alt="GitHub stars"></a>
</p>

---

# xmem

Hybrid memory orchestrator for LLMs: combines long-term, session, and real-time context management for smarter, more relevant AI. Open-source, privacy-first, and easy to integrate.

---

## Quickstart

```js
const orchestrator = new xmem({
  vectorStore: chromadb,
  sessionStore: redis,
  llmProvider: mistral,
});
const response = await orchestrator.query({
  input: "Tell me about our previous discussion",
});
```

---

## Features

| Feature                | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| Hybrid Memory          | Long-term, session, and context memory for LLMs                                  |
| Open-Source First      | Works with any open-source LLM (Llama, Mistral, etc.) and vector DB              |
| Effortless Integration | Simple API and dashboard for seamless integration and monitoring                 |
| Vector DB Support      | Qdrant, ChromaDB, Pinecone, and more                                             |
| Session Store          | Redis, MongoDB, and others                                                       |
| LLM Provider Agnostic  | Llama.cpp, Ollama, and more (OpenAI supported, but open-source preferred)        |
| Public ML Service      | [Hugging Face Spaces: Olserra/xmem](https://huggingface.co/spaces/Olserra/xmem/) |

---

## Architecture

<p align="center">
  <em>System context and container diagram (see <code>architecture.xml</code> for source)</em>
</p>

---

## Getting Started

Install dependencies:

```sh
pnpm install
# or
yarn install
# or
npm install
# or
bun install
```

Run the development server:

```sh
pnpm dev
# or
yarn dev
# or
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Contributing

Contributions are welcome! Please open issues or pull requests. For major changes, discuss them first in an issue.

- Follow the [Contributor Covenant](https://www.contributor-covenant.org/)

### Branching & Pull Requests

- Always branch from the `develop` branch.
- Use descriptive branch names, prefixed with `feature/` for new features (e.g. `feature/new-feature-name`) or `fix/` for bug fixes (e.g. `fix/some-fix`).
- Open pull requests from your feature/fix branch **into** the `develop` branch.
- Releases are managed by the maintainer, who will merge `develop` into `main` as needed.

---

## License

xmem is licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for details.

The xmem name and logo are trademarks of their respective owners.

---

## Links

- [Hugging Face Space: Olserra/xmem](https://huggingface.co/spaces/Olserra/xmem/)
- [GitHub](https://github.com/Olserra/xmem)

## Audit Logging & Observability

xmem now supports enterprise-grade audit logging for all sensitive actions (API key management, memory deletion, etc.).

### How it works

- All sensitive actions are logged to the `AuditLog` table (user, org, action, resource, details, IP, user agent, timestamp).
- OWNER/ADMIN users can view audit logs in the Settings > Audit Logs tab.
- Logs can be filtered by user, action, resource, and date via the API.

### API

- `GET /api/api-logs?userId=...&action=...&resource=...&from=...&to=...`
- Only accessible to OWNER/ADMIN users in the same organization.

### UI

- Go to Settings > Audit Logs (visible for OWNER/ADMIN).
- View recent actions, filter, and export as needed.

### Schema

```
model AuditLog {
  id             String   @id @default(cuid())
  userId         String?
  organizationId String?
  action         String
  resource       String
  resourceId     String?
  details        Json?
  ipAddress      String?
  userAgent      String?
  timestamp      DateTime @default(now())
}
```

### Example Use Cases

- Track who created, revoked, or used API keys
- Track memory deletions and other sensitive actions
- Export logs for compliance or security review
