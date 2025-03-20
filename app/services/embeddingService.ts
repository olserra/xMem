import { pipeline } from '@xenova/transformers';

export class EmbeddingService {
    private embedder: any;

    constructor() {
        this.embedder = null;
    }

    async initialize() {
        if (!this.embedder) {
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
                quantized: true,
                progress_callback: undefined,
                cache_dir: './models'
            });
        }
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            // For now, use a simple hash-based embedding
            return this.generateSimpleEmbedding(text);
        } catch (error) {
            console.error('Error generating embedding:', error);
            return this.generateSimpleEmbedding(text);
        }
    }

    private generateSimpleEmbedding(text: string): number[] {
        const hash = text.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
        }, 0);

        const embedding = new Array(384).fill(0);
        for (let i = 0; i < 384; i++) {
            embedding[i] = (hash >> i) % 2 ? 1 : -1;
        }
        return embedding;
    }
} 