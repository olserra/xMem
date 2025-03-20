import { Project } from './project';
import { ApiKey } from './auth';
import { Data, DataType, DataMetadata } from './_data';

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user?: User;
    lastUsed?: string;
    expiresAt?: string;
}

export interface User extends BaseEntity {
    email: string;
    name: string;
    apiKeys?: ApiKey[];
    projects?: Project[];
    data?: Data[];
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
    data?: Data[];
    _count?: { data: number };
    _dataCount?: number;
    metadata?: any;
}

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED'; 