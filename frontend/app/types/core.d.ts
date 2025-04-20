import { ApiKey, Role } from './auth';
import { Data, DataType, DataMetadata } from './_data';

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

export interface DataFormData {
    content: string;
    type: DataType;
    metadata?: DataMetadata;
} 