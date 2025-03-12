import { Memory, Project, MemoryType } from '../types';
import { getEmbedding, findMostSimilar } from '../utils/embeddings';
import { validateRequired, validateEnum, validateLength } from '../utils/errors';
import { MAX_MEMORY_CONTENT_LENGTH, SUPPORTED_MEMORY_TYPES } from '../constants';
import { analytics } from '../utils/analytics';
import { memoryCache } from '../utils/cache';

export async function createMemory(
    content: string,
    type: MemoryType,
    userId: string,
    projectId?: string,
    metadata?: any
): Promise<Memory> {
    // Validate input
    validateRequired({ content, type, userId }, ['content', 'type', 'userId']);
    validateEnum(type, SUPPORTED_MEMORY_TYPES, 'type');
    validateLength(content, 1, MAX_MEMORY_CONTENT_LENGTH, 'content');

    // Generate embedding
    const embedding = await getEmbedding(content);

    // Create memory object
    const memory: Memory = {
        id: crypto.randomUUID(),
        content,
        type,
        userId,
        projectId,
        embedding,
        metadata: {
            ...metadata,
            createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Track analytics
    await analytics.trackMemoryCreated(memory, userId);

    return memory;
}

export async function searchMemories(
    query: string,
    memories: Memory[],
    options: {
        limit?: number;
        threshold?: number;
        projectId?: string;
        type?: MemoryType;
    } = {}
): Promise<Memory[]> {
    const {
        limit = 10,
        threshold = 0.7,
        projectId,
        type,
    } = options;

    // Filter memories if needed
    let filteredMemories = memories;
    if (projectId) {
        filteredMemories = filteredMemories.filter(m => m.projectId === projectId);
    }
    if (type) {
        filteredMemories = filteredMemories.filter(m => m.type === type);
    }

    // Get query embedding
    const queryEmbedding = await getEmbedding(query);

    // Find similar memories
    const results = findMostSimilar(
        queryEmbedding,
        filteredMemories.map(memory => ({
            embedding: memory.embedding!,
            data: memory,
        })),
        limit
    );

    // Filter by threshold
    return results
        .filter(result => result.similarity >= threshold)
        .map(result => result.data);
}

export function groupMemoriesByProject(memories: Memory[]): Map<string, Memory[]> {
    return memories.reduce((groups, memory) => {
        const projectId = memory.projectId || 'unassigned';
        const group = groups.get(projectId) || [];
        group.push(memory);
        groups.set(projectId, group);
        return groups;
    }, new Map<string, Memory[]>());
}

export function sortMemories(
    memories: Memory[],
    sortBy: 'createdAt' | 'updatedAt' | 'relevance' = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
): Memory[] {
    return [...memories].sort((a, b) => {
        let comparison: number;

        switch (sortBy) {
            case 'relevance':
                comparison = (b.metadata?.relevance || 0) - (a.metadata?.relevance || 0);
                break;
            case 'updatedAt':
                comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                break;
            case 'createdAt':
            default:
                comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return order === 'asc' ? -comparison : comparison;
    });
}

export function filterMemories(
    memories: Memory[],
    filters: {
        types?: MemoryType[];
        projects?: string[];
        dateRange?: { start: Date; end: Date };
        searchTerm?: string;
    }
): Memory[] {
    return memories.filter(memory => {
        // Filter by type
        if (filters.types && !filters.types.includes(memory.type)) {
            return false;
        }

        // Filter by project
        if (filters.projects && memory.projectId && !filters.projects.includes(memory.projectId)) {
            return false;
        }

        // Filter by date range
        if (filters.dateRange) {
            const memoryDate = new Date(memory.createdAt);
            if (
                memoryDate < filters.dateRange.start ||
                memoryDate > filters.dateRange.end
            ) {
                return false;
            }
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            return (
                memory.content.toLowerCase().includes(searchTerm) ||
                memory.metadata?.tags?.some(tag =>
                    tag.toLowerCase().includes(searchTerm)
                )
            );
        }

        return true;
    });
}

export function getCachedMemory(memoryId: string): Memory | null {
    return memoryCache.get(memoryId);
}

export function setCachedMemory(memory: Memory): void {
    memoryCache.set(memory.id, memory);
}

export function removeCachedMemory(memoryId: string): void {
    memoryCache.delete(memoryId);
}

export function validateMemoryAccess(memory: Memory, userId: string): boolean {
    return memory.userId === userId || (memory.metadata?.shared ?? []).includes(userId);
}

export function enrichMemoryWithMetadata(
    memory: Memory,
    project?: Project
): Memory {
    return {
        ...memory,
        metadata: {
            ...memory.metadata,
            projectName: project?.name,
            projectType: project?.type,
            lastAccessed: new Date().toISOString(),
        },
    };
} 