import { ANALYTICS_ENABLED, ANALYTICS_ID } from '../constants';
import { Memory, Project, UsageMetrics } from '../types';

interface AnalyticsEvent {
    type: string;
    userId?: string;
    timestamp: string;
    data: any;
}

class Analytics {
    private static instance: Analytics;
    private events: AnalyticsEvent[] = [];
    private isEnabled: boolean;

    private constructor() {
        this.isEnabled = ANALYTICS_ENABLED && !!ANALYTICS_ID;
    }

    public static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }

    private async trackEvent(event: AnalyticsEvent): Promise<void> {
        if (!this.isEnabled) return;

        this.events.push(event);

        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        } catch (error) {
            console.error('Failed to track analytics event:', error);
        }
    }

    public async trackMemoryCreated(memory: Memory, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'MEMORY_CREATED',
            userId,
            timestamp: new Date().toISOString(),
            data: {
                memoryId: memory.id,
                projectId: memory.projectId,
                type: memory.type,
                contentLength: memory.content.length,
            },
        });
    }

    public async trackMemoryAccessed(memory: Memory, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'MEMORY_ACCESSED',
            userId,
            timestamp: new Date().toISOString(),
            data: {
                memoryId: memory.id,
                projectId: memory.projectId,
                type: memory.type,
            },
        });
    }

    public async trackProjectCreated(project: Project, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'PROJECT_CREATED',
            userId,
            timestamp: new Date().toISOString(),
            data: {
                projectId: project.id,
                type: project.type,
                visibility: project.visibility,
            },
        });
    }

    public async trackSearch(query: string, resultCount: number, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'SEARCH_PERFORMED',
            userId,
            timestamp: new Date().toISOString(),
            data: {
                query,
                resultCount,
            },
        });
    }

    public async trackError(error: Error, context: any = {}, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'ERROR',
            userId,
            timestamp: new Date().toISOString(),
            data: {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
                context,
            },
        });
    }

    public async trackMcpInteraction(
        type: 'QUERY' | 'UPDATE' | 'ERROR',
        details: any,
        userId?: string
    ): Promise<void> {
        await this.trackEvent({
            type: `MCP_${type}`,
            userId,
            timestamp: new Date().toISOString(),
            data: details,
        });
    }

    public async getUsageMetrics(userId: string): Promise<UsageMetrics> {
        if (!this.isEnabled) {
            return {
                totalMemories: 0,
                totalProjects: 0,
                storageUsed: 0,
                apiCalls: 0,
                lastActive: new Date().toISOString(),
            };
        }

        try {
            const response = await fetch(`/api/analytics/metrics/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch usage metrics:', error);
            throw error;
        }
    }

    public getRecentEvents(userId: string, limit: number = 100): AnalyticsEvent[] {
        return this.events
            .filter(event => event.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }

    public clearEvents(): void {
        this.events = [];
    }
}

export const analytics = Analytics.getInstance(); 