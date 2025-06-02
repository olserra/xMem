export interface EmbeddingService {
  embed(text: string): Promise<number[]>;
}

export class HuggingFaceEmbeddingService implements EmbeddingService {
  private apiToken: string;
  private model: string;
  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN!;
    this.model = process.env.HUGGINGFACE_EMBEDDING_MODEL || 'BAAI/bge-small-en-v1.5';
    if (!this.apiToken) throw new Error('HUGGINGFACE_API_TOKEN not set');
  }
  async embed(text: string): Promise<number[]> {
    const res = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid embedding response');
    return data;
  }
} 