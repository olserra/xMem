import { ProjectType, ProjectVisibility, MemoryType } from './core';
import { MemoryMetadata } from './metadata';

export interface ProjectFormData {
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
}

export interface MemoryFormData {
    content: string;
    type: MemoryType;
    projectId?: string;
    metadata?: MemoryMetadata;
} 