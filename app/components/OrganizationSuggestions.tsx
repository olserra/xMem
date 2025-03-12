import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/app/Context';
import { Memory, Project } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enrichMemoryWithMetadata } from '@/app/helpers/memoryHelpers';

interface Suggestion {
    memory: Memory;
    project: Project;
    confidence: number;
    reason: string;
}

interface TagSuggestion {
    memory: Memory;
    tag: string;
    confidence: number;
    reason: string;
}

// Common words to exclude from tag suggestions
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with'
]);

export default function OrganizationSuggestions() {
    const { memories, projects, refreshMemories } = useUser();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedTab, setSelectedTab] = useState('projects');

    // Generate project suggestions based on content similarity
    const projectSuggestions = useMemo(() => {
        const suggestions: Suggestion[] = [];

        memories.forEach(memory => {
            if (!memory.projectId) { // Only suggest for unassigned memories
                projects.forEach(project => {
                    // Simple text matching for now - can be enhanced with more sophisticated NLP
                    const memoryContent = memory.content.toLowerCase();
                    const projectName = project.name.toLowerCase();
                    const projectDesc = project.description.toLowerCase();

                    // Check if project name or keywords appear in memory content
                    if (memoryContent.includes(projectName)) {
                        suggestions.push({
                            memory,
                            project,
                            confidence: 0.8, // High confidence for direct name match
                            reason: `Contains project name "${project.name}"`
                        });
                    } else if (projectDesc && memoryContent.includes(projectDesc)) {
                        suggestions.push({
                            memory,
                            project,
                            confidence: 0.6, // Medium confidence for description match
                            reason: `Content matches project description`
                        });
                    }
                });
            }
        });

        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }, [memories, projects]);

    // Generate tag suggestions based on keyword extraction
    const tagSuggestions = useMemo(() => {
        const suggestions: TagSuggestion[] = [];
        const existingTags = new Set(
            memories.flatMap(m => m.metadata?.tags || [])
        );

        memories.forEach(memory => {
            if (!memory.metadata?.tags || memory.metadata.tags.length === 0) {
                // Extract potential keywords from content
                const words = memory.content
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '') // Remove punctuation
                    .split(/\s+/) // Split on whitespace
                    .filter(word =>
                        word.length > 3 && // Only words longer than 3 characters
                        !STOP_WORDS.has(word) // Exclude stop words
                    );

                // Count word frequency
                const wordFreq = words.reduce((acc, word) => {
                    acc[word] = (acc[word] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                // Convert to array and sort by frequency
                const sortedWords = Object.entries(wordFreq)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5); // Take top 5 most frequent words

                sortedWords.forEach(([word, freq]) => {
                    const confidence = Math.min(0.9, 0.5 + (freq / words.length));

                    // Check if this word appears as a tag in other memories
                    const isExistingTag = existingTags.has(word);

                    suggestions.push({
                        memory,
                        tag: word,
                        confidence: isExistingTag ? confidence + 0.1 : confidence,
                        reason: isExistingTag
                            ? `Common word in content and used as tag in other memories`
                            : `Appears ${freq} times in content`
                    });
                });
            }
        });

        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }, [memories]);

    // Function to assign memory to suggested project
    const handleAssignProject = async (suggestion: Suggestion) => {
        try {
            const response = await fetch(`/api/memory/${suggestion.memory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: suggestion.project.id,
                    metadata: {
                        ...suggestion.memory.metadata,
                        lastOrganized: new Date().toISOString(),
                        organizationConfidence: suggestion.confidence,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update memory');
            }

            // Refresh memories to update UI
            refreshMemories();
        } catch (error) {
            console.error('Error assigning project:', error);
        }
    };

    // Function to add suggested tag to memory
    const handleAddTag = async (suggestion: TagSuggestion) => {
        try {
            const currentTags = suggestion.memory.metadata?.tags || [];
            const response = await fetch(`/api/memory/${suggestion.memory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metadata: {
                        ...suggestion.memory.metadata,
                        tags: [...currentTags, suggestion.tag],
                        lastTagged: new Date().toISOString(),
                        tagConfidence: suggestion.confidence,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update memory');
            }

            // Refresh memories to update UI
            refreshMemories();
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="projects" className="w-full">
                <TabsList>
                    <TabsTrigger value="projects">Project Suggestions</TabsTrigger>
                    <TabsTrigger value="tags">Tag Suggestions</TabsTrigger>
                    <TabsTrigger value="clusters">Content Clusters</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                    {projectSuggestions.length > 0 ? (
                        projectSuggestions.map((suggestion, index) => (
                            <Card key={`${suggestion.memory.id}-${index}`} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="font-medium">
                                            Suggested Project: {suggestion.project.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {suggestion.reason}
                                        </p>
                                        <div className="text-sm">
                                            <Badge variant="secondary">
                                                {Math.round(suggestion.confidence * 100)}% confidence
                                            </Badge>
                                        </div>
                                        <p className="text-sm mt-2 line-clamp-2">
                                            Memory: {suggestion.memory.content}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => handleAssignProject(suggestion)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Assign to Project
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            No project suggestions available at this time.
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="tags" className="space-y-4">
                    {tagSuggestions.length > 0 ? (
                        tagSuggestions.map((suggestion, index) => (
                            <Card key={`${suggestion.memory.id}-${index}`} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="font-medium">
                                            Suggested Tag: {suggestion.tag}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {suggestion.reason}
                                        </p>
                                        <div className="text-sm">
                                            <Badge variant="secondary">
                                                {Math.round(suggestion.confidence * 100)}% confidence
                                            </Badge>
                                        </div>
                                        <p className="text-sm mt-2 line-clamp-2">
                                            Memory: {suggestion.memory.content}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => handleAddTag(suggestion)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Add Tag
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            No tag suggestions available at this time.
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="clusters" className="space-y-4">
                    {/* Content clustering will be implemented in the next iteration */}
                    <p className="text-center text-gray-500 py-4">
                        Content clustering coming soon...
                    </p>
                </TabsContent>
            </Tabs>
        </div>
    );
} 