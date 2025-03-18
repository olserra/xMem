import { Project } from './project';
import { ApiKey } from './auth';

export type MemoryType = 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';

export interface BaseEntity<T = string> {
    id: T;
    createdAt: string;
    updatedAt: string;
}

export interface User extends BaseEntity {
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

export interface Memory extends BaseEntity {
    content: string;
    type: MemoryType;
    metadata?: MemoryMetadata;
    embedding?: number[];
    userId: string;
    projectId?: string;
    project?: Project;
    user?: User;
}

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
}

export interface MemoryFormData {
    content: string;
    type: MemoryType;
    projectId?: string;
    metadata?: MemoryMetadata;
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

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED'; 