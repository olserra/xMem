import { useUser } from '@/app/contexts/UserContext';

interface MCPResponse<T> {
    status: 'success' | 'error';
    data?: T;
    error?: string;
}

interface Memory {
    id: string;
    content: string;
    tags: string[];
    project_id?: string;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

interface SearchResult {
    ids: string[];
    documents: string[];
    metadatas: Record<string, any>[];
    distances: number[];
}

export class MCPClient {
    private baseUrl: string;
    private bearerToken: string;
    private userId: string;

    constructor(baseUrl: string, bearerToken: string, userId: string) {
        this.baseUrl = baseUrl;
        this.bearerToken = bearerToken;
        this.userId = userId;
    }

    private async request<T>(
        endpoint: string,
        method: string = 'GET',
        body?: any
    ): Promise<MCPResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Authorization': `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        return data as MCPResponse<T>;
    }

    async createMemory(
        content: string,
        tags: string[] = [],
        projectId?: string,
        metadata?: Record<string, any>
    ): Promise<MCPResponse<{ memory_id: string }>> {
        return this.request('/create_memory', 'POST', {
            content,
            tags,
            project_id: projectId,
            metadata,
        });
    }

    async updateMemory(
        memoryId: string,
        content?: string,
        tags?: string[],
        metadata?: Record<string, any>
    ): Promise<MCPResponse<{ message: string }>> {
        return this.request('/update_memory', 'POST', {
            memory_id: memoryId,
            content,
            tags,
            metadata,
        });
    }

    async deleteMemory(
        memoryId: string
    ): Promise<MCPResponse<{ message: string }>> {
        return this.request('/delete_memory', 'POST', {
            memory_id: memoryId,
        });
    }

    async assignToProject(
        memoryId: string,
        projectId: string
    ): Promise<MCPResponse<{ message: string }>> {
        return this.request('/assign_to_project', 'POST', {
            memory_id: memoryId,
            project_id: projectId,
        });
    }

    async listMemories(
        projectId?: string,
        tags?: string[]
    ): Promise<MCPResponse<{ memories: Memory[] }>> {
        const params = new URLSearchParams();
        if (projectId) params.append('project_id', projectId);
        if (tags) params.append('tags', JSON.stringify(tags));

        return this.request(`/list_memories?${params.toString()}`);
    }

    async semanticSearch(
        query: string,
        projectId?: string,
        tags?: string[],
        nResults: number = 10
    ): Promise<MCPResponse<{ results: SearchResult }>> {
        return this.request('/semantic_search', 'POST', {
            query,
            project_id: projectId,
            tags,
            n_results: nResults,
        });
    }

    async addMemory(data: { content: string; metadata: any }) {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.bearerToken && { Authorization: `Bearer ${this.bearerToken}` })
            },
            body: JSON.stringify({
                ...data,
                userId: this.userId,
                type: 'TEXT'
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add memory');
        }

        return response.json();
    }
}

// Hook para usar o cliente MCP
export function useMCPClient() {
    const { bearerToken, userId } = useUser();
    
    if (!bearerToken) {
        throw new Error('Bearer token not available');
    }
    
    return new MCPClient(
        process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8000/mcp',
        bearerToken,
        userId
    );
} 