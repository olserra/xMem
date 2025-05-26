"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, ChevronDown, Database, MessageCircle } from "lucide-react";

// Placeholder: Replace with actual LLM model list fetch if needed
const LLM_MODELS = [
    { id: "llama2", name: "Llama 2" },
    { id: "mistral", name: "Mistral" },
    { id: "vicuna", name: "Vicuna" },
    { id: "falcon", name: "Falcon" },
    { id: "openchat", name: "OpenChat" },
];

export default function AIAgentPage() {
    const [selectedModel, setSelectedModel] = useState(LLM_MODELS[0].id);
    const [sources, setSources] = useState([]); // All available sources
    const [selectedSources, setSelectedSources] = useState<string[]>([]); // Selected source IDs
    const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch available sources from API
        fetch("/api/vector-sources")
            .then((res) => res.json())
            .then((data) => setSources(data || []));
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        setChat((c) => [...c, { role: "user", content: input }]);
        setLoading(true);
        setError(null);
        const history = [...chat, { role: "user", content: input }];
        try {
            const res = await fetch("http://localhost:8000/agent-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: selectedModel,
                    sources: selectedSources,
                    history,
                    user_input: input,
                }),
            });
            if (!res.ok) throw new Error("Agent service error");
            const data = await res.json();
            setChat((c) => [...c, { role: "agent", content: data.reply }]);
        } catch (err: any) {
            setError("Failed to get agent response");
        } finally {
            setInput("");
            setLoading(false);
        }
    };

    const handleSelectAll = () => setSelectedSources(sources.map((s: any) => s.id));
    const handleDeselectAll = () => setSelectedSources([]);

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={28} className="text-teal-500" /> AI Agent
            </h1>
            <div className="bg-white rounded-lg shadow-sm p-6 w-full h-[calc(100vh-8rem)] flex flex-col space-y-6">
                {/* Model Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">LLM Model</label>
                    <div className="relative w-full max-w-xs">
                        <select
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-9 w-full appearance-none"
                        >
                            {LLM_MODELS.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>
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
                        {sources.map((source: any) => (
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
                        {chat.length === 0 && <div className="text-slate-400 text-sm">Start a conversation with your data...</div>}
                        {chat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`rounded px-3 py-2 max-w-xs text-sm ${msg.role === "user" ? "bg-teal-100 text-teal-900" : "bg-slate-200 text-slate-800"}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
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
                    {/* Suggestion: Store conversation memory in a dedicated vector collection (e.g., 'agent-conversations') to avoid mixing with user data sources. */}
                    Conversation memory will be stored separately from your selected sources to keep your data clean.
                </div>
            </div>
        </div>
    );
} 