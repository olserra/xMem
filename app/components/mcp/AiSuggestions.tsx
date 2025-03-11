'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Lightbulb, X } from 'lucide-react';

interface Suggestion {
    id: string;
    content: string;
    type: 'memory' | 'project' | 'context';
    timestamp: string;
}

export function AiSuggestions() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isMinimized, setIsMinimized] = useState(false);

    const removeSuggestion = (id: string) => {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
    };

    // Mock suggestions - replace with actual MCP suggestions in production
    useEffect(() => {
        const mockSuggestions: Suggestion[] = [
            {
                id: '1',
                content: 'Consider linking this memory with Project X',
                type: 'memory',
                timestamp: new Date().toISOString(),
            },
            {
                id: '2',
                content: 'Similar context found in recent memories',
                type: 'context',
                timestamp: new Date().toISOString(),
            },
        ];
        setSuggestions(mockSuggestions);
    }, []);

    if (suggestions.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isMinimized ? (
                <Button
                    variant="default"
                    size="icon"
                    className="rounded-full shadow-lg"
                    onClick={() => setIsMinimized(false)}
                >
                    <Lightbulb className="w-4 h-4" />
                </Button>
            ) : (
                <Card className="w-80 p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <h3 className="font-medium">AI Suggestions</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsMinimized(true)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="flex items-start space-x-2 p-2 rounded-md bg-secondary/30"
                            >
                                <div className="flex-1">
                                    <p className="text-sm">{suggestion.content}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(suggestion.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeSuggestion(suggestion.id)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
} 