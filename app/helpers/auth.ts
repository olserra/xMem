import { getServerSession } from 'next-auth/next';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { User, Project } from '../types';
import { authOptions } from '@/lib/auth';

export async function getAuthenticatedUser(): Promise<User> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new AuthenticationError();
    }

    return session.user as User;
}

export function checkProjectAccess(
    project: Project,
    user: User,
    requiredPermission: 'READ' | 'WRITE' | 'ADMIN' = 'READ'
): boolean {
    // Owner has all permissions
    if (project.userId === user.id) {
        return true;
    }

    // Public projects can be read by anyone
    if (project.visibility === 'PUBLIC' && requiredPermission === 'READ') {
        return true;
    }

    // Shared projects need to check specific permissions
    if (project.visibility === 'SHARED') {
        // TODO: Implement shared project permissions
        return false;
    }

    return false;
}

export function assertProjectAccess(
    project: Project,
    user: User,
    requiredPermission: 'READ' | 'WRITE' | 'ADMIN' = 'READ'
): void {
    if (!checkProjectAccess(project, user, requiredPermission)) {
        throw new AuthorizationError('You do not have permission to access this project');
    }
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

export function canCreateProject(user: User, projectType: string): boolean {
    switch (projectType) {
        case 'PERSONAL':
            return true;
        case 'TEAM':
            // TODO: Check team membership
            return false;
        case 'ORGANIZATION':
            return isAdmin(user);
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