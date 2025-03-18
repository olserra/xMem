import { Project } from './project';
import { ApiKey, Role } from './auth';
import { Memory, MemoryType, MemoryMetadata } from './memory';

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface User extends BaseEntity {
    email: string;
    name: string;
    role: Role;
    apiKeys?: ApiKey[];
    projects?: Project[];
    memories?: Memory[];
}

export interface ApiKey extends BaseEntity {
    key: string;
    name?: string;
    userId: string;
    user?: User;
    lastUsed?: string;
    expiresAt?: string;
}

export interface MemoryFormData {
    content: string;
    type: MemoryType;
    projectId?: string;
    metadata?: MemoryMetadata;
} 