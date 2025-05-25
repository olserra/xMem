'use client';
import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import MemorySourceCard from '../components/memory/MemorySourceCard';
import MemoryItemList from '../components/memory/MemoryItemList';
import SessionMemoryManager from '../components/memory/SessionMemoryManager';

interface MemorySource {
  id: string;
  type: string;
  status: string;
  itemCount: number;
  lastSync: string;
  icon: React.ReactNode;
  vectorDbUrl: string;
  apiKey: string;
  embeddingModel: string;
  maxCacheSize: number;
  sessionTtl: number;
  enableCache: boolean;
  collection: string;
  metric?: string;
  dimensions?: number;
}

interface MemorySettings {
  type: string;
  vectorDbUrl: string;
  apiKey: string;
  embeddingModel: string;
  maxCacheSize: number;
  sessionTtl: number;
  enableCache: boolean;
  collection: string;
  metric?: string;
  dimensions?: number;
}

// Add a mapping of provider to supported embedding models
const PROVIDER_EMBEDDING_MODELS: Record<string, { label: string; value: string }[]> = {
  openai: [
    { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
    { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
    { label: 'text-embedding-ada-002 (Legacy)', value: 'text-embedding-ada-002' },
  ],
  ollama: [
    { label: 'llama2-embed', value: 'llama2-embed' },
    { label: 'nomic-embed-text', value: 'nomic-embed-text' },
    { label: 'all-minilm', value: 'all-minilm' },
  ],
  llamacpp: [
    { label: 'llama-embed', value: 'llama-embed' },
  ],
  mistral: [
    { label: 'mistral-embed', value: 'mistral-embed' },
  ],
  pinecone: [
    { label: 'llama-text-embed-v2', value: 'llama-text-embed-v2' },
  ],
  // Add more providers/models as needed
};

const PROVIDERS = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Ollama', value: 'ollama' },
  { label: 'Llama.cpp', value: 'llamacpp' },
  { label: 'Mistral', value: 'mistral' },
  { label: 'Pinecone', value: 'pinecone' },
  // Add more as needed
];

const VECTOR_DB_PROVIDERS = [
  { label: 'Qdrant', value: 'qdrant' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'Pinecone', value: 'pinecone' },
  { label: 'ChromaDB', value: 'chromadb' },
];

const METRIC_OPTIONS = [
  { label: 'Cosine', value: 'cosine' },
  { label: 'Euclidean', value: 'euclidean' },
  { label: 'Dot Product', value: 'dotproduct' },
];

// Simple modal component
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/60">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const defaultSettings: MemorySettings = {
  type: 'qdrant',
  vectorDbUrl: '',
  apiKey: '',
  embeddingModel: 'text-embedding-3-small',
  maxCacheSize: 128,
  sessionTtl: 3600,
  enableCache: true,
  collection: '',
  metric: 'cosine',
  dimensions: 1024,
};

const MemorySettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  settings: MemorySettings & { llmProvider?: string; type?: string };
  onChange: (settings: MemorySettings & { llmProvider?: string; type?: string }) => void;
  onSave: () => void;
}> = ({ open, onClose, settings, onChange, onSave }) => {
  const provider = settings.llmProvider || 'openai';
  const vectorDbProvider = settings.type || 'qdrant';
  const availableModels = PROVIDER_EMBEDDING_MODELS[provider] || [];
  const modelSupported = availableModels.some(m => m.value === settings.embeddingModel);
  const [error, setError] = useState<string | null>(null);

  // When provider changes, update embeddingModel to first supported
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value;
    const newModels = PROVIDER_EMBEDDING_MODELS[newProvider] || [];
    onChange({
      ...settings,
      llmProvider: newProvider,
      embeddingModel: newModels[0]?.value || '',
    });
  };

  // When vector DB provider changes
  const handleVectorDbProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...settings,
      type: e.target.value,
    });
  };

  const handleSave = () => {
    if (!settings.collection || settings.collection.trim() === '') {
      setError('Collection name is required.');
      return;
    }
    setError(null);
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-start gap-6 mb-6">
        <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
          <Database size={20} className="text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-medium text-slate-800 mb-1">Edit Memory Source</h2>
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="collection">
              Collection Name
            </label>
            <input
              type="text"
              id="collection"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2 text-sm text-slate-800 font-medium"
              value={settings.collection}
              onChange={e => onChange({ ...settings, collection: e.target.value })}
              placeholder="Collection Name (e.g. xmem_collection)"
            />
            {error && <div className="text-rose-600 text-xs mb-2">{error}</div>}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="vectorDbProvider">
              Vector DB Provider
            </label>
            <select
              id="vectorDbProvider"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={vectorDbProvider}
              onChange={handleVectorDbProviderChange}
            >
              {VECTOR_DB_PROVIDERS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="vectorDbUrl">
            Vector Database URL
          </label>
          <input
            type="text"
            id="vectorDbUrl"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={settings.vectorDbUrl}
            onChange={e => onChange({ ...settings, vectorDbUrl: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="apiKey">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.apiKey}
              onChange={e => onChange({ ...settings, apiKey: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="llmProvider">
              LLM Provider
            </label>
            <select
              id="llmProvider"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={provider}
              onChange={handleProviderChange}
            >
              {PROVIDERS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="embeddingModel">
              Embedding Model
            </label>
            <select
              id="embeddingModel"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.embeddingModel}
              onChange={e => onChange({ ...settings, embeddingModel: e.target.value })}
            >
              {availableModels.map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
            {!modelSupported && (
              <div className="text-xs text-rose-600 mt-1">Warning: This model is not supported by the selected provider.</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="maxCacheSize">
              Max Cache Size (MB)
            </label>
            <input
              type="number"
              id="maxCacheSize"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.maxCacheSize}
              onChange={e => onChange({ ...settings, maxCacheSize: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sessionTtl">
              Session TTL (seconds)
            </label>
            <input
              type="number"
              id="sessionTtl"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.sessionTtl}
              onChange={e => onChange({ ...settings, sessionTtl: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <input
            id="enableCache"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            checked={settings.enableCache}
            onChange={e => onChange({ ...settings, enableCache: e.target.checked })}
          />
          <label htmlFor="enableCache" className="ml-2 block text-sm text-slate-700">
            Enable local memory cache
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="metric">
              Metric
            </label>
            <select
              id="metric"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.metric}
              onChange={e => onChange({ ...settings, metric: e.target.value })}
            >
              {METRIC_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="dimensions">
              Dimensions
            </label>
            <input
              type="number"
              id="dimensions"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.dimensions}
              onChange={e => onChange({ ...settings, dimensions: Number(e.target.value) })}
              min={1}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

const MemoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vectorDb');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<MemorySource | null>(null);
  const [memorySettings, setMemorySettings] = useState<MemorySettings>(defaultSettings);
  const [memorySources, setMemorySources] = useState<MemorySource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMode, setIsAddMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to show error for 5 seconds
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  // Helper: sync a single source by id
  const syncSource = async (source: MemorySource) => {
    try {
      const isQdrant = source.type === 'qdrant' || source.collection.toLowerCase().includes('qdrant');
      const payload = {
        checkConnection: true,
        url: source.vectorDbUrl,
        apiKey: source.apiKey,
        type: isQdrant ? 'qdrant' : source.type,
        collection: source.collection,
      };
      const res = await fetch('/api/vector-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // Optionally update status in state
      setMemorySources(sources => sources.map(s =>
        s.id === source.id ? { ...s, status: data.status === 'connected' ? 'connected' : 'disconnected' } : s
      ));
    } catch { }
  };

  // Fetch memory sources from backend on mount
  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/vector-sources');
        if (res.ok) {
          const data = await res.json();
          setMemorySources(data);
          // After setting, auto-sync all sources (except template)
          data.forEach((source: MemorySource) => {
            if (source.id !== 'template') syncSource(source);
          });
        }
      } catch { }
      finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  // Filter memory sources based on active tab
  const filteredSources = activeTab === 'all'
    ? memorySources
    : activeTab === 'vectorDb'
      ? memorySources.filter(source => VECTOR_DB_PROVIDERS.some(p => p.value === source.type))
      : memorySources.filter(source => source.type === activeTab);

  // Helper: check if template card is present
  const hasTemplate = memorySources.some(s => s.id === 'template');

  // Handle edit
  const handleEdit = (source: MemorySource) => {
    setEditingSource(source);
    setMemorySettings({
      type: source.type,
      vectorDbUrl: source.vectorDbUrl,
      apiKey: source.apiKey,
      embeddingModel: source.embeddingModel,
      maxCacheSize: source.maxCacheSize,
      sessionTtl: source.sessionTtl,
      enableCache: source.enableCache,
      collection: source.collection,
      metric: source.metric,
      dimensions: source.dimensions,
    });
    setIsAddMode(false);
    setEditModalOpen(true);
  };

  // Handle add new source
  const handleAdd = () => {
    if (!hasTemplate) {
      setMemorySources(sources => [
        {
          id: 'template',
          type: memorySettings.type || defaultSettings.type,
          status: 'disconnected',
          itemCount: 0,
          lastSync: '',
          icon: <Database size={24} className="text-indigo-300" />,
          vectorDbUrl: '',
          apiKey: '',
          embeddingModel: 'text-embedding-3-small',
          maxCacheSize: 128,
          sessionTtl: 3600,
          enableCache: true,
          collection: '',
          metric: 'cosine',
          dimensions: 1024,
        },
        ...sources,
      ]);
    }
    setEditingSource({
      id: 'template',
      type: memorySettings.type || defaultSettings.type,
      status: 'disconnected',
      itemCount: 0,
      lastSync: '',
      icon: <Database size={24} className="text-indigo-300" />,
      vectorDbUrl: '',
      apiKey: '',
      embeddingModel: 'text-embedding-3-small',
      maxCacheSize: 128,
      sessionTtl: 3600,
      enableCache: true,
      collection: '',
      metric: 'cosine',
      dimensions: 1024,
    });
    setMemorySettings(defaultSettings);
    setIsAddMode(true);
    setEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (source: MemorySource) => {
    if (source.id === 'template') {
      setMemorySources(sources => sources.filter(s => s.id !== 'template'));
      setEditModalOpen(false);
      setIsAddMode(false);
      return;
    }
    try {
      const res = await fetch('/api/vector-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: source.id }),
      });
      if (res.ok) {
        // Option 1: Remove from state
        // setMemorySources(sources => sources.filter(s => s.id !== source.id));
        // Option 2: Refetch from backend for full sync
        const fetchSources = async () => {
          setLoading(true);
          try {
            const res = await fetch('/api/vector-sources');
            if (res.ok) {
              const data = await res.json();
              setMemorySources(data);
            }
          } catch { }
          finally {
            setLoading(false);
          }
        };
        fetchSources();
      } else {
        const data = await res.json().catch(() => ({}));
        showError(data?.error || 'Failed to delete source');
      }
    } catch {
      showError('Failed to delete source');
    }
  };

  // Handle status change from child
  const handleStatusChange = (id: string, status: string) => {
    setMemorySources(sources => sources.map(s =>
      s.id === id ? { ...s, status } : s
    ));
  };

  // Handle save (edit or create)
  const handleSave = async () => {
    if (isAddMode && editingSource && editingSource.id === 'template') {
      // Create new from template
      try {
        const res = await fetch('/api/vector-sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...memorySettings,
            vectorDbUrl: memorySettings.vectorDbUrl,
            apiKey: memorySettings.apiKey,
            embeddingModel: memorySettings.embeddingModel,
            maxCacheSize: memorySettings.maxCacheSize,
            sessionTtl: memorySettings.sessionTtl,
            enableCache: memorySettings.enableCache,
            collection: memorySettings.collection,
            type: memorySettings.type,
            status: 'disconnected',
            itemCount: 0,
            lastSync: null,
            metric: memorySettings.metric,
            dimensions: memorySettings.dimensions,
          }),
        });
        if (res.ok) {
          const { id } = await res.json();
          setMemorySources(sources => [
            {
              id,
              ...memorySettings,
              type: memorySettings.type,
              status: 'disconnected',
              itemCount: 0,
              lastSync: '',
              icon: <Database size={24} className="text-indigo-600" />,
            },
            ...sources.filter(s => s.id !== 'template'),
          ].map(s => ({
            ...s,
            icon: s.icon || <Database size={24} className={s.id === 'template' ? 'text-indigo-300' : 'text-indigo-600'} />
          })));
        } else {
          const data = await res.json().catch(() => ({}));
          showError(data?.error || 'Failed to add source');
        }
      } catch {
        showError('Failed to add source');
      }
    } else if (isAddMode) {
      // Defensive: shouldn't happen, but fallback to append
      try {
        const res = await fetch('/api/vector-sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...memorySettings,
            vectorDbUrl: memorySettings.vectorDbUrl,
            apiKey: memorySettings.apiKey,
            embeddingModel: memorySettings.embeddingModel,
            maxCacheSize: memorySettings.maxCacheSize,
            sessionTtl: memorySettings.sessionTtl,
            enableCache: memorySettings.enableCache,
            collection: memorySettings.collection,
            type: memorySettings.type,
            status: 'disconnected',
            itemCount: 0,
            lastSync: null,
            metric: memorySettings.metric,
            dimensions: memorySettings.dimensions,
          }),
        });
        if (res.ok) {
          const { id } = await res.json();
          setMemorySources(sources => [
            ...sources,
            {
              id,
              ...memorySettings,
              type: memorySettings.type,
              status: 'disconnected',
              itemCount: 0,
              lastSync: '',
              icon: <Database size={24} className="text-indigo-600" />,
            },
          ].map(s => ({
            ...s,
            icon: s.icon || <Database size={24} className={s.id === 'template' ? 'text-indigo-300' : 'text-indigo-600'} />
          })));
        } else {
          const data = await res.json().catch(() => ({}));
          showError(data?.error || 'Failed to add source');
        }
      } catch {
        showError('Failed to add source');
      }
    } else if (editingSource) {
      // Update existing
      try {
        const res = await fetch('/api/vector-sources', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSource.id,
            ...memorySettings,
            vectorDbUrl: memorySettings.vectorDbUrl,
            apiKey: memorySettings.apiKey,
            embeddingModel: memorySettings.embeddingModel,
            maxCacheSize: memorySettings.maxCacheSize,
            sessionTtl: memorySettings.sessionTtl,
            enableCache: memorySettings.enableCache,
            collection: memorySettings.collection,
            type: memorySettings.type,
            status: memorySettings.status,
            itemCount: memorySettings.itemCount,
            lastSync: memorySettings.lastSync,
            metric: memorySettings.metric,
            dimensions: memorySettings.dimensions,
          }),
        });
        if (res.ok) {
          setMemorySources(sources => sources.map(s =>
            s.id === editingSource.id
              ? { ...s, ...memorySettings, collection: memorySettings.collection }
              : s
          ));
        } else {
          const data = await res.json().catch(() => ({}));
          showError(data?.error || 'Failed to update source');
        }
      } catch {
        showError('Failed to update source');
      }
    }
    setEditModalOpen(false);
    setIsAddMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow z-50">
          {errorMsg}
        </div>
      )}
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8" aria-label="Memory Sources">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setActiveTab('vectorDb')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'vectorDb'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            Vector DB
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'session'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            Session Memory
          </button>
        </nav>
      </div>

      {/* Add Source Button */}
      {activeTab !== 'session' && (
        <div className="flex justify-end mt-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
            onClick={handleAdd}
          >
            + Add Source
          </button>
        </div>
      )}

      {/* Memory sources grid */}
      {activeTab === 'session' ? (
        <SessionMemoryManager />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Template Card */}
          {(!isAddMode && !hasTemplate) && (
            <MemorySourceCard
              key="template"
              source={{
                id: 'template',
                type: 'vectorDb',
                status: 'disconnected',
                itemCount: 0,
                lastSync: '',
                icon: <Database size={24} className="text-indigo-300" />,
                vectorDbUrl: '',
                apiKey: '',
                embeddingModel: 'text-embedding-3-small',
                maxCacheSize: 128,
                sessionTtl: 3600,
                enableCache: true,
                collection: '',
                metric: 'cosine',
                dimensions: 1024,
              }}
              onEdit={handleAdd}
              onDelete={() => { }}
              onStatusChange={() => { }}
            />
          )}
          {loading ? (
            <div className="col-span-full text-center text-slate-400">Loading...</div>
          ) : filteredSources.map((source) => (
            <MemorySourceCard
              key={source.id}
              source={source}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
          {(!loading && filteredSources.length === 0 && !hasTemplate) && (
            <div className="col-span-full text-center text-slate-400">No memory sources found.</div>
          )}
        </div>
      )}
      {/* Memory items */}
      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-lg text-slate-800">Recent Memory Items</h2>
        </div>
        <MemoryItemList />
      </div>
      {/* Edit/Add modal */}
      <MemorySettingsModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setIsAddMode(false); }}
        settings={memorySettings}
        onChange={setMemorySettings}
        onSave={handleSave}
      />
    </div>
  );
};

export default MemoryManager;