import React from 'react';

export default function FAQ() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg text-teal-300 font-semibold mb-1">What is xmem?</h2>
                    <p className="text-slate-300">xmem is a memory orchestrator for LLMs, combining long-term and session memory for smarter, more relevant AI responses.</p>
                </div>
                <div>
                    <h2 className="text-lg text-teal-300 font-semibold mb-1">Which LLMs are supported?</h2>
                    <p className="text-slate-300">xmem works with any open-source LLM, including Llama, Mistral, and more. You can configure your preferred provider in the orchestrator setup.</p>
                </div>
                <div>
                    <h2 className="text-lg text-teal-300 font-semibold mb-1">How do I store custom data?</h2>
                    <p className="text-slate-300">Use the <span className="bg-slate-800 px-2 py-1 rounded text-teal-200 font-mono text-sm">/api/memory</span> endpoint to add, update, or delete memory items.</p>
                </div>
                <div>
                    <h2 className="text-lg text-teal-300 font-semibold mb-1">Is there a dashboard?</h2>
                    <p className="text-slate-300">Yes! xmem includes a dashboard for monitoring, configuration, and memory management.</p>
                </div>
                <div>
                    <h2 className="text-lg text-teal-300 font-semibold mb-1">Can I use xmem with my own vector database?</h2>
                    <p className="text-slate-300">Absolutely. xmem supports pluggable vector stores, including ChromaDB and others.</p>
                </div>
            </div>
        </div>
    );
} 