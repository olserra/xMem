import { Memory, UsageMetrics } from '../types';
import { Data } from '../types/_data';

export class Analytics {
    private static instance: Analytics;
    private userId?: string;

    private constructor() { }

    static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    private async trackEvent(event: {
        type: string;
        userId?: string;
        dataId?: string;
        metadata?: Record<string, any>;
    }): Promise<void> {
        try {
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...event,
                    userId: event.userId || this.userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to track analytics event');
            }
        } catch (error) {
            console.error('Error tracking analytics event:', error);
        }
    }

    public async trackDataCreated(data: Data, userId: string): Promise<void> {
        try {
            // Track data creation event
            await this.trackEvent({
                type: 'DATA_CREATED',
                userId,
                dataId: data.id,
                metadata: {
                    dataType: data.type,
                    projectId: data.projectId,
                    timestamp: new Date().toISOString(),
                    contentLength: data.content.length,
                    hasEmbedding: !!data.embedding,
                    tags: data.metadata?.tags?.length || 0
                }
            });

            // Update usage metrics
            await this.trackUsage({
                userId,
                totalData: 1,
                storageUsed: data.content.length
            });
        } catch (error) {
            console.error('Failed to track data creation:', error);
        }
    }

    public async trackDataUpdated(_data: Memory, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'DATA_UPDATED',
            userId,
            dataId: _data.id,
            metadata: {
                type: _data.type,
                contentLength: _data.content.length,
                metadata: _data.metadata,
            },
        });
    }

    public async trackDataDeleted(dataId: string, userId?: string): Promise<void> {
        await this.trackEvent({
            type: 'DATA_DELETED',
            userId,
            dataId,
        });
    }

    public async trackUsage(metrics: UsageMetrics): Promise<void> {
        await this.trackEvent({
            type: 'USAGE_METRICS',
            userId: metrics.userId,
            metadata: {
                totalData: metrics.totalData,
                totalCharacters: metrics.totalCharacters,
                averageLength: metrics.averageLength,
                typeDistribution: metrics.typeDistribution,
            },
        });
    }
}

export const analytics = Analytics.getInstance(); 