import { BaseEntity } from './core';
import { User } from './core';

export type MemoryType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE' | 'URL' | 'CODE' | 'NOTE' | 'TASK' | 'EVENT' | 'CONTACT' | 'LOCATION' | 'CUSTOM';

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
    lastAccessed?: string;
    createdAt?: string;
}

export interface Memory extends BaseEntity {
    content: string;
    type: MemoryType;
    metadata?: MemoryMetadata;
    embedding?: number[];
    userId: string;
    user?: User;
    version: number;
    isArchived: boolean;
    subjects?: any[];
} 