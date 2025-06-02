import { VectorStore } from '../xmem';

type ChromaDBConfig = {
  url: string;
  collection: string;
  apiKey?: string;
};

interface ChromaDBQueryResponse {
  documents: unknown[];
  ids: string[];
  distances: number[];
  metadatas: Record<string, unknown>[];
}

export class ChromaDBAdapter implements VectorStore {
  private url: string;
  private collection: string;
  private apiKey?: string;

  constructor(config: ChromaDBConfig) {
    this.url = config.url;
    this.collection = config.collection;
    this.apiKey = config.apiKey;
  }

  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown>; collection?: string }): Promise<void> {
    const collection = data.collection || this.collection;
    await fetch(`${this.url}/api/v1/collections/${collection}/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({
        ids: [data.id],
        embeddings: [data.embedding],
        metadatas: [data.metadata || {}]
      })
    });
  }

  async searchEmbedding(query: number[], topK: number, collection?: string): Promise<unknown[]> {
    const coll = collection || this.collection;
    const res = await fetch(`${this.url}/api/v1/collections/${coll}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({
        query_embeddings: [query],
        n_results: topK
      })
    });
    const json = await res.json() as ChromaDBQueryResponse;
    return json.documents || [];
  }

  async deleteEmbedding(id: string, collection?: string): Promise<void> {
    const coll = collection || this.collection;
    await fetch(`${this.url}/api/v1/collections/${coll}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({
        ids: [id]
      })
    });
  }
} 