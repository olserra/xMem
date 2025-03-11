'use client';

import { useEffect, useState } from 'react';
import { MCP_CONFIG } from '@/app/constants';
import { Button } from '../ui/button';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export function McpStatus() {
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        if (!MCP_CONFIG.ENABLED) {
            setStatus('disconnected');
            return;
        }

        // Simulate connection status - replace with actual WebSocket status in production
        setStatus('connected');
        setLastUpdate(new Date());
    }, []);

    return (
        <div className="flex items-center space-x-2 p-2 rounded-md bg-secondary/50">
            <div className="flex items-center">
                {status === 'connected' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {status === 'disconnected' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {status === 'connecting' && (
                    <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
                )}
            </div>
            <span className="text-sm font-medium">
                MCP {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {lastUpdate && (
                <span className="text-xs text-muted-foreground">
                    Last update: {lastUpdate.toLocaleTimeString()}
                </span>
            )}
            {status === 'disconnected' && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatus('connecting')}
                    className="ml-2"
                >
                    Reconnect
                </Button>
            )}
        </div>
    );
} 