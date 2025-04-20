import { useMemo } from 'react';
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
import { useUser } from '@/app/contexts/UserContext';

export default function ContentAnalysis() {
    const { data } = useUser();

    // Analyze content types distribution
    const typeDistribution = useMemo(() => {
        const distribution = data.reduce((acc, _data) => {
            acc[_data.type] = (acc[_data.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(distribution)
            .map(([type, count]) => ({
                type,
                count,
                percentage: (count / data.length * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count);
    }, [data]);

    // Analyze content growth over time
    const contentGrowth = useMemo(() => {
        const timelineData = data.reduce((acc, _data) => {
            const date = new Date(_data.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(timelineData)
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    // Calculate average content length and identify patterns
    const contentMetrics = useMemo(() => {
        const lengths = data.map(m => m.content.length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const maxLength = Math.max(...lengths);
        const minLength = Math.min(...lengths);

        return {
            averageLength: Math.round(avgLength),
            maxLength,
            minLength,
            totalCharacters: lengths.reduce((a, b) => a + b, 0),
        };
    }, [data]);

    // Handle empty state
    if (data.length === 0) {
        return (
            <div className="space-y-8">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">No Content to Analyze</h3>
                    <p className="text-gray-500">
                        Start adding data to see insights and patterns in your content.
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