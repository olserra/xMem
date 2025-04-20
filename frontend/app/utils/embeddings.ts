import { DEFAULT_EMBEDDING_MODEL, EMBEDDING_DIMENSIONS, MAX_TOKENS_PER_REQUEST, API_TIMEOUT } from '../constants';

interface EmbeddingResponse {
    data: number[];
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

export async function getEmbedding(
    text: string,
    model: string = DEFAULT_EMBEDDING_MODEL
): Promise<number[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                input: text,
                model,
                dimensions: EMBEDDING_DIMENSIONS,
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Embedding API error: ${response.statusText} - ${errorData.error?.message || ''}`);
        }

        const result: EmbeddingResponse = await response.json();
        return result.data;
    } catch (error: any) {
        console.error('Error getting embedding:', error);
        if (error.name === 'AbortError') {
            throw new Error('Embedding request timed out. Please try again.');
        }
        if (error.message.includes('401')) {
            throw new Error('OpenAI API key is invalid or not configured.');
        }
        throw new Error('Failed to generate embedding. Please try again later.');
    }
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function chunkText(text: string, maxTokens: number = MAX_TOKENS_PER_REQUEST): string[] {
    // Simple implementation - in production, use a proper tokenizer
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokenCount = 0;

    // Rough estimation: 1 word ≈ 1.3 tokens
    const tokenMultiplier = 1.3;

    for (const word of words) {
        const estimatedTokens = Math.ceil(word.length * tokenMultiplier);

        if (currentTokenCount + estimatedTokens > maxTokens) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [word];
            currentTokenCount = estimatedTokens;
        } else {
            currentChunk.push(word);
            currentTokenCount += estimatedTokens;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks;
}

export async function getChunkedEmbeddings(
    text: string,
    model: string = DEFAULT_EMBEDDING_MODEL
): Promise<{ embeddings: number[][]; chunks: string[] }> {
    const chunks = chunkText(text);
    const embeddings = await Promise.all(
        chunks.map(chunk => getEmbedding(chunk, model))
    );

    return { embeddings, chunks };
}

export function averageEmbeddings(embeddings: number[][]): number[] {
    if (embeddings.length === 0) {
        throw new Error('Cannot average empty embeddings array');
    }

    const dimension = embeddings[0].length;
    const result = new Array(dimension).fill(0);

    for (const embedding of embeddings) {
        if (embedding.length !== dimension) {
            throw new Error('All embeddings must have the same dimension');
        }

        for (let i = 0; i < dimension; i++) {
            result[i] += embedding[i];
        }
    }

    for (let i = 0; i < dimension; i++) {
        result[i] /= embeddings.length;
    }

    return result;
}

export function findMostSimilar(
    query: number[],
    candidates: Array<{ embedding: number[]; data: any }>,
    topK: number = 5
): Array<{ similarity: number; data: any }> {
    return candidates
        .map(candidate => ({
            similarity: cosineSimilarity(query, candidate.embedding),
            data: candidate.data,
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
} 