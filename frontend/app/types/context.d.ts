import { User, Memory } from './core';
import { Project } from './project';

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