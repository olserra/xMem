import { useCallback, useRef, useEffect } from 'react';
import { MCP_CONFIG } from '../constants';
import { useApi } from './useApi';
import { Memory, Project } from '../types';

interface McpMessage {
    type: string;
    payload: any;
}

interface McpClient {
    initialize: () => void;
    cleanup: () => void;
    sendMemory: (memory: Memory) => Promise<void>;
    queryContext: (query: string) => Promise<any>;
    updateContext: (context: any) => Promise<void>;
}

export function useMcpClient(): McpClient {
    const { post } = useApi();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (!MCP_CONFIG.ENABLED) return;

        try {
            const ws = new WebSocket(`${MCP_CONFIG.HOST}/ws`);

            ws.onopen = () => {
                console.log('MCP WebSocket connected');
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
            };

            ws.onclose = () => {
                console.log('MCP WebSocket disconnected');
                // Attempt to reconnect after a delay
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, 5000);
            };

            ws.onerror = (error) => {
                console.error('MCP WebSocket error:', error);
            };

            ws.onmessage = (event) => {
                try {
                    const message: McpMessage = JSON.parse(event.data);
                    handleMessage(message);
                } catch (error) {
                    console.error('Error parsing MCP message:', error);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Error connecting to MCP:', error);
        }
    }, []);

    const handleMessage = useCallback((message: McpMessage) => {
        switch (message.type) {
            case 'CONTEXT_UPDATE':
                // Handle context updates from the MCP server
                console.log('Received context update:', message.payload);
                break;
            case 'SUGGESTION':
                // Handle AI suggestions
                console.log('Received suggestion:', message.payload);
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }, []);

    const sendMessage = useCallback((type: string, payload: any) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            throw new Error('MCP WebSocket not connected');
        }

        wsRef.current.send(JSON.stringify({ type, payload }));
    }, []);

    const sendMemory = useCallback(async (memory: Memory) => {
        if (!MCP_CONFIG.ENABLED) return;

        try {
            // Send memory to MCP server for processing
            await post('/mcp/memories', {
                memory,
                version: MCP_CONFIG.VERSION,
            });

            // Notify connected clients about the new memory
            sendMessage('NEW_MEMORY', { memory });
        } catch (error) {
            console.error('Error sending memory to MCP:', error);
            throw error;
        }
    }, [post, sendMessage]);

    const queryContext = useCallback(async (query: string) => {
        if (!MCP_CONFIG.ENABLED) return null;

        try {
            const response = await post('/mcp/query', {
                query,
                version: MCP_CONFIG.VERSION,
            });

            return response.data;
        } catch (error) {
            console.error('Error querying MCP context:', error);
            throw error;
        }
    }, [post]);

    const updateContext = useCallback(async (context: any) => {
        if (!MCP_CONFIG.ENABLED) return;

        try {
            await post('/mcp/context', {
                context,
                version: MCP_CONFIG.VERSION,
            });

            sendMessage('CONTEXT_UPDATE', { context });
        } catch (error) {
            console.error('Error updating MCP context:', error);
            throw error;
        }
    }, [post, sendMessage]);

    const cleanup = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (MCP_CONFIG.ENABLED) {
            connect();
        }

        return cleanup;
    }, [connect, cleanup]);

    return {
        initialize: connect,
        cleanup,
        sendMemory,
        queryContext,
        updateContext,
    };
} 