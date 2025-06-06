'use client';
import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function Quickstart() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-white">Quickstart</h1>
            <ol className="list-decimal list-inside space-y-6 text-slate-200">
                <li>
                    <strong>Initialize the orchestrator</strong>
                    <SimpleCodeBlock code={`const orchestrator = new XmemOrchestrator();`} language="js" />
                </li>
                <li>
                    <strong>Register your providers</strong>
                    <SimpleCodeBlock code={`orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({ url: 'http://localhost:8000', collection: 'my_collection' }));\norchestrator.registerProvider('llm', 'llama', new LlamaCppAdapter({ apiUrl: 'http://localhost:8080' }));`} language="js" />
                </li>
                <li>
                    <strong>Query with context</strong>
                    <SimpleCodeBlock code={`const response = await orchestrator.query({ input: 'What is xmem?', sessionId: 'demo-session' });`} language="js" />
                </li>
            </ol>
        </div>
    );
} 