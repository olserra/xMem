import { EmbeddingService } from './embeddingService';
import { QdrantAdapter } from './adapters/qdrant';
import { PineconeAdapter } from './adapters/pinecone';
import { ChromaDBAdapter } from './adapters/chromadb';
import { MongoDBVectorAdapter } from './adapters/mongodb';

export async function upsertToVectorDB(
  source: any, // MemorySource
  text: string,
  metadata: Record<string, unknown>,
  embeddingService: EmbeddingService
) {
  const embedding = await embeddingService.embed(text);
  if (source.type === 'qdrant') {
    const adapter = new QdrantAdapter({ url: source.vectorDbUrl, collection: source.collection, apiKey: source.apiKey });
    await adapter.addEmbedding({ id: metadata.id, embedding, metadata });
  } else if (source.type === 'pinecone') {
    const adapter = new PineconeAdapter({ apiKey: source.apiKey, environment: source.vectorDbUrl, indexName: source.collection });
    await adapter.addEmbedding({ id: metadata.id, embedding, metadata });
  } else if (source.type === 'chromadb') {
    const adapter = new ChromaDBAdapter({ url: source.vectorDbUrl, collection: source.collection, apiKey: source.apiKey });
    await adapter.addEmbedding({ id: metadata.id, embedding, metadata });
  } else if (source.type === 'mongodb') {
    const adapter = new MongoDBVectorAdapter({ uri: source.vectorDbUrl, dbName: source.metric || 'xmem', collectionName: source.collection });
    await adapter.addEmbedding({ id: metadata.id, embedding, metadata });
  } else {
    throw new Error('Unsupported vector DB type: ' + source.type);
  }
} 