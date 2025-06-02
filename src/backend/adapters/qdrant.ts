import { VectorStore } from '../xmem';

export type QdrantConfig = {
  url: string;
  collection: string;
  apiKey?: string;
};

export class QdrantAdapter implements VectorStore {
  private url: string;
  private collection: string;
  private apiKey?: string;

  constructor(config: QdrantConfig) {
    this.url = config.url;
    this.collection = config.collection;
    this.apiKey = config.apiKey;
  }

  async addEmbedding(data: { id: string | number; embedding: number[]; metadata?: Record<string, unknown>; collection?: string }): Promise<void> {
    const collection = data.collection || this.collection;
    const endpoint = `${this.url.replace(/\/$/, '')}/collections/${collection}/points?wait=true`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['api-key'] = this.apiKey;
    const body = JSON.stringify({
      points: [
        {
          id: data.id,
          vector: data.embedding,
          payload: data.metadata || {},
        },
      ],
    });
    const res = await fetch(endpoint, { method: 'PUT', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qdrant addEmbedding failed: ${res.status} ${text}`);
    }
  }

  async searchEmbedding(query: number[], topK: number, collection?: string): Promise<unknown[]> {
    const coll = collection || this.collection;
    const endpoint = `${this.url.replace(/\/$/, '')}/collections/${coll}/points/search`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['api-key'] = this.apiKey;
    const body = JSON.stringify({
      vector: query,
      limit: topK,
      with_payload: true,
      with_vector: false,
    });
    const res = await fetch(endpoint, { method: 'POST', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qdrant searchEmbedding failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    // Return the payloads (metadata) of the top results
    return (json.result || []).map((item: Record<string, unknown>) => item.payload || {});
  }

  async deleteEmbedding(id: string, collection?: string): Promise<void> {
    const coll = collection || this.collection;
    const endpoint = `${this.url.replace(/\/$/, '')}/collections/${coll}/points/delete?wait=true`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['api-key'] = this.apiKey;
    const body = JSON.stringify({ points: [id] });
    const res = await fetch(endpoint, { method: 'POST', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qdrant deleteEmbedding failed: ${res.status} ${text}`);
    }
  }
} 