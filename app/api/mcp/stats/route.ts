import { NextResponse } from 'next/server';
import type { McpStats } from '@/app/types/mcp';

export async function GET() {
    // This is a placeholder implementation
    // In the future, this will fetch real stats from the database
    const mockStats: McpStats = {
        activeMemories: 0,
        contextSize: 0,
        pendingSuggestions: 0,
        lastSync: new Date().toISOString(),
        status: 'connected',
    };

    return NextResponse.json(mockStats);
} 