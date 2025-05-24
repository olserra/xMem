import { VectorStore } from '../xmem';

export type PineconeConfig = {
  apiKey: string;
  environment: string;
  indexName: string;
  projectId?: string;
};

export class PineconeAdapter implements VectorStore {
  private apiKey: string;
  private environment: string;
  private indexName: string;
  private projectId?: string;
  private baseUrl: string;

  constructor(config: PineconeConfig) {
    this.apiKey = config.apiKey;
    this.environment = config.environment;
    this.indexName = config.indexName;
    this.projectId = config.projectId;
    this.baseUrl = `https://${this.indexName}-${this.environment}.svc.${this.environment}.pinecone.io`;
  }

  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }): Promise<void> {
    const endpoint = `${this.baseUrl}/vectors/upsert`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Api-Key': this.apiKey,
    };
    const body = JSON.stringify({
      vectors: [
        {
          id: data.id,
          values: data.embedding,
          metadata: data.metadata || {},
        },
      ],
    });
    const res = await fetch(endpoint, { method: 'POST', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Pinecone addEmbedding failed: ${res.status} ${text}`);
    }
  }

  async searchEmbedding(query: number[], topK: number): Promise<unknown[]> {
    const endpoint = `${this.baseUrl}/query`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Api-Key': this.apiKey,
    };
    const body = JSON.stringify({
      vector: query,
      topK,
      includeMetadata: true,
    });
    const res = await fetch(endpoint, { method: 'POST', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Pinecone searchEmbedding failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    // Return the metadata of the top results
    return (json.matches || []).map((item: any) => item.metadata || {});
  }

  async deleteEmbedding(id: string): Promise<void> {
    const endpoint = `${this.baseUrl}/vectors/delete`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Api-Key': this.apiKey,
    };
    const body = JSON.stringify({ ids: [id] });
    const res = await fetch(endpoint, { method: 'POST', headers, body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Pinecone deleteEmbedding failed: ${res.status} ${text}`);
    }
  }
} 