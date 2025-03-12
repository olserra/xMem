"use client";

import { useState } from "react";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useUser } from "@/app/Context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import ContentAnalysis from "@/app/components/ContentAnalysis";

export default function AnalysisPage() {
    const { memories } = useUser();
    const [activeTab, setActiveTab] = useState("organization");

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Content Analysis & Organization</h1>

                <Tabs defaultValue="organization" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="organization">Organization</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="clustering">Clustering</TabsTrigger>
                    </TabsList>

                    <TabsContent value="organization" className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Organization Suggestions</h2>
                            <p className="text-gray-600 mb-4">
                                Based on your content, here are suggestions for organizing your memories:
                            </p>
                            {/* Organization suggestions will be implemented here */}
                            <div className="text-gray-500">
                                Coming soon: Smart suggestions for organizing your memories into projects,
                                automatic tagging, and content categorization using open-source NLP models.
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <ContentAnalysis />
                        </div>
                    </TabsContent>

                    <TabsContent value="clustering" className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Content Clustering</h2>
                            <p className="text-gray-600 mb-4">
                                Discover related content and natural groupings:
                            </p>
                            {/* Clustering visualization will be implemented here */}
                            <div className="text-gray-500">
                                Coming soon: Semantic clustering of your memories using sentence-transformers
                                and visualization of content relationships.
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MaxWidthWrapper>
    );
} 