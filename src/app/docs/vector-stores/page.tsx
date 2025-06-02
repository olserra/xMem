import React from 'react';
import SimpleCodeBlock from '../../../components/SimpleCodeBlock';

export default function VectorStores() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Vector Stores</h1>
      <p className="text-slate-300 mb-6">
        Vector stores power semantic search and retrieval in xmem. You can use open-source solutions like ChromaDB, Qdrant, Pinecone, MongoDB, or even a mock store for dev/testing.
      </p>
      <h2 className="text-xl font-semibold text-white mb-2">Registering a Vector Store</h2>
      <SimpleCodeBlock code={`import { ChromaDBAdapter } from './adapters/chromadb';
import { QdrantAdapter } from './adapters/qdrant';
import { PineconeAdapter } from './adapters/pinecone';
import { MongoDBVectorAdapter } from './adapters/mongodb';

orchestrator.registerProvider('vector', 'chromadb', new ChromaDBAdapter({
  url: process.env.CHROMA_URL || 'http://localhost:8000',
  collection: process.env.CHROMA_COLLECTION || 'xmem_collection',
  apiKey: process.env.CHROMA_API_KEY,
}));

orchestrator.registerProvider('vector', 'qdrant', new QdrantAdapter({
  url: process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333',
  collection: process.env.NEXT_PUBLIC_QDRANT_COLLECTION || 'xmem_collection',
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
}));

orchestrator.registerProvider('vector', 'pinecone', new PineconeAdapter({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || '',
  environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT || 'us-west1-gcp',
  indexName: process.env.NEXT_PUBLIC_PINECONE_INDEX || 'xmem-index',
  projectId: process.env.NEXT_PUBLIC_PINECONE_PROJECT_ID,
}));

orchestrator.registerProvider('vector', 'mongodb', new MongoDBVectorAdapter({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB || 'xmem',
  collectionName: process.env.MONGODB_COLLECTION || 'vectors',
}));

// Set default vector provider
orchestrator.setDefaultProvider('vector', 'chromadb');
`} language="js" />
      <h2 className="text-xl font-semibold text-white mb-2">Supported Vector Stores</h2>
      <ul className="list-disc list-inside text-slate-200 mb-6">
        <li>ChromaDB</li>
        <li>Qdrant</li>
        <li>Pinecone</li>
        <li>MongoDB</li>
        <li>MockVectorStore (for dev/testing)</li>
      </ul>
      <p className="text-slate-400 mt-4">
        <b>Tip:</b> You can register multiple vector stores and select which to use per query.<br />
        <b>Note:</b> It is recommended to use environment variables for sensitive configuration values (URLs, API keys, etc).
      </p>
    </div>
  );
} 