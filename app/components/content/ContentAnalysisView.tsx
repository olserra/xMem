'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ContentAnalysis, ContentGroup } from '@/app/types';
import { Network, FileText, FolderTree, Tag } from 'lucide-react';

interface ContentAnalysisViewProps {
    contentAnalysis: ContentAnalysis[];
    contentGroups: ContentGroup[];
    onCreateGroup: (contentIds: string[]) => void;
    onAddToProject: (contentIds: string[], projectId: string) => void;
    onApplyTags: (contentId: string, tags: string[]) => void;
}

export function ContentAnalysisView({
    contentAnalysis,
    contentGroups,
    onCreateGroup,
    onAddToProject,
    onApplyTags,
}: ContentAnalysisViewProps) {
    const [selectedContent, setSelectedContent] = useState<string | null>(null);

    const getTopCommonTopics = () => {
        const topicCounts = new Map<string, number>();
        contentAnalysis.forEach(content => {
            content.topics.forEach(topic => {
                topicCounts.set(topic.name, (topicCounts.get(topic.name) || 0) + 1);
            });
        });
        return Array.from(topicCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    };

    const findRelatedContent = (contentId: string) => {
        const content = contentAnalysis.find(c => c.id === contentId);
        if (!content) return [];
        return content.relatedContent.map(rel => ({
            ...rel,
            content: contentAnalysis.find(c => c.id === rel.id),
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Content Analysis</h2>
                <div className="flex space-x-2">
                    <Badge variant="secondary" className="px-2 py-1">
                        {contentAnalysis.length} items analyzed
                    </Badge>
                    <Badge variant="secondary" className="px-2 py-1">
                        {contentGroups.length} groups
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="topics">
                <TabsList>
                    <TabsTrigger value="topics">
                        <Tag className="w-4 h-4 mr-2" />
                        Common Topics
                    </TabsTrigger>
                    <TabsTrigger value="relationships">
                        <Network className="w-4 h-4 mr-2" />
                        Content Relationships
                    </TabsTrigger>
                    <TabsTrigger value="groups">
                        <FolderTree className="w-4 h-4 mr-2" />
                        Content Groups
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="topics" className="mt-4">
                    <Card className="p-4">
                        <h3 className="font-medium mb-4">Top Common Topics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {getTopCommonTopics().map(([topic, count]) => (
                                <div
                                    key={topic}
                                    className="p-3 rounded-lg border bg-secondary/10"
                                >
                                    <div className="font-medium">{topic}</div>
                                    <div className="text-sm text-gray-600">
                                        Found in {count} items
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="relationships" className="mt-4">
                    <div className="grid gap-4">
                        {contentAnalysis.map(content => (
                            <Card
                                key={content.id}
                                className={`p-4 cursor-pointer transition-colors ${selectedContent === content.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setSelectedContent(
                                    selectedContent === content.id ? null : content.id
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Content from {content.sourceId}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {content.content.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {content.relatedContent.length} connections
                                    </Badge>
                                </div>

                                {selectedContent === content.id && (
                                    <div className="mt-4 space-y-3">
                                        <h5 className="font-medium text-sm">Related Content:</h5>
                                        {findRelatedContent(content.id).map(rel => (
                                            <div
                                                key={rel.id}
                                                className="p-3 rounded-lg bg-secondary/10"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">
                                                            {rel.content?.content.substring(0, 50)}...
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {rel.reason}
                                                        </div>
                                                    </div>
                                                    <Badge>
                                                        {Math.round(rel.similarity * 100)}% similar
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="groups" className="mt-4">
                    <div className="grid gap-4">
                        {contentGroups.map(group => (
                            <Card key={group.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium">{group.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {group.description}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {group.contentIds.length} items
                                    </Badge>
                                </div>

                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {group.commonTopics.map(topic => (
                                            <Badge key={topic} variant="secondary">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onCreateGroup(group.contentIds)}
                                    >
                                        Create Group
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => onAddToProject(group.contentIds, 'new')}
                                    >
                                        Create Project
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 