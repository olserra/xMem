"use client";

import { useState } from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import OrganizationSuggestions from '@/app/components/OrganizationSuggestions';
import ContentAnalysis from '@/app/components/ContentAnalysis';
import { useUser } from '@/app/Context';

export default function AnalysisPage() {
    const { memories, projects } = useUser();
    const [activeTab, setActiveTab] = useState('organization');

    // Calculate some basic stats
    const totalMemories = memories.length;
    const unassignedMemories = memories.filter(m => !m.projectId).length;
    const totalProjects = projects.length;

    return (
        <MaxWidthWrapper>
            <div className="py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Content Analysis</h1>
                    <p className="text-gray-500">
                        Analyze and organize your content with AI-powered suggestions
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Memories</h3>
                        <p className="text-2xl font-bold">{totalMemories}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Unassigned Memories</h3>
                        <p className="text-2xl font-bold">{unassignedMemories}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
                        <p className="text-2xl font-bold">{totalProjects}</p>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs
                    defaultValue="organization"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="organization">Organization</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="clustering">Clustering</TabsTrigger>
                    </TabsList>

                    <TabsContent value="organization" className="mt-6">
                        <div className="space-y-4">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Smart Organization
                                </h2>
                                <p className="text-gray-500 mb-6">
                                    Get AI-powered suggestions for organizing your content into projects,
                                    adding relevant tags, and discovering content clusters.
                                </p>
                                <OrganizationSuggestions />
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Content Analysis
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Insights and patterns from your content collection
                            </p>
                            <ContentAnalysis />
                        </Card>
                    </TabsContent>

                    <TabsContent value="clustering" className="mt-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Content Clustering
                            </h2>
                            <p className="text-gray-500">
                                Discover groups of related content and identify themes across your memories.
                                This feature is coming soon.
                            </p>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MaxWidthWrapper>
    );
} 