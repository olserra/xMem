"use client";
import React, { useState } from "react";

// Define the type for the sentiment result
interface SentimentResult {
    sentiment: string;
    score: number;
}

export default function AnalysisPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<SentimentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/sentiment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) throw new Error("Failed to analyze sentiment");
            const data: SentimentResult = await res.json();
            setResult(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Analysis</h1>
            <p className="mb-6 text-slate-700">Run a sentiment analysis experiment below.</p>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-2">ML Experiments</h2>
                <input
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Enter text for sentiment analysis"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                {result && (
                    <div className="mt-4">
                        <div>Sentiment: <b>{result.sentiment}</b></div>
                        <div>Score: <b>{result.score}</b></div>
                    </div>
                )}
                {!result && !loading && !error && (
                    <p className="text-slate-500 mt-4">No experiments yet. Run a sentiment analysis or other ML experiment to see results here.</p>
                )}
            </div>
        </div>
    );
} 