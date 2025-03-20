import { Data, DataType, DataMetadata } from '../types/_data';
import { getEmbedding, findMostSimilar } from '../utils/embeddings';
import { validateRequired, validateEnum, validateLength } from '../utils/errors';
import { MAX_DATA_CONTENT_LENGTH, SUPPORTED_DATA_TYPES } from '../constants';
import { analytics } from '../utils/analytics';
import { dataCache } from '../utils/cache';

export async function createData(
    content: string,
    type: DataType,
    userId: string,
    projectId?: string,
    metadata?: DataMetadata
): Promise<Data> {
    // Validate input
    validateRequired({ content, type, userId }, ['content', 'type', 'userId']);
    validateEnum(type, SUPPORTED_DATA_TYPES, 'type');
    validateLength(content, 1, MAX_DATA_CONTENT_LENGTH, 'content');

    // Create data object
    const data: Data = {
        id: crypto.randomUUID(),
        content,
        type,
        userId,
        projectId,
        metadata: {
            ...metadata,
            status: 'active',
            lastAccessed: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isArchived: false
    };

    // Track analytics
    await analytics.trackDataCreated(data, userId);

    return data;
}

export async function searchData(
    query: string,
    data: Data[],
    options: {
        limit?: number;
        threshold?: number;
        projectId?: string;
        type?: DataType;
    } = {}
): Promise<Data[]> {
    const {
        limit = 10,
        threshold = 0.7,
        projectId,
        type,
    } = options;

    // Filter data if needed
    let filteredData = data;
    if (projectId) {
        filteredData = filteredData.filter(d => d.projectId === projectId);
    }
    if (type) {
        filteredData = filteredData.filter(d => d.type === type);
    }

    // Get query embedding
    const queryEmbedding = await getEmbedding(query);

    // Find similar data
    const results = findMostSimilar(
        queryEmbedding,
        filteredData.map(d => ({
            embedding: d.embedding!,
            data: d,
        })),
        limit
    );

    // Filter by threshold
    return results
        .filter(result => result.similarity >= threshold)
        .map(result => result.data);
}

export function groupDataByProject(data: Data[]): Map<string, Data[]> {
    return data.reduce((groups, d) => {
        const projectId = d.projectId || 'unassigned';
        const group = groups.get(projectId) || [];
        group.push(d);
        groups.set(projectId, group);
        return groups;
    }, new Map<string, Data[]>());
}

export function sortData(
    data: Data[],
    sortBy: 'createdAt' | 'updatedAt' | 'relevance' = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
): Data[] {
    return [...data].sort((a, b) => {
        let comparison: number;

        switch (sortBy) {
            case 'relevance':
                comparison = (b.metadata?.custom?.relevance || 0) - (a.metadata?.custom?.relevance || 0);
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

export function filterData(
    data: Data[],
    filters: {
        types?: DataType[];
        dateRange?: { start: Date; end: Date };
        searchTerm?: string;
    }
): Data[] {
    return data.filter(d => {
        // Filter by type
        if (filters.types && !filters.types.includes(d.type)) {
            return false;
        }

        if (filters.dateRange) {
            const dataDate = new Date(d.createdAt);
            if (
                dataDate < filters.dateRange.start ||
                dataDate > filters.dateRange.end
            ) {
                return false;
            }
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            return (
                d.content.toLowerCase().includes(searchTerm) ||
                d.metadata?.tags?.some((tag: string) =>
                    tag.toLowerCase().includes(searchTerm)
                )
            );
        }

        return true;
    });
}

export function getCachedData(dataId: string): Data | null {
    return dataCache.get(dataId);
}

export function setCachedData(data: Data): void {
    dataCache.set(data.id, data);
}

export function removeCachedData(dataId: string): void {
    dataCache.delete(dataId);
}

export function validateDataAccess(data: Data, userId: string): boolean {
    return data.userId === userId || (data.metadata?.shared ?? []).includes(userId);
}

export function enrichDataWithMetadata(
    data: Data,
): Data {
    return {
        ...data,
        metadata: {
            ...data.metadata,
            lastAccessed: new Date().toISOString(),
        },
    };
} 