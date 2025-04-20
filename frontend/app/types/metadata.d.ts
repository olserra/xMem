export interface MemoryMetadata {
    source?: string;
    tags?: string[];
    confidence?: number;
    relevance?: number;
    context?: {
        before?: string;
        after?: string;
    };
    embedding_model?: string;
    tokens?: number;
    shared?: string[];
    projectName?: string;
    projectType?: string;
    lastAccessed?: string;
    createdAt?: string;
} 