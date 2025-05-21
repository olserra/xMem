import React from 'react';

export default function MemoryTypes() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Memory Types</h1>
            <p className="text-slate-300 mb-6">
                xmem supports several memory types to cover all your LLM and agent use cases:
            </p>
            <ul className="list-disc list-inside text-slate-200 mb-6">
                <li><b>User Memory</b>: Long-term memory scoped to a user, persists across sessions.</li>
                <li><b>Session Memory</b>: Short-term memory for a user session, ideal for context windows.</li>
                <li><b>Agent Memory</b>: Long-term memory for an agent or assistant, keeps agent responses consistent.</li>
                <li><b>Dual Memory</b>: Store memories for both user and agent in a single operation for personalized, bidirectional context.</li>
            </ul>
            <h2 className="text-xl font-semibold text-white mb-2">Example: Dual Memory</h2>
            <div className="bg-slate-700/60 rounded p-4 text-slate-200">
                <pre className="text-sm font-mono whitespace-pre-wrap">{`const messages = [
  { role: 'user', content: "I'm travelling to San Francisco" },
  { role: 'assistant', content: "That's great! I'm going to Dubai next month." },
];
orchestrator.addMemory(messages, { user_id: 'user1', agent_id: 'agent1' });`}</pre>
            </div>
            <p className="text-slate-400 mt-4">
                <b>Tip:</b> You can retrieve memories by user, agent, or both, and filter by session, metadata, or categories.
            </p>
        </div>
    );
} 