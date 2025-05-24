import { XmemOrchestrator } from './xmem';
import { ChromaDBAdapter } from './adapters/chromadb';
import { QdrantAdapter } from './adapters/qdrant';
import { PineconeAdapter } from './adapters/pinecone';
import { MongoDBVectorAdapter } from './adapters/mongodb';
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

// Set default vector provider
orchestrator.setDefaultProvider('vector', 'chromadb');

// Register session provider (Redis)
// const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// orchestrator.registerProvider('session', 'redis', new RedisAdapter(redisUrl));
// orchestrator.setDefaultProvider('session', 'redis');

// TODO: Register vector and llm providers as needed 