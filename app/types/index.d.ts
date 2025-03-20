import { Role } from './auth';

// Re-export all types
export * from './core';
export * from './project';
export * from './userContext';
export * from './api';
export * from './forms';
export * from './analytics';
export * from './_data';

// Core Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    apiKeys?: ApiKey[];
    projects?: Project[];
    data?: Memory[];
}

// Export Project types from the main project types file
export { Project, ProjectType, ProjectVisibility, ProjectWithCount, ProjectFormData } from './project';

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

// Context Types
export interface UserContextState {
    user: User | null;
    bearerToken: string | null;
    projects: Project[];
    data: Memory[];
    favorites: string[];
    filterLabel: string;
    isLoading: boolean;
    error: Error | null;
}

export interface UserContextActions {
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateData: (data: Memory[]) => void;
    refreshProjects: () => Promise<void>;
    refreshData: () => Promise<void>;
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
    totalData: number;
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