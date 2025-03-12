"use client";

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import OrganizationSuggestions from '@/app/components/OrganizationSuggestions';
import ContentAnalysis from '@/app/components/ContentAnalysis';
import { useUser } from '@/app/Context';

export default function AnalysisPage() {
    const { memories, projects, bearerToken, userId } = useUser();
    const [activeTab, setActiveTab] = useState('organization');

    // Debug logs
    useEffect(() => {
        console.log('Analysis Page - User ID:', userId);
        console.log('Analysis Page - Bearer Token:', bearerToken);
        console.log('Analysis Page - Active Tab:', activeTab);
        console.log('Analysis Page - Memories:', memories);
        console.log('Analysis Page - Projects:', projects);
    }, [userId, bearerToken, activeTab, memories, projects]);

    // Calculate some basic stats
    const totalMemories = memories?.length || 0;
    const unassignedMemories = memories?.filter(m => !m.projectId)?.length || 0;
    const totalProjects = projects?.length || 0;

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Content Analysis & Organization</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Total Memories</h3>
                        <p className="text-2xl font-bold">{totalMemories}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Unassigned Memories</h3>
                        <p className="text-2xl font-bold">{unassignedMemories}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Total Projects</h3>
                        <p className="text-2xl font-bold">{totalProjects}</p>
                    </Card>
                </div>

                <Tabs defaultValue="organization" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="organization">Organization</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="clustering">Clustering</TabsTrigger>
                    </TabsList>

                    <TabsContent value="organization" className="space-y-4">
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
                            <p className="text-gray-500 mb-6">
                                Discover groups of related content automatically
                            </p>
                            {/* Content clustering will be implemented later */}
                            <p className="text-center text-gray-500 py-4">
                                Content clustering coming soon...
                            </p>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MaxWidthWrapper>
    );
} 