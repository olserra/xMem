"use client";
import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis, LineChart, Line, Legend,
} from "recharts";

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
                const apiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";
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

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Analysis Dashboard</h1>
            {loading && <div className="text-slate-400">Loading analysis...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Topic Distribution */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Topic Distribution</h2>
                        <div className="text-slate-500 text-sm mb-2">Shows the most common topics found in your memory items.</div>
                        {Array.isArray(topicDist) && topicDist.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={topicDist || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {(topicDist || []).map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-400">No topic data available.</div>
                        )}
                    </div>
                    {/* Topic Trends */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Topic Trends Over Time</h2>
                        <div className="text-slate-500 text-sm mb-2">Tracks how often each topic appears over time.</div>
                        {Array.isArray(topicTrends) && topicTrends.length > 0 && Array.isArray(topicDist) && topicDist.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={topicTrends}>
                                    <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }} />
                                    <YAxis allowDecimals={false} label={{ value: 'Mentions', angle: -90, position: 'insideLeft' }} />
                                    <RechartsTooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    {(topicDist || []).map((t, i) => (
                                        <Line key={t.name} type="monotone" dataKey={t.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-400">No trend data available.</div>
                        )}
                    </div>
                    {/* Anomalies */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Anomalies (Outlier Items)</h2>
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
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Topic Coverage</h2>
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
            )}
        </div>
    );
} 