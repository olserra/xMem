import { VectorStore } from '../xmem';
import { MongoClient } from 'mongodb';

export type MongoDBVectorConfig = {
  uri: string;
  dbName: string;
  collectionName: string;
};

export class MongoDBVectorAdapter implements VectorStore {
  private uri: string;
  private dbName: string;
  private collectionName: string;
  private client: MongoClient;

  constructor(config: MongoDBVectorConfig) {
    this.uri = config.uri;
    this.dbName = config.dbName;
    this.collectionName = config.collectionName;
    this.client = new MongoClient(this.uri);
  }

  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }): Promise<void> {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    await collection.updateOne(
      { _id: data.id },
      { $set: { _id: data.id, $vector: data.embedding, ...(data.metadata || {}) } },
      { upsert: true }
    );
  }

  async searchEmbedding(query: number[], topK: number): Promise<unknown[]> {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    // Try Atlas $vectorSearch first
    try {
      const results = await collection.aggregate([
        {
          $vectorSearch: {
            queryVector: query,
            path: '$vector',
            numCandidates: 100,
            limit: topK,
            index: 'default',
          },
        },
      ]).toArray();
      return results;
    } catch (_e) {
      // Fallback: brute-force cosine similarity
      const all = await collection.find({ $vector: { $exists: true } }).toArray();
      const cosine = (a: number[], b: number[]) => {
        const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
        const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
        const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
        return dot / (normA * normB);
      };
      return all
        .map(doc => ({ ...doc, _score: cosine(doc.$vector, query) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, topK);
    }
  }

  async deleteEmbedding(id: string): Promise<void> {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    await collection.deleteOne({ _id: id });
  }
} 