import { VectorStore } from '../xmem';

type VectorItem = {
  id: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
};

export class MockVectorStore implements VectorStore {
  private store: VectorItem[] = [];

  async addEmbedding(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }): Promise<void> {
    this.store = this.store.filter(item => item.id !== data.id);
    this.store.push({ id: data.id, embedding: data.embedding, metadata: data.metadata });
  }

  async searchEmbedding(query: number[], topK: number): Promise<VectorItem[]> {
    const distance = (a: number[], b: number[]) =>
      Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    return this.store
      .map(item => ({ ...item, score: -distance(item.embedding, query) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async deleteEmbedding(id: string): Promise<void> {
    this.store = this.store.filter(item => item.id !== id);
  }
} 