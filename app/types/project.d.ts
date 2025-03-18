import { Memory } from './core';
import { User } from './core';

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PRIVATE' | 'PUBLIC' | 'SHARED';

export interface Project {
    id: string;
    name: string;
    description: string;
    type: ProjectType | null;
    visibility: ProjectVisibility;
    userId: string;
    createdAt: string;
    updatedAt: string;
    memories?: Memory[];
    user?: User;
    _count?: { memories: number };
    memoryCount?: number;
    metadata?: Record<string, unknown>;
}

export interface ProjectWithCount extends Omit<Project, 'memoryCount'> {
    memoryCount: number;
}

export interface ProjectFormData {
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
} 