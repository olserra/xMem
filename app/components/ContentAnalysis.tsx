import { useMemo } from 'react';
import { useUser } from '@/app/Context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function ContentAnalysis() {
    const { memories, projects } = useUser();

    // Analyze content types distribution
    const typeDistribution = useMemo(() => {
        const distribution = memories.reduce((acc, memory) => {
            acc[memory.type] = (acc[memory.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(distribution)
            .map(([type, count]) => ({
                type,
                count,
                percentage: (count / memories.length * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count);
    }, [memories]);

    // Analyze project activity
    const projectActivity = useMemo(() => {
        return projects
            .map(project => {
                const projectMemories = memories.filter(m => m.projectId === project.id);
                const lastActivity = projectMemories.length > 0
                    ? new Date(Math.max(...projectMemories.map(m => new Date(m.updatedAt).getTime())))
                    : new Date(project.updatedAt);

                return {
                    name: project.name,
                    memoryCount: projectMemories.length,
                    lastActivity,
                };
            })
            .sort((a, b) => b.memoryCount - a.memoryCount);
    }, [memories, projects]);

    // Analyze content growth over time
    const contentGrowth = useMemo(() => {
        const timelineData = memories.reduce((acc, memory) => {
            const date = new Date(memory.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(timelineData)
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [memories]);

    // Calculate average content length and identify patterns
    const contentMetrics = useMemo(() => {
        const lengths = memories.map(m => m.content.length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const maxLength = Math.max(...lengths);
        const minLength = Math.min(...lengths);

        return {
            averageLength: Math.round(avgLength),
            maxLength,
            minLength,
            totalCharacters: lengths.reduce((a, b) => a + b, 0),
        };
    }, [memories]);

    // Handle empty state
    if (memories.length === 0) {
        return (
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">No Content to Analyze</h3>
                    <p className="text-gray-500">
                        Start adding memories to see insights and patterns in your content.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Content Metrics */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Content Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Average Length</h4>
                        <p className="text-2xl font-bold">{contentMetrics.averageLength}</p>
                        <p className="text-sm text-gray-500">characters</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Longest Content</h4>
                        <p className="text-2xl font-bold">{contentMetrics.maxLength}</p>
                        <p className="text-sm text-gray-500">characters</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Shortest Content</h4>
                        <p className="text-2xl font-bold">{contentMetrics.minLength}</p>
                        <p className="text-sm text-gray-500">characters</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Total Content</h4>
                        <p className="text-2xl font-bold">{contentMetrics.totalCharacters}</p>
                        <p className="text-sm text-gray-500">characters</p>
                    </div>
                </div>
            </Card>

            {/* Project Activity */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Project Activity</h3>
                <div className="space-y-4">
                    {projectActivity.map(project => (
                        <div key={project.name} className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">{project.name}</h4>
                                <p className="text-sm text-gray-500">
                                    Last activity: {project.lastActivity.toLocaleDateString()}
                                </p>
                            </div>
                            <Badge variant="secondary">
                                {project.memoryCount} memories
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Content Type Distribution */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Content Type Distribution</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {typeDistribution.map(({ type, count, percentage }) => (
                        <Badge key={type} variant="secondary">
                            {type}: {percentage}% ({count})
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Content Growth */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Content Growth</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contentGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

        </div>
    );
} 