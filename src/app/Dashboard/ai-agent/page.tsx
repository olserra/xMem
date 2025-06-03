"use client";
import React, { useState, useEffect } from "react";
import { Database, MessageCircle } from "lucide-react";
import { Suspense } from 'react';

// Use environment variable for default model (client-safe)
const DEFAULT_MODEL_ID = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || process.env.DEFAULT_MODEL_ID || "llama2";

type Source = { id: string; name?: string; collection?: string };

export interface AIAgentPageProps {
    defaultModelId: string;
}

function AIAgentPage({ defaultModelId }: AIAgentPageProps) {
    const [sources, setSources] = useState<Source[]>([]); // All available sources
    const [selectedSources, setSelectedSources] = useState<string[]>([]); // Selected source IDs
    const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const defaultModel = defaultModelId;
    const [chatMemoryVectorProvider, setChatMemoryVectorProvider] = useState('chromadb');

    useEffect(() => {
        // Fetch available sources from API
        fetch("/api/vector-sources")
            .then((res) => res.json())
            .then((data) => {
                setSources(data || []);
            });
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        setChat((c) => [...c, { role: "user", content: input }]);
        setInput("");
        setLoading(true);
        setError(null);
        const history = [...chat, { role: "user", content: input }];
        try {
            const res = await fetch("/api/agent-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: defaultModel,
                    sources: selectedSources,
                    history,
                    user_input: input,
                    chatMemoryVectorProvider,
                }),
            });
            if (!res.ok) throw new Error("Agent service error");
            const data = await res.json();
            setChat((c) => [...c, { role: "agent", content: data.reply }]);
        } catch {
            setError("Failed to get agent response");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => setSelectedSources(sources.map((s) => s.id));
    const handleDeselectAll = () => setSelectedSources([]);

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={28} className="text-teal-500" /> AI Agent
            </h1>
            <div className="bg-white rounded-lg shadow-sm p-6 w-full h-[calc(100vh-8rem)] flex flex-col space-y-6">
                {/* Source Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sources</label>
                    <div className="flex gap-2 mb-2">
                        <button
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                            onClick={handleSelectAll}
                            type="button"
                        >Select All</button>
                        <button
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                            onClick={handleDeselectAll}
                            type="button"
                        >Deselect All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sources.map((source) => (
                            <label key={source.id} className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded px-2 py-1">
                                <input
                                    type="checkbox"
                                    checked={selectedSources.includes(source.id)}
                                    onChange={e => {
                                        setSelectedSources(sel =>
                                            e.target.checked
                                                ? [...sel, source.id]
                                                : sel.filter(id => id !== source.id)
                                        );
                                    }}
                                />
                                <Database size={16} className="text-slate-400" />
                                <span className="text-sm">{source.name || source.collection}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* Chat UI - take all available vertical space */}
                <div className="border-t pt-4 mt-4 flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 rounded p-3 mb-3 flex flex-col gap-2">
                        {chat.length === 0 && !loading && <div className="text-slate-400 text-sm">Start a conversation with your data...</div>}
                        {chat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`rounded px-3 py-2 max-w-xs text-sm ${msg.role === "user" ? "bg-teal-100 text-teal-900" : "bg-slate-200 text-slate-800"}`}>
                                    {msg.content && msg.content.trim() ? msg.content : (msg.role === 'agent' ? <span className="text-slate-400 italic">No response from agent</span> : null)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-center items-center min-h-[2.5rem]">
                                <AnimatedEllipsis />
                            </div>
                        )}
                    </div>
                    <form
                        className="flex gap-2"
                        onSubmit={e => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
                            disabled={loading}
                        >{loading ? "..." : "Send"}</button>
                    </form>
                    {error && <div className="text-xs text-rose-500 mt-2">{error}</div>}
                </div>
                {/* Memory Storage Note */}
                <div className="text-xs text-slate-500 mt-2">
                    Conversation memory will be stored separately from your selected sources to keep your data clean.<br />
                    <span className="font-semibold">Default model in use:</span> <span className="font-mono">{process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free"}</span>
                </div>
            </div>
        </div>
    );
}

function AnimatedEllipsis() {
    return (
        <span aria-label="Loading" className="inline-block w-8 text-left align-middle">
            <span className="dot dot-1" />
            <span className="dot dot-2" />
            <span className="dot dot-3" />
        </span>
    );
}

function getDefaultModelId() {
    return process.env.OPENROUTER_MODEL || process.env.NEXT_PUBLIC_OPENROUTER_MODEL || process.env.DEFAULT_MODEL_ID || "meta-llama/llama-3.1-8b-instruct:free";
}

export default function Page() {
    const defaultModelId = getDefaultModelId();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AIAgentPage defaultModelId={defaultModelId} />
        </Suspense>
    );
} 