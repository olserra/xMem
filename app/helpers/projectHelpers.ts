import { Project, ProjectType, ProjectVisibility, Memory, User } from '../types';
import { validateRequired, validateEnum, validateLength, ValidationError } from '../utils/errors';
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_DESCRIPTION_LENGTH } from '../constants';
import { analytics } from '../utils/analytics';
import { projectCache } from '../utils/cache';
import { canCreateProject } from './auth';

export async function createProject(
    name: string,
    description: string,
    type: ProjectType,
    visibility: ProjectVisibility,
    userId: string,
    metadata?: any
): Promise<Project> {
    // Validate input
    validateRequired(
        { name, description, type, visibility, userId },
        ['name', 'description', 'type', 'visibility', 'userId']
    );
    validateLength(name, 1, MAX_PROJECT_NAME_LENGTH, 'name');
    validateLength(description, 1, MAX_PROJECT_DESCRIPTION_LENGTH, 'description');
    validateEnum(type, ['PERSONAL', 'TEAM', 'ORGANIZATION'], 'type');
    validateEnum(visibility, ['PUBLIC', 'PRIVATE', 'SHARED'], 'visibility');

    // Create project object
    const project: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        type,
        visibility,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata,
    };

    // Track analytics
    await analytics.trackProjectCreated(project, userId);

    return project;
}

export function validateProjectCreation(
    user: User,
    type: ProjectType,
    visibility: ProjectVisibility
): void {
    if (!canCreateProject(user, type)) {
        throw new ValidationError(`You do not have permission to create ${type} projects`);
    }

    if (type === 'PERSONAL' && visibility === 'PUBLIC') {
        throw new ValidationError('Personal projects cannot be public');
    }

    if (type === 'ORGANIZATION' && visibility === 'PRIVATE') {
        throw new ValidationError('Organization projects must be public or shared');
    }
}

export function groupProjectsByType(projects: Project[]): Map<ProjectType, Project[]> {
    return projects.reduce((groups, project) => {
        const group = groups.get(project.type) || [];
        group.push(project);
        groups.set(project.type, group);
        return groups;
    }, new Map<ProjectType, Project[]>());
}

export function sortProjects(
    projects: Project[],
    sortBy: 'name' | 'createdAt' | 'updatedAt' | 'memoryCount' = 'updatedAt',
    order: 'asc' | 'desc' = 'desc'
): Project[] {
    return [...projects].sort((a, b) => {
        let comparison: number;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'memoryCount':
                comparison = (b._count?.memories || 0) - (a._count?.memories || 0);
                break;
            case 'createdAt':
                comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                break;
            case 'updatedAt':
            default:
                comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }

        return order === 'asc' ? -comparison : comparison;
    });
}

export function filterProjects(
    projects: Project[],
    filters: {
        types?: ProjectType[];
        visibility?: ProjectVisibility[];
        searchTerm?: string;
        userId?: string;
    }
): Project[] {
    return projects.filter(project => {
        // Filter by type
        if (filters.types && !filters.types.includes(project.type)) {
            return false;
        }

        // Filter by visibility
        if (filters.visibility && !filters.visibility.includes(project.visibility)) {
            return false;
        }

        // Filter by user
        if (filters.userId && project.userId !== filters.userId) {
            return false;
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            return (
                project.name.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm)
            );
        }

        return true;
    });
}

export function getCachedProject(projectId: string): Project | null {
    return projectCache.get(projectId);
}

export function setCachedProject(project: Project): void {
    projectCache.set(project.id, project);
}

export function removeCachedProject(projectId: string): void {
    projectCache.delete(projectId);
}

export function calculateProjectStats(project: Project, memories: Memory[]): {
    totalMemories: number;
    totalSize: number;
    lastUpdated: string;
    typeBreakdown: Record<string, number>;
} {
    const projectMemories = memories.filter(m => m.projectId === project.id);

    const typeBreakdown = projectMemories.reduce((acc, memory) => {
        acc[memory.type] = (acc[memory.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalSize = projectMemories.reduce(
        (size, memory) => size + memory.content.length,
        0
    );

    const lastUpdated = projectMemories.reduce(
        (latest, memory) => {
            const memoryDate = new Date(memory.updatedAt);
            return memoryDate > latest ? memoryDate : latest;
        },
        new Date(project.updatedAt)
    ).toISOString();

    return {
        totalMemories: projectMemories.length,
        totalSize,
        lastUpdated,
        typeBreakdown,
    };
}

export function enrichProjectWithStats(
    project: Project,
    memories: Memory[]
): Project {
    const stats = calculateProjectStats(project, memories);

    return {
        ...project,
        _count: {
            memories: stats.totalMemories,
        },
        metadata: {
            ...project.metadata,
            stats,
        },
    };
} 