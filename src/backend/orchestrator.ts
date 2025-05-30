import { XmemOrchestrator } from './xmem';
import { ChromaDBAdapter } from './adapters/chromadb';
import { QdrantAdapter } from './adapters/qdrant';
import { PineconeAdapter } from './adapters/pinecone';
import { MongoDBVectorAdapter } from './adapters/mongodb';
import { OllamaAdapter } from './adapters/ollama';
// import { RedisAdapter } from './adapters/redis';

// Create orchestrator instance
export const orchestrator = new XmemOrchestrator();

// Register vector providers
orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({
  url: process.env.CHROMA_URL || 'http://localhost:8000',
  collection: process.env.CHROMA_COLLECTION || 'xmem_collection',
  apiKey: process.env.CHROMA_API_KEY,
}));

orchestrator.registerProvider('vector', 'qdrant', new QdrantAdapter({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  collection: process.env.QDRANT_COLLECTION || 'xmem_collection',
  apiKey: process.env.QDRANT_API_KEY,
}));

orchestrator.registerProvider('vector', 'pinecone', new PineconeAdapter({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: process.env.PINECONE_ENVIRONMENT || 'us-west1-gcp',
  indexName: process.env.PINECONE_INDEX || 'xmem-index',
  projectId: process.env.PINECONE_PROJECT_ID,
}));

orchestrator.registerProvider('vector', 'mongodb', new MongoDBVectorAdapter({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB || 'xmem',
  collectionName: process.env.MONGODB_COLLECTION || 'vectors',
}));

// Register Ollama LLM provider
orchestrator.registerProvider('llm', 'ollama', new OllamaAdapter({
  apiUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3',
}));
orchestrator.setDefaultProvider('llm', 'ollama');

// Set default vector provider
orchestrator.setDefaultProvider('vector', 'chromadb');

// Register session provider (Redis)
// const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// orchestrator.registerProvider('session', 'redis', new RedisAdapter(redisUrl));
// orchestrator.setDefaultProvider('session', 'redis');

// Simple in-memory session adapter for dev/demo (no persistence)
class InMemorySessionAdapter {
  private store: Record<string, Record<string, unknown>> = {};
  async getSession(sessionId: string) {
    return this.store[sessionId] || null;
  }
  async setSession(sessionId: string, data: Record<string, unknown>) {
    this.store[sessionId] = data;
  }
  async deleteSession(sessionId: string) {
    delete this.store[sessionId];
  }
}

// Register in-memory session provider as default
orchestrator.registerProvider('session', 'memory', new InMemorySessionAdapter());
orchestrator.setDefaultProvider('session', 'memory');

// Simple in-memory vector store for dev/demo (no persistence)
class InMemoryVectorStore {
  private store: Record<string, { embedding: number[]; metadata?: Record<string, unknown> }> = {};
  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }) {
    this.store[data.id] = { embedding: data.embedding, metadata: data.metadata };
  }
  async searchEmbedding(query: number[], topK: number) {
    // Return topK random or all for demo (no real search)
    return Object.values(this.store).slice(0, topK).map(item => item.metadata || {});
  }
  async deleteEmbedding(id: string) {
    delete this.store[id];
  }
}

// Register in-memory vector store if no CHROMA_URL is set
if (!process.env.CHROMA_URL) {
  orchestrator.registerProvider('vector', 'memory', new InMemoryVectorStore());
  orchestrator.setDefaultProvider('vector', 'memory');
}

// TODO: Register vector and llm providers as needed 