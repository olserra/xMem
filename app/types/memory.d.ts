import { BaseEntity, User } from './base';

export type MemoryType = 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';

export interface MemoryMetadata {
    source?: string;
    sourceId?: string;
    confidence?: number;
    sentiment?: string;
    language?: string;
    tags?: string[];
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

export interface Project extends BaseEntity {
    name: string;
    description: string;
    type: string | null;
    visibility: 'private' | 'public';
    userId: string;
    memories?: Memory[];
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
    version: number;
    isArchived: boolean;
    subjects?: any[];
} 