export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    image?: string;
} 