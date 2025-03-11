'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { McpStatus } from '@/app/components/mcp/McpStatus';
import { useMcpStats } from '@/app/hooks/useMcpStats';
import { Loader2 } from 'lucide-react';

export default function McpDashboard() {
    const { stats, isLoading, error } = useMcpStats();

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-red-500">Error loading MCP stats: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Memory Context Processing</h1>
                    <p className="text-muted-foreground">Manage and monitor your memory context system</p>
                </div>
                <McpStatus />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="memories">Memories</TabsTrigger>
                    <TabsTrigger value="context">Context Viewer</TabsTrigger>
                    <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Memories</CardTitle>
                                <CardDescription>Total memories in current context</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <div className="text-2xl font-bold">{stats?.activeMemories || 0}</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Context Size</CardTitle>
                                <CardDescription>Current context memory usage</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <div className="text-2xl font-bold">{stats?.contextSize || 0} KB</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>AI Suggestions</CardTitle>
                                <CardDescription>Pending smart suggestions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <div className="text-2xl font-bold">{stats?.pendingSuggestions || 0}</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="memories">
                    <Card>
                        <CardHeader>
                            <CardTitle>Memory Management</CardTitle>
                            <CardDescription>View and manage your stored memories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Memory management interface coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="context">
                    <Card>
                        <CardHeader>
                            <CardTitle>Context Visualization</CardTitle>
                            <CardDescription>Visual representation of memory relationships</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Context visualization coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Suggestions</CardTitle>
                            <CardDescription>Smart recommendations based on your context</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">AI suggestions interface coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 