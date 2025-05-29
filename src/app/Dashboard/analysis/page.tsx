"use client";
import React, { useEffect, useState } from "react";
import {
    Cell, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis, Legend,
    BarChart, Bar, AreaChart, Area
} from "recharts";
import { Database, PieChart as PieChartIcon, AlertTriangle, ListChecks } from 'lucide-react';
import MetricCard from '../../../components/dashboard/MetricCard';

const COLORS = [
    "#6366f1", "#10b981", "#f59e42", "#a78bfa", "#f43f5e", "#3b82f6", "#fbbf24", "#14b8a6", "#eab308", "#f472b6"
];

// Define types for state
interface TopicDist { name: string; value: number; }
interface TopicTrend { date: string;[topic: string]: number | string; }

export default function AnalysisPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [topicDist, setTopicDist] = useState<TopicDist[]>([]);
    const [topicTrends, setTopicTrends] = useState<TopicTrend[]>([]);
    const [anomalies, setAnomalies] = useState<string[]>([]);
    const [coverage, setCoverage] = useState<{ missing_topics?: string[] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch memory/query items
                const res = await fetch("/api/qdrant-queries?limit=1000");
                if (!res.ok) throw new Error("Failed to fetch memory items");
                const data = await res.json();
                const items: { text?: string; title?: string; content?: string; createdAt?: string; created_at?: string; timestamp?: string }[] = data.queries || [];
                const texts: string[] = items.map((item) => item.text || item.title || item.content || "").filter((t) => t);
                const timestamps: string[] = items.map((item) => item.createdAt || item.created_at || item.timestamp || "");
                const apiUrl = process.env.ML_API_URL; // Set ML_API_URL in your server environment (not NEXT_PUBLIC)
                // 2. Topic distribution
                const topicsRes = await fetch(`${apiUrl}/topics`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ texts }),
                });
                const topicsData = await topicsRes.json();
                // Prepare topic distribution for chart
                const topicCounts: Record<string, number> = {};
                (topicsData.topic_labels || []).forEach((label: string) => {
                    topicCounts[label] = (topicCounts[label] || 0) + 1;
                });
                setTopicDist(Object.entries(topicCounts).map(([name, value]) => ({ name, value: value as number })) || []);
                // 3. Topic trends
                const trendsRes = await fetch(`${apiUrl}/topic-trends`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ texts, timestamps }),
                });
                const trendsData = await trendsRes.json();
                // Convert trends to chart data
                const trendRows: TopicTrend[] = Object.entries(trendsData.trend || {}).map(
                    ([date, topics]) => ({ date, ...(topics as Record<string, number>) })
                );
                setTopicTrends(trendRows || []);
                // 4. Anomalies
                const anomaliesRes = await fetch(`${apiUrl}/anomalies`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ texts }),
                });
                const anomaliesData = await anomaliesRes.json();
                setAnomalies(anomaliesData.anomaly_texts || []);
                // 5. Coverage
                const coverageRes = await fetch(`${apiUrl}/coverage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ texts }),
                });
                const coverageData = await coverageRes.json();
                setCoverage(coverageData);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Compute summary metrics for cards
    const totalTopics = topicDist.length;
    const totalMentions = topicDist.reduce((sum, t) => sum + t.value, 0);
    const anomalyCount = anomalies.length;
    const missingTopics = coverage?.missing_topics?.length || 0;

    // Prepare metric cards
    const metrics: {
        title: string;
        value: string;
        change: string;
        trend: 'neutral' | 'down' | 'up';
        icon: React.ReactNode;
    }[] = [
            {
                title: 'Topics Found',
                value: loading ? '...' : totalTopics.toString(),
                change: '',
                trend: 'neutral',
                icon: <PieChartIcon size={20} className="text-indigo-600" />,
            },
            {
                title: 'Total Mentions',
                value: loading ? '...' : totalMentions.toString(),
                change: '',
                trend: 'neutral',
                icon: <Database size={20} className="text-teal-600" />,
            },
            {
                title: 'Anomalies',
                value: loading ? '...' : anomalyCount.toString(),
                change: '',
                trend: (anomalyCount > 0 ? 'down' : 'neutral'),
                icon: <AlertTriangle size={20} className="text-rose-500" />,
            },
            {
                title: 'Missing Topics',
                value: loading ? '...' : missingTopics.toString(),
                change: '',
                trend: (missingTopics > 0 ? 'down' : 'neutral'),
                icon: <ListChecks size={20} className="text-amber-500" />,
            },
        ];

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <h1 className="text-3xl font-bold mb-4">Analysis Dashboard</h1>
            {loading && <div className="text-slate-400">Loading analysis...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && (
                <>
                    {/* Metrics row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-full mb-4">
                        {metrics.map((metric, index) => (
                            <div className="w-full" key={index}>
                                <MetricCard {...metric} />
                            </div>
                        ))}
                    </div>
                    {/* Charts and lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-x-auto">
                        {/* Topic Distribution */}
                        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-slate-800">Topic Distribution</h2>
                            </div>
                            {Array.isArray(topicDist) && topicDist.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topicDist} layout="vertical" margin={{ left: 32, right: 32, top: 16, bottom: 16 }}>
                                        <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 13 }} width={120} />
                                        <RechartsTooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                            {topicDist.map((entry, i) => (
                                                <Cell key={`cell-bar-${i}`} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-slate-400">No topic data available.</div>
                            )}
                        </div>
                        {/* Topic Trends */}
                        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-slate-800">Topic Trends Over Time</h2>
                            </div>
                            {Array.isArray(topicTrends) && topicTrends.length > 0 && Array.isArray(topicDist) && topicDist.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={topicTrends} margin={{ left: 16, right: 16, top: 16, bottom: 16 }}>
                                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <RechartsTooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        {(topicDist || []).map((t, i) => (
                                            <Area key={t.name} type="monotone" dataKey={t.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15} strokeWidth={2} />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-slate-400">No trend data available.</div>
                            )}
                        </div>
                        {/* Anomalies */}
                        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-slate-800">Anomalies (Outlier Items)</h2>
                            </div>
                            {Array.isArray(anomalies) && anomalies.length === 0 ? (
                                <div className="text-slate-400">No anomalies detected.</div>
                            ) : (
                                <ul className="list-disc pl-6 text-slate-700">
                                    {(anomalies || []).map((text, i) => (
                                        <li key={i}>{text}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* Coverage */}
                        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-slate-800">Topic Coverage</h2>
                            </div>
                            {coverage && (
                                <>
                                    <div className="mb-2">Missing Topics:</div>
                                    {Array.isArray(coverage.missing_topics) && coverage.missing_topics.length === 0 ? (
                                        <div className="text-green-600">All expected topics are covered.</div>
                                    ) : (
                                        <ul className="list-disc pl-6 text-slate-700">
                                            {(coverage.missing_topics || []).map((t: string) => (
                                                <li key={t}>{t}</li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 