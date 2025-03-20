import { BaseEntity } from './core';
import { Data } from './_data';
import { User } from './core';

export type ProjectType = 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'SHARED';

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
    metadata?: Record<string, unknown>;
}

export interface ProjectWithCount extends Omit<Project, '_dataCount'> {
    _dataCount: number;
}

export interface ProjectFormData {
    name: string;
    description: string;
    type: ProjectType;
    visibility: ProjectVisibility;
} 