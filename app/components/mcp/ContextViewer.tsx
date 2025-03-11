'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Brain, Network, RefreshCw } from 'lucide-react';

interface ContextNode {
    id: string;
    type: 'memory' | 'project';
    title: string;
    connections: string[];
}

export function ContextViewer() {
    const [isLoading, setIsLoading] = useState(false);
    const [nodes, setNodes] = useState<ContextNode[]>([
        {
            id: '1',
            type: 'memory',
            title: 'Recent Memory',
            connections: ['2', '3'],
        },
        {
            id: '2',
            type: 'project',
            title: 'Project Alpha',
            connections: ['1'],
        },
        {
            id: '3',
            type: 'memory',
            title: 'Related Context',
            connections: ['1'],
        },
    ]);

    const refreshContext = () => {
        setIsLoading(true);
        // Simulate context refresh - replace with actual MCP context update
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Context Map</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshContext}
                    disabled={isLoading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="relative h-[300px] border rounded-md p-4">
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`absolute p-2 rounded-md ${node.type === 'memory' ? 'bg-blue-100' : 'bg-green-100'
                            }`}
                        style={{
                            left: `${Math.random() * 80}%`,
                            top: `${Math.random() * 80}%`,
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            {node.type === 'memory' ? (
                                <Brain className="w-4 h-4" />
                            ) : (
                                <Network className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">{node.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-100" />
                        <span>Memories</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-100" />
                        <span>Projects</span>
                    </div>
                </div>
                <span>{nodes.length} nodes</span>
            </div>
        </Card>
    );
} 