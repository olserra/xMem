import { Memory, Project } from '../types';
import { getEmbedding, cosineSimilarity } from '../utils/embeddings';
import { MCP_CONFIG } from '../constants';

interface McpContext {
    memories: Memory[];
    projects: Project[];
    currentContext?: any;
}

export async function prepareMemoryForMcp(memory: Memory): Promise<Memory> {
    if (!memory.embedding) {
        memory.embedding = await getEmbedding(memory.content);
    }

    return {
        ...memory,
        metadata: {
            ...memory.metadata,
            embedding_model: MCP_CONFIG.VERSION,
            tokens: Math.ceil(memory.content.length / 4), // Rough estimation
        },
    };
}

export function findRelevantMemories(
    query: string,
    context: McpContext,
    maxResults: number = 5
): Memory[] {
    const { memories } = context;

    // Filter memories that have embeddings
    const validMemories = memories.filter(m => m.embedding && m.embedding.length > 0);

    if (validMemories.length === 0) return [];

    // Get query embedding
    return validMemories
        .map(memory => ({
            memory,
            similarity: memory.embedding
                ? cosineSimilarity(memory.embedding, memory.embedding)
                : 0,
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults)
        .map(result => result.memory);
}

export function enrichContextWithMetadata(context: McpContext): McpContext {
    return {
        ...context,
        currentContext: {
            timestamp: new Date().toISOString(),
            memoryCount: context.memories.length,
            projectCount: context.projects.length,
            version: MCP_CONFIG.VERSION,
        },
    };
}

export function validateMcpPayload(payload: any): boolean {
    // Add validation logic based on your requirements
    if (!payload) return false;
    if (typeof payload !== 'object') return false;
    if (!payload.version || payload.version !== MCP_CONFIG.VERSION) return false;

    return true;
}

export function sanitizeMcpResponse(response: any): any {
    // Remove sensitive information before sending to client
    const { apiKeys, credentials, ...sanitized } = response;
    return sanitized;
}

export function buildMcpQuery(
    query: string,
    context: McpContext,
    options: any = {}
): any {
    return {
        query,
        context: enrichContextWithMetadata(context),
        options: {
            maxResults: 10,
            threshold: 0.7,
            ...options,
        },
        version: MCP_CONFIG.VERSION,
    };
}

export function handleMcpError(error: any): Error {
    console.error('MCP Error:', error);

    if (error.response) {
        return new Error(`MCP Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    }

    return new Error('Failed to communicate with MCP server');
}

export function mergeMcpContexts(
    contexts: McpContext[],
    strategy: 'union' | 'intersection' = 'union'
): McpContext {
    if (contexts.length === 0) {
        return { memories: [], projects: [] };
    }

    if (contexts.length === 1) {
        return contexts[0];
    }

    const mergedContext: McpContext = {
        memories: [],
        projects: [],
    };

    if (strategy === 'union') {
        // Combine all unique memories and projects
        const memoryIds = new Set<string>();
        const projectIds = new Set<string>();

        contexts.forEach(context => {
            context.memories.forEach(memory => {
                if (!memoryIds.has(memory.id)) {
                    memoryIds.add(memory.id);
                    mergedContext.memories.push(memory);
                }
            });

            context.projects.forEach(project => {
                if (!projectIds.has(project.id)) {
                    projectIds.add(project.id);
                    mergedContext.projects.push(project);
                }
            });
        });
    } else {
        // Keep only items that appear in all contexts
        const [first, ...rest] = contexts;
        mergedContext.memories = first.memories.filter(memory =>
            rest.every(context =>
                context.memories.some(m => m.id === memory.id)
            )
        );

        mergedContext.projects = first.projects.filter(project =>
            rest.every(context =>
                context.projects.some(p => p.id === project.id)
            )
        );
    }

    return mergedContext;
} 