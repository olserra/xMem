import { getServerSession } from 'next-auth/next';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { User, Project, ProjectType } from '../types';
import { authOptions } from '@/lib/auth';

export async function getAuthenticatedUser(): Promise<User> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new AuthenticationError();
    }

    // Convert session user to our User type
    const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role,
        apiKeys: [],
        data: []
    };

    return user;
}

export function validateApiKey(apiKey: string): boolean {
    // TODO: Implement API key validation
    return true;
}

export function generateApiKey(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function hashApiKey(apiKey: string): string {
    // TODO: Implement proper API key hashing
    return apiKey;
}

export function sanitizeUser(user: User): Partial<User> {
    const { id, email, name } = user;
    return { id, email, name };
}

export function isAdmin(user: User): boolean {
    // TODO: Implement admin check
    return false;
}

export function canManageUsers(user: User): boolean {
    return isAdmin(user);
}

export function canCreateProject(user: User, projectType: ProjectType): boolean {
    switch (projectType) {
        case 'PERSONAL':
            return true;
        case 'TEAM':
            return user.role === 'ADMIN' || user.role === 'MANAGER';
        case 'ORGANIZATION':
            return user.role === 'ADMIN';
        default:
            return false;
    }
}

export async function validateSession(): Promise<User> {
    try {
        return await getAuthenticatedUser();
    } catch (error) {
        throw new AuthenticationError();
    }
}

export function createAuthHeaders(token: string): Headers {
    return new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });
}

export async function refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
}> {
    // TODO: Implement token refresh
    return {
        accessToken: '',
        refreshToken: '',
    };
}

export function parseAuthHeader(header: string | null): string | null {
    if (!header || !header.startsWith('Bearer ')) {
        return null;
    }

    return header.slice(7);
}

export function validateToken(token: string): boolean {
    // TODO: Implement token validation
    return true;
}

export function revokeToken(token: string): Promise<void> {
    // TODO: Implement token revocation
    return Promise.resolve();
}

export async function logout(): Promise<void> {
    // TODO: Implement logout
    return Promise.resolve();
} 