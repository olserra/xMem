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

export interface ApiKey extends BaseEntity {
    key: string;
    name?: string;
    userId: string;
    user?: User;
    lastUsed?: string;
    expiresAt?: string;
}

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
    metadata?: any;
}

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED'; 