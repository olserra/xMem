import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function Integrations() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Integrations</h1>
            <p className="text-slate-300 mb-6">
                xmem is designed to be modular and pluggable. You can integrate with a wide range of LLMs, vector stores, and session stores. Here are some common integrations:
            </p>
            <h2 className="text-xl font-semibold text-white mb-2">LLM Integrations</h2>
            <ul className="list-disc list-inside text-slate-200 mb-4">
                <li>Llama.cpp</li>
                <li>Ollama</li>
                <li>Mistral</li>
                <li>HuggingFace Inference API</li>
                <li>OpenAI</li>
                <li>Gemini (Google AI)</li>
            </ul>
            <SimpleCodeBlock code={`import { LlamaCppAdapter } from './adapters/llamaCpp';
orchestrator.registerProvider('llm', 'llama', new LlamaCppAdapter({ apiUrl: 'http://localhost:8080' }));`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Vector Store Integrations</h2>
            <ul className="list-disc list-inside text-slate-200 mb-4">
                <li>ChromaDB</li>
                <li>Qdrant</li>
                <li>Pinecone</li>
                <li>MockVectorStore (for dev/testing)</li>
            </ul>
            <SimpleCodeBlock code={`import { ChromaDBAdapter } from './adapters/chromadb';
orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({ url: 'http://localhost:8000', collection: 'my_collection' }));`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Session Store Integrations</h2>
            <ul className="list-disc list-inside text-slate-200 mb-4">
                <li>Redis</li>
                <li>PostgreSQL</li>
                <li>MongoDB</li>
            </ul>
            <SimpleCodeBlock code={`import { RedisAdapter } from './adapters/redis';
orchestrator.registerProvider('session', 'redis', new RedisAdapter('redis://localhost:6379'));`} language="js" />
            <p className="text-slate-400 mt-4">
                <b>Tip:</b> You can register multiple providers of each type and select which to use per operation.
            </p>
        </div>
    );
} 