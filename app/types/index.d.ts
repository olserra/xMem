// Re-export all types
export * from './core';
export * from './project';
export * from './userContext';
export * from './api';
export * from './forms';
export * from './analytics';

// Core Types
export interface User {
    id: string;
    email: string;
    name: string;
    apiKeys?: ApiKey[];
    projects?: Project[];
    memories?: Memory[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
    userId: string;
    user?: User;
    memories?: Memory[];
    createdAt: string;
    updatedAt: string;
    _count?: { memories: number };
    memoryCount?: number;
    metadata?: any;
}

export interface Memory {
    id: string;
    content: string;
    type: MemoryType;
    metadata?: MemoryMetadata;
    embedding?: number[];
    userId: string;
    projectId?: string;
    project?: Project;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface ApiKey {
    id: string;
    key: string;
    name?: string;
    userId: string;
    user?: User;
    lastUsed?: string;
    createdAt: string;
    expiresAt?: string;
}

// Enums as string literal unions
export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED';
export type MemoryType = 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';

// Context Types
export interface UserContextState {
    user: User | null;
    bearerToken: string | null;
    projects: Project[];
    memories: Memory[];
    favorites: string[];
    filterLabel: string;
    isLoading: boolean;
    error: Error | null;
}

export interface UserContextActions {
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateMemories: (memories: Memory[]) => void;
    refreshProjects: () => Promise<void>;
    refreshMemories: () => Promise<void>;
}

export type UserContextType = UserContextState & UserContextActions;

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        count?: number;
        page?: number;
        totalPages?: number;
    };
}

// Metadata Types
export interface MemoryMetadata {
    source?: string;
    tags?: string[];
    confidence?: number;
    relevance?: number;
    context?: {
        before?: string;
        after?: string;
    };
    embedding_model?: string;
    tokens?: number;
    shared?: string[];
    projectName?: string;
    projectType?: string;
    lastAccessed?: string;
    createdAt?: string;
}

// Form Types
export interface ProjectFormData {
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
}

export interface MemoryFormData {
    content: string;
    type: MemoryType;
    projectId?: string;
    metadata?: MemoryMetadata;
}

// Settings and Configuration Types
export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    embeddings: {
        model: string;
        dimensions: number;
    };
}

// Analytics and Metrics Types
export interface UsageMetrics {
    totalMemories: number;
    totalProjects: number;
    storageUsed: number;
    apiCalls: number;
    lastActive: string;
}

export interface DataSourceMetrics {
    sourceId: string;
    sourceName: string;
    fetchCount: number;
    successRate: number;
    averageResponseTime: number;
    lastFetched: string;
    dataVolume: number;
    contentTypes: Record<string, number>;
}

export interface ContentCluster {
    id: string;
    label: string;
    description: string;
    size: number;
    topics: string[];
    relevanceScore: number;
}

export interface TagSuggestion {
    tag: string;
    confidence: number;
    category: string;
    relatedTags: string[];
    source: 'content' | 'metadata' | 'ai';
}

export interface DataInsight {
    type: 'pattern' | 'anomaly' | 'trend' | 'suggestion';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
    metadata: Record<string, unknown>;
}

export interface ContentAnalysis {
    id: string;
    content: string;
    sourceId: string;
    topics: Array<{
        name: string;
        confidence: number;
    }>;
    suggestedTags: Array<{
        tag: string;
        confidence: number;
    }>;
    relatedContent: Array<{
        id: string;
        similarity: number;
        reason: string;
    }>;
    suggestedProjects: Array<{
        projectId: string;
        projectName: string;
        relevance: number;
        reason: string;
    }>;
}

export interface ContentGroup {
    id: string;
    name: string;
    description: string;
    contentIds: string[];
    commonTopics: string[];
    commonTags: string[];
    suggestedName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationSuggestion {
    type: 'new_project' | 'add_to_project' | 'create_group' | 'add_tags';
    title: string;
    description: string;
    confidence: number;
    action: {
        type: string;
        payload: unknown;
    };
    metadata: {
        affectedContent: string[];
        reasoning: string;
        preview?: string;
    };
} 