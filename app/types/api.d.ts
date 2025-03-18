export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    type: string | null;
    visibility: 'private' | 'public';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Memory {
    id: string;
    content: string;
    type: string;
    userId: string;
    projectId?: string;
    source?: string;
    sourceId?: string;
    confidence?: number;
    sentiment?: string;
    language?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    isArchived: boolean;
    subjects?: any[];
    project?: Project;
    Memory_B?: Memory[];
}

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

export interface UserContextType extends UserContextState {
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateMemories: (memories: Memory[]) => void;
    refreshProjects: () => Promise<void>;
    refreshMemories: () => Promise<void>;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    metadata?: {
        count?: number;
        page?: number;
        totalPages?: number;
    };
}

export interface ApiPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiPaginatedResponse<T> {
    memories: T[];
    pagination: ApiPagination;
} 