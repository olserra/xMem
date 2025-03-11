import { useState, useEffect } from 'react';
import type { McpStats } from '@/app/types/mcp';

export function useMcpStats() {
    const [stats, setStats] = useState<McpStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/mcp/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch MCP stats');
                }
                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();

        // Set up polling every 30 seconds
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    return { stats, isLoading, error };
} 