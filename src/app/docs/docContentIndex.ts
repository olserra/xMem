// Mapping of doc routes to their full text content for search
export const docContentIndex: Record<string, string> = {
  '/docs/get-started': `Quickstart
Install xmem and dependencies
npm install xmem chromadb redis
Initialize the orchestrator
const orchestrator = new XmemOrchestrator();
Register your providers
orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({ url: 'http://localhost:8000', collection: 'my_collection' }));
orchestrator.registerProvider('session', 'redis', new RedisAdapter('redis://localhost:6379'));
orchestrator.registerProvider('llm', 'llama', new LlamaCppAdapter({ apiUrl: 'http://localhost:8080' }));
Query with context
const response = await orchestrator.query({ input: 'What is xmem?', sessionId: 'demo-session' });`,

  '/docs/api': `API Reference
Explore all available API endpoints for xmem.
Query with Context
POST /api/query
Send a query and receive an LLM response with intelligently selected context.
Session Management
POST /api/sessions
Create and manage memory sessions for conversations.
Feedback Collection
POST /api/feedback
Submit feedback on context relevance to improve future rankings.
Context Preview
GET /api/context
Preview the context that would be selected for a given query.
Memory Management
POST /api/memory
Add, update, or delete items in the memory store.`,

  '/docs/examples': `Integration Examples
See how to use xmem in different scenarios and languages.
Basic Query (JavaScript)
const response = await orchestrator.query({ query: 'How does xmem work?', sessionId: 'user-123' });
Add Memory (Python)
res = requests.post('http://localhost:3000/api/memory', json={ 'action': 'add', 'data': { 'text': 'Remember this fact.' } })
Session Management (cURL)
curl -X POST http://localhost:3000/api/sessions -H 'Content-Type: application/json' -d '{"name": "my-session"}'`,

  '/docs/faq': `Frequently Asked Questions
What is xmem?
xmem is a memory management system for LLMs, combining long-term and session memory for smarter, more relevant AI responses.
Which LLMs are supported?
xmem works with any open-source LLM, including Llama, Mistral, and more. You can configure your preferred provider in the orchestrator setup.
How do I store custom data?
Use the /api/memory endpoint to add, update, or delete memory items.
Is there a dashboard?
Yes! xmem includes a dashboard for monitoring, configuration, and memory management.
Can I use xmem with my own vector database?
Absolutely. xmem supports pluggable vector stores, including ChromaDB and others.`,

  '/docs/llm-adapters': `Supported LLM Providers
xmem supports a wide range of LLM providers via adapters. You can register and use any of the following: Llama.cpp, HuggingFace Inference API, Ollama, OpenAI, Gemini (Google AI)
Example: Registering Adapters
import { XmemOrchestrator } from './xmem';
import { LlamaCppAdapter } from './adapters/llamaCpp';
import { HuggingFaceAdapter } from './adapters/huggingface';
import { OllamaAdapter } from './adapters/ollama';
import { OpenAIAdapter } from './adapters/openai';
import { GeminiAdapter } from './adapters/gemini';
const orchestrator = new XmemOrchestrator();
orchestrator.registerProvider('llm', 'llama', new LlamaCppAdapter({ apiUrl: 'http://localhost:8080' }));
orchestrator.registerProvider('llm', 'huggingface', new HuggingFaceAdapter({ apiUrl: 'https://api-inference.huggingface.co/models/your-model', apiKey: 'YOUR_HF_API_KEY' }));
orchestrator.registerProvider('llm', 'ollama', new OllamaAdapter({ apiUrl: 'http://localhost:11434', model: 'llama2' }));
orchestrator.registerProvider('llm', 'openai', new OpenAIAdapter({ apiKey: 'YOUR_OPENAI_API_KEY', model: 'gpt-3.5-turbo' }));
orchestrator.registerProvider('llm', 'gemini', new GeminiAdapter({ apiKey: 'YOUR_GEMINI_API_KEY' }));
orchestrator.setDefaultProvider('llm', 'llama');
// Use Gemini for a specific request
const response = await orchestrator.query({ input: 'What is the weather today?', sessionId: 'sess1', llmProvider: 'gemini' });
You can swap or add new providers at any time. See the adapters directory for implementation details.`,

  '/docs/integrations': `Integrations
xmem is designed to be modular and pluggable. You can integrate with a wide range of LLMs, vector stores, and session stores. Here are some common integrations:
LLM Integrations: Llama.cpp, Ollama, Mistral, HuggingFace Inference API, OpenAI, Gemini (Google AI)
Vector Store Integrations: ChromaDB, Qdrant, Pinecone, MockVectorStore (for dev/testing)
Session Store Integrations: Redis, PostgreSQL, MongoDB
Tip: You can register multiple providers of each type and select which to use per operation.`,

  '/docs/memory-types': `Memory Types
xmem supports several memory types to cover all your LLM and agent use cases:
User Memory: Long-term memory scoped to a user, persists across sessions.
Session Memory: Short-term memory for a user session, ideal for context windows.
Agent Memory: Long-term memory for an agent or assistant, keeps agent responses consistent.
Dual Memory: Store memories for both user and agent in a single operation for personalized, bidirectional context.
Example: Dual Memory
const messages = [ { role: 'user', content: "I'm travelling to San Francisco" }, { role: 'assistant', content: "That's great! I'm going to Dubai next month." }, ]; orchestrator.addMemory(messages, { user_id: 'user1', agent_id: 'agent1' });
Tip: You can retrieve memories by user, agent, or both, and filter by session, metadata, or categories.`,

  '/docs/memory-operations': `Memory Operations
xmem provides a simple and flexible API for managing memory:
Add Memory orchestrator.addMemory({ id: 'memory-1', text: 'Alex is a vegetarian and allergic to nuts.', metadata: { food: 'vegan' }, sessionId: 'session-123', });
Search Memory const results = await orchestrator.semanticSearch('What do you know about Alex?', { topK: 5, vectorProvider: 'chromadb', });
Update Memory // Update by deleting and re-adding with the same id await orchestrator.deleteMemory('memory-1'); await orchestrator.addMemory({ id: 'memory-1', text: 'Alex is now vegan.' });
Delete Memory await orchestrator.deleteMemory('memory-1');
Tip: You can filter, batch, and combine operations for advanced workflows.`,

  '/docs/vector-stores': `Vector Stores
Vector stores power semantic search and retrieval in xmem. You can use open-source solutions like ChromaDB, Qdrant, Pinecone, or even a mock store for dev/testing.
Registering a Vector Store import { ChromaDBAdapter } from './adapters/chromadb'; orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({ url: 'http://localhost:8000', collection: 'my_collection' })); orchestrator.setDefaultProvider('vector', 'chromadb');
Supported Vector Stores: ChromaDB, Qdrant, Pinecone, MockVectorStore (for dev/testing)
Tip: You can register multiple vector stores and select which to use per query.`,
}; 