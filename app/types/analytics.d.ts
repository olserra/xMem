export interface UsageMetrics {
    totalMemories: number;
    totalProjects: number;
    storageUsed: number;
    apiCalls: number;
    lastActive: string;
}

export interface DataSourceMetrics {
    sourceId: string;
    sourceName: string;
    fetchCount: number;
    successRate: number;
    averageResponseTime: number;
    lastFetched: string;
    dataVolume: number;
    contentTypes: Record<string, number>;
}

export interface ContentCluster {
    id: string;
    label: string;
    description: string;
    size: number;
    topics: string[];
    relevanceScore: number;
}

export interface TagSuggestion {
    tag: string;
    confidence: number;
    category: string;
    relatedTags: string[];
    source: 'content' | 'metadata' | 'ai';
}

export interface DataInsight {
    type: 'pattern' | 'anomaly' | 'trend' | 'suggestion';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
    metadata: Record<string, any>;
}

export interface ContentAnalysis {
    id: string;
    content: string;
    sourceId: string;
    topics: Array<{
        name: string;
        confidence: number;
    }>;
    suggestedTags: Array<{
        tag: string;
        confidence: number;
    }>;
    relatedContent: Array<{
        id: string;
        similarity: number;
        reason: string;
    }>;
    suggestedProjects: Array<{
        projectId: string;
        projectName: string;
        relevance: number;
        reason: string;
    }>;
}

export interface ContentGroup {
    id: string;
    name: string;
    description: string;
    contentIds: string[];
    commonTopics: string[];
    commonTags: string[];
    suggestedName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationSuggestion {
    type: 'new_project' | 'add_to_project' | 'create_group' | 'add_tags';
    title: string;
    description: string;
    confidence: number;
    action: {
        type: string;
        payload: any;
    };
    metadata: {
        affectedContent: string[];
        reasoning: string;
        preview?: string;
    };
}

export interface SyncResult {
    success: boolean;
    message: string;
    source: string;
    itemsSynced?: number;
} 