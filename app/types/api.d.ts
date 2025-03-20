import { Memory } from './_data';
import { Project } from './project';

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface UserContextState {
    user: User | null;
    bearerToken: string | null;
    projects: import('./project').Project[];
    data: Memory[];
    favorites: string[];
    filterLabel: string;
    isLoading: boolean;
    error: Error | null;
}

export interface UserContextType extends UserContextState {
    userId: string | null;
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateData: (data: Memory[]) => void;
    refreshProjects: () => Promise<void>;
    refreshData: () => Promise<void>;
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
    data: T[];
    pagination: ApiPagination;
} 