interface Project {
    id: string;
    name: string;
    description: string;
    updatedAt: string;
    _count?: { memories: number };
    type?: string;
    visibility?: string;
    createdAt?: string;
    memories?: Memory[];
    memoryCount?: number;
}

interface Memory {
    id: string;
    content: string;
    type: string;
    userId: string;
    projectId?: string;
    project?: Project;
    createdAt: string;
    updatedAt: string;
}

interface UserContextType {
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    bearerToken: string | null;
    projects: Project[];
    memories: Memory[];
    favorites: string[];
    filterLabel: string;
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateMemories: (memories: Memory[]) => void;
}

interface ProjectWithCount extends Project {
    memoryCount: number;
}

interface ApiKey {
    id: string;
    key: string;
    createdAt: string;
} 