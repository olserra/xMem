'use client';
import React, { useState } from 'react';
import ApiEndpointCard from '../../../components/integration/ApiEndpointCard';
import CodeSnippet from '../../../components/integration/CodeSnippet';

const endpoints = [
    {
        id: 'query',
        name: 'Query with Context',
        method: 'POST',
        path: '/api/query',
        description: 'Send a query and receive an LLM response with intelligently selected context.',
        code: `fetch('/api/query', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ query: 'What is xmem?' })\n})`,
    },
    {
        id: 'session',
        name: 'Session Management',
        method: 'POST',
        path: '/api/sessions',
        description: 'Create and manage memory sessions for conversations.',
        code: `fetch('/api/sessions', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'demo-session' })\n})`,
    },
    {
        id: 'feedback',
        name: 'Feedback Collection',
        method: 'POST',
        path: '/api/feedback',
        description: 'Submit feedback on context relevance to improve future rankings.',
        code: `fetch('/api/feedback', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ queryId: 'abc123', rating: 5 })\n})`,
    },
    {
        id: 'context',
        name: 'Context Preview',
        method: 'GET',
        path: '/api/context',
        description: 'Preview the context that would be selected for a given query.',
        code: `fetch('/api/context?query=What+is+xmem?', { method: 'GET' })`,
    },
    {
        id: 'memory',
        name: 'Memory Management',
        method: 'POST',
        path: '/api/memory',
        description: 'Add, update, or delete items in the memory store.',
        code: `fetch('/api/memory', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ action: 'add', data: { ... } })\n})`,
    },
];

export default function ApiDocs() {
    const [selected, setSelected] = useState('query');
    const endpoint = endpoints.find((e) => e.id === selected);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">API Reference</h1>
            <p className="text-slate-300 mb-6">Explore all available API endpoints for xmem.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {endpoints.map((ep) => (
                    <ApiEndpointCard
                        key={ep.id}
                        endpoint={ep}
                        isSelected={ep.id === selected}
                        onSelect={() => setSelected(ep.id)}
                    />
                ))}
            </div>
            {endpoint && (
                <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">{endpoint.name}</h2>
                    <div className="mb-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 mr-2">{endpoint.method}</span>
                        <code className="text-slate-200">{endpoint.path}</code>
                    </div>
                    <p className="text-slate-300 mb-4">{endpoint.description}</p>
                    <h3 className="text-slate-400 font-semibold mb-2">Example</h3>
                    <CodeSnippet endpoint={endpoint} />
                </div>
            )}
        </div>
    );
} 