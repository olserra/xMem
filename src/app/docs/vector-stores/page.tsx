import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function VectorStores() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-4">Vector Stores</h1>
            <p className="text-slate-300 mb-6">
                Vector stores power semantic search and retrieval in xmem. You can use open-source solutions like ChromaDB, Qdrant, Pinecone, or even a mock store for dev/testing.
            </p>
            <h2 className="text-xl font-semibold text-white mb-2">Registering a Vector Store</h2>
            <SimpleCodeBlock code={`import { ChromaDBAdapter } from './adapters/chromadb';
orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({ url: 'http://localhost:8000', collection: 'my_collection' }));
orchestrator.setDefaultProvider('vector', 'chromadb');`} language="js" />
            <h2 className="text-xl font-semibold text-white mb-2">Supported Vector Stores</h2>
            <ul className="list-disc list-inside text-slate-200 mb-6">
                <li>ChromaDB</li>
                <li>Qdrant</li>
                <li>Pinecone</li>
                <li>MockVectorStore (for dev/testing)</li>
            </ul>
            <p className="text-slate-400 mt-4">
                <b>Tip:</b> You can register multiple vector stores and select which to use per query.
            </p>
        </div>
    );
} 