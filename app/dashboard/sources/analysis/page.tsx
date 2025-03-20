"use client";

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ContentAnalysis from '@/app/components/ContentAnalysis';
import { useUser } from '@/app/contexts/UserContext';

export default function AnalysisPage() {
    const { user, data, bearerToken } = useUser();
    const userId = user?.id;
    const [activeTab, setActiveTab] = useState('organization');

    // Debug logs
    useEffect(() => {
        console.log('Analysis Page - User ID:', userId);
        console.log('Analysis Page - Bearer Token:', bearerToken);
        console.log('Analysis Page - Active Tab:', activeTab);
        console.log('Analysis Page - Data:', data);
    }, [userId, bearerToken, activeTab, data]);

    // Calculate some basic stats
    const totalData = data?.length || 0;

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Content Analysis & Organization</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Total Data</h3>
                        <p className="text-2xl font-bold">{totalData}</p>
                    </Card>
                </div>

                <Tabs defaultValue="organization" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

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

                </Tabs>
            </div>
        </MaxWidthWrapper>
    );
} 