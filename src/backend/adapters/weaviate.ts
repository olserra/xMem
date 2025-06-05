import { VectorStore } from '../xmem';

export type WeaviateConfig = {
  endpoint: string; // REST endpoint
  apiKey: string;
  className: string; // Weaviate class name (like a collection)
};

export class WeaviateAdapter implements VectorStore {
  private endpoint: string;
  private apiKey: string;
  private className: string;

  constructor(config: WeaviateConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.className = config.className;
  }

  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown>; collection?: string }): Promise<void> {
    const className = data.collection || this.className;
    const body = {
      class: className,
      id: data.id,
      vector: data.embedding,
      properties: data.metadata || {},
    };
    const res = await fetch(`${this.endpoint}/v1/objects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Weaviate addEmbedding failed: ${res.status} ${text}`);
    }
  }

  async searchEmbedding(query: number[], topK: number, collection?: string): Promise<unknown[]> {
    const className = collection || this.className;
    const body = {
      nearVector: { vector: query },
      limit: topK,
    };
    const res = await fetch(`${this.endpoint}/v1/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        query: `{
          Get {
            ${className}(
              limit: ${topK},
              nearVector: { vector: [${query.join(',')}] }
            ) {
              _additional { id distance }
              ... on ${className} { _additional { id } }
            }
          }
        }`,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Weaviate searchEmbedding failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    // Extract results from GraphQL response
    return (
      json.data?.Get?.[className] || []
    );
  }

  async deleteEmbedding(id: string, collection?: string): Promise<void> {
    const className = collection || this.className;
    const res = await fetch(`${this.endpoint}/v1/objects/${className}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Weaviate deleteEmbedding failed: ${res.status} ${text}`);
    }
  }
} 