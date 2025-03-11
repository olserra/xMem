export interface Memory {
    id: string;
    content: string;
    type: 'text' | 'code' | 'image' | 'link';
    metadata: {
        title?: string;
        description?: string;
        tags?: string[];
        createdAt: string;
        updatedAt: string;
        source?: string;
        embedding?: number[];
        embedding_model?: string;
        tokens?: number;
    };
    relationships?: {
        connectedMemories?: string[];
        projects?: string[];
        context?: string[];
    };
}

export interface McpContext {
    id: string;
    name: string;
    description?: string;
    memories: Memory[];
    metadata: {
        createdAt: string;
        updatedAt: string;
        size: number;
        memoryCount: number;
    };
}

export interface AiSuggestion {
    id: string;
    type: 'connection' | 'tag' | 'action' | 'insight';
    content: string;
    relevance: number;
    context: {
        memoryIds: string[];
        explanation: string;
    };
    metadata: {
        createdAt: string;
        status: 'pending' | 'accepted' | 'rejected';
    };
}

export interface McpStats {
    activeMemories: number;
    contextSize: number;
    pendingSuggestions: number;
    lastSync: string;
    status: 'connected' | 'disconnected' | 'connecting';
} 