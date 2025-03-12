'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { OrganizationSuggestion, ContentAnalysis } from '@/app/types';
import { Lightbulb, Plus, Tags, FolderPlus, ArrowRight } from 'lucide-react';

interface OrganizationSuggestionsProps {
    suggestions: OrganizationSuggestion[];
    onAcceptSuggestion: (suggestion: OrganizationSuggestion) => void;
    onDismissSuggestion: (suggestionId: string) => void;
}

export function OrganizationSuggestions({
    suggestions,
    onAcceptSuggestion,
    onDismissSuggestion,
}: OrganizationSuggestionsProps) {
    const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

    const getIcon = (type: OrganizationSuggestion['type']) => {
        switch (type) {
            case 'new_project':
                return <Plus className="w-4 h-4" />;
            case 'add_to_project':
                return <FolderPlus className="w-4 h-4" />;
            case 'create_group':
                return <Lightbulb className="w-4 h-4" />;
            case 'add_tags':
                return <Tags className="w-4 h-4" />;
            default:
                return <Lightbulb className="w-4 h-4" />;
        }
    };

    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 0.8) return 'bg-green-100 text-green-800';
        if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Organization Suggestions</h2>
                <Badge variant="outline" className="px-2 py-1">
                    {suggestions.length} suggestions
                </Badge>
            </div>

            <div className="grid gap-4">
                {suggestions.map((suggestion) => (
                    <Card
                        key={suggestion.title}
                        className="p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">{getIcon(suggestion.type)}</div>
                                <div>
                                    <h3 className="font-medium">{suggestion.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {suggestion.description}
                                    </p>

                                    {expandedSuggestion === suggestion.title && (
                                        <div className="mt-4 space-y-2">
                                            <div className="text-sm">
                                                <strong>Reasoning:</strong> {suggestion.metadata.reasoning}
                                            </div>
                                            {suggestion.metadata.preview && (
                                                <div className="text-sm">
                                                    <strong>Preview:</strong> {suggestion.metadata.preview}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {suggestion.metadata.affectedContent.map((content, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {content}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Badge
                                    className={getConfidenceBadgeColor(suggestion.confidence)}
                                >
                                    {Math.round(suggestion.confidence * 100)}% confident
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedSuggestion(
                                        expandedSuggestion === suggestion.title ? null : suggestion.title
                                    )}
                                >
                                    {expandedSuggestion === suggestion.title ? 'Less' : 'More'}
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onAcceptSuggestion(suggestion)}
                                    className="ml-2"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 