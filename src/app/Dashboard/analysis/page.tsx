import React from "react";

export default function AnalysisPage() {
    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Analysis</h1>
            <p className="mb-6 text-slate-700">View and interact with your ML experiments and sentiment analysis results here. More features coming soon!</p>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-2">ML Experiments</h2>
                <p className="text-slate-500">No experiments yet. Run a sentiment analysis or other ML experiment to see results here.</p>
            </div>
        </div>
    );
} 