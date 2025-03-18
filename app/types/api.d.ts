import { Memory } from './memory';
import { Project } from './project';

export interface User {
    id: string;
    email: string;
    name: string;
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
    userId: string | null;
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