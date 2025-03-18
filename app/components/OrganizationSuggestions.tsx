import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/app/Context';
import { Memory, Project } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enrichMemoryWithMetadata } from '@/app/helpers/memoryHelpers';
import { Lightbulb, Plus, Tags, FolderPlus } from 'lucide-react';

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

interface ContentCluster {
    id: string;
    name: string;
    memories: Memory[];
    commonTopics: string[];
    confidence: number;
}

// Common words to exclude from tag suggestions
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with'
]);

export default function OrganizationSuggestions() {
    const { memories, projects, refreshMemories } = useUser();
    const [selectedTab, setSelectedTab] = useState('projects');
    const [clusters, setClusters] = useState<ContentCluster[]>([]);

    // Debug logs
    console.log('Memories:', memories);
    console.log('Projects:', projects);

    // Generate project suggestions based on content similarity
    const projectSuggestions = useMemo(() => {
        const suggestions: Suggestion[] = [];

        memories.forEach(memory => {
            if (!memory.projectId) { // Only suggest for unassigned memories
                projects.forEach(project => {
                    // Simple text matching for now - can be enhanced with more sophisticated NLP
                    const memoryContent = memory.content.toLowerCase();
                    const projectName = project.name.toLowerCase();
                    const projectDesc = project.description?.toLowerCase() || '';

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
                    .slice(0, 5);

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

    // Generate content clusters based on content similarity
    useEffect(() => {
        const generateClusters = () => {
            const newClusters: ContentCluster[] = [];
            const processedMemories = new Set<string>();

            memories.forEach(memory => {
                if (processedMemories.has(memory.id)) return;

                const similarMemories = memories.filter(m => {
                    if (m.id === memory.id || processedMemories.has(m.id)) return false;

                    // Simple similarity check based on common words
                    const words1 = new Set(memory.content.toLowerCase().split(/\s+/));
                    const words2 = new Set(m.content.toLowerCase().split(/\s+/));
                    const commonWords = [...words1].filter(word => words2.has(word));
                    const similarity = commonWords.length / Math.max(words1.size, words2.size);

                    return similarity > 0.3; // Threshold for similarity
                });

                if (similarMemories.length > 0) {
                    const clusterMemories = [memory, ...similarMemories];
                    const allContent = clusterMemories.map(m => m.content.toLowerCase()).join(' ');

                    // Extract common topics
                    const words = allContent.split(/\s+/)
                        .filter(word => word.length > 3 && !STOP_WORDS.has(word));
                    const wordFreq = words.reduce((acc, word) => {
                        acc[word] = (acc[word] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>);

                    const commonTopics = Object.entries(wordFreq)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([word]) => word);

                    newClusters.push({
                        id: `cluster-${newClusters.length + 1}`,
                        name: `Content Cluster ${newClusters.length + 1}`,
                        memories: clusterMemories,
                        commonTopics,
                        confidence: 0.7 // Base confidence for clusters
                    });

                    clusterMemories.forEach(m => processedMemories.add(m.id));
                }
            });

            setClusters(newClusters);
        };

        generateClusters();
    }, [memories]);

    // Add loading state
    if (!memories || !projects) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-gray-500">Loading organization suggestions...</p>
            </div>
        );
    }

    // Add empty state
    if (memories.length === 0 || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <p className="text-gray-500">No content available for organization.</p>
                <p className="text-sm text-gray-400">
                    Add some memories and projects to get organization suggestions.
                </p>
            </div>
        );
    }

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

            refreshMemories();
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    // Function to create a new project from a cluster
    const handleCreateProjectFromCluster = async (cluster: ContentCluster) => {
        try {
            // First create a new project
            const projectResponse = await fetch('/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: cluster.name,
                    description: `Auto-generated project from content cluster. Common topics: ${cluster.commonTopics.join(', ')}`,
                }),
            });

            if (!projectResponse.ok) {
                throw new Error('Failed to create project');
            }

            const project = await projectResponse.json();

            // Then assign all memories to the new project
            await Promise.all(cluster.memories.map(memory =>
                fetch(`/api/memory/${memory.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        projectId: project.id,
                        metadata: {
                            ...memory.metadata,
                            lastOrganized: new Date().toISOString(),
                            organizationConfidence: cluster.confidence,
                        }
                    }),
                })
            ));

            refreshMemories();
        } catch (error) {
            console.error('Error creating project from cluster:', error);
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
                                        <div className="flex items-center space-x-2">
                                            <FolderPlus className="w-4 h-4" />
                                            <h3 className="font-medium">
                                                Suggested Project: {suggestion.project.name}
                                            </h3>
                                        </div>
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
                                        <div className="flex items-center space-x-2">
                                            <Tags className="w-4 h-4" />
                                            <h3 className="font-medium">
                                                Suggested Tag: {suggestion.tag}
                                            </h3>
                                        </div>
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
                    {clusters.length > 0 ? (
                        clusters.map((cluster) => (
                            <Card key={cluster.id} className="p-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Lightbulb className="w-4 h-4" />
                                                <h3 className="font-medium">{cluster.name}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {cluster.commonTopics.map((topic) => (
                                                    <Badge key={topic} variant="secondary">
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {cluster.memories.length} memories
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">Related Memories:</h4>
                                        {cluster.memories.map((memory) => (
                                            <div
                                                key={memory.id}
                                                className="text-sm text-gray-600 line-clamp-1"
                                            >
                                                {memory.content}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => handleCreateProjectFromCluster(cluster)}
                                            variant="default"
                                            size="sm"
                                        >
                                            Create Project from Cluster
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            No content clusters available at this time.
                        </p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
} 