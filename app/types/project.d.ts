import { BaseEntity } from './core';
import { Memory } from './memory';
import { User } from './core';

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED';

export interface Project extends BaseEntity {
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
    userId: string;
    user?: User;
    memories?: Memory[];
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