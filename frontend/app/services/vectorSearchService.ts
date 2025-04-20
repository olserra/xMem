import { prisma } from '@/prisma/prisma';
import { EmbeddingService } from './embeddingService';
import { Prisma } from '@prisma/client';

export class VectorSearchService {
    private embedder: EmbeddingService;

    constructor() {
        this.embedder = new EmbeddingService();
    }

    async searchSimilar(query: string, userId: string, limit: number = 5) {
        // Generate embedding for the query
        const queryEmbedding = await this.embedder.generateEmbedding(query);

        // Use raw query to perform vector similarity search
        const results = await prisma.$queryRaw<Array<{
            id: string;
            content: string;
            metadata: any;
            similarity: number;
        }>>`
            SELECT 
                id,
                content,
                metadata,
                cosine_similarity(embedding, ${queryEmbedding}::vector) as similarity
            FROM "Data"
            WHERE "userId" = ${userId}
            AND "isArchived" = false
            ORDER BY similarity DESC
            LIMIT ${limit}
        `;

        return results;
    }

    async searchByMetadata(query: string, userId: string, metadataFilters: Record<string, any> = {}, limit: number = 5) {
        // Generate embedding for the query
        const queryEmbedding = await this.embedder.generateEmbedding(query);

        // Build metadata filter conditions
        const metadataConditions = Object.entries(metadataFilters)
            .map(([key, value]) => `metadata->>'${key}' = '${value}'`)
            .join(' AND ');

        // Use raw query to perform vector similarity search with metadata filters
        const results = await prisma.$queryRaw<Array<{
            id: string;
            content: string;
            metadata: any;
            similarity: number;
        }>>`
            SELECT 
                id,
                content,
                metadata,
                cosine_similarity(embedding, ${queryEmbedding}::vector) as similarity
            FROM "Data"
            WHERE "userId" = ${userId}
            AND "isArchived" = false
            ${metadataConditions ? Prisma.sql`AND ${Prisma.raw(metadataConditions)}` : Prisma.empty}
            ORDER BY similarity DESC
            LIMIT ${limit}
        `;

        return results;
    }
} 