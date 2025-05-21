'use client';
import React, { useState } from 'react';
import { Search, Filter, Database, History } from 'lucide-react';
import MemorySourceCard from '../components/memory/MemorySourceCard';
import MemoryItemList from '../components/memory/MemoryItemList';

interface MemorySource {
  id: string;
  name: string;
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
  collection?: string;
}

interface MemorySettings {
  name: string;
  vectorDbUrl: string;
  apiKey: string;
  embeddingModel: string;
  maxCacheSize: number;
  sessionTtl: number;
  enableCache: boolean;
  collection?: string;
}

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
  name: '',
  vectorDbUrl: '',
  apiKey: '',
  embeddingModel: 'text-embedding-3-small',
  maxCacheSize: 128,
  sessionTtl: 3600,
  enableCache: true,
};

const defaultSources: MemorySource[] = [
  {
    id: 'source-1',
    name: 'Project Documentation',
    type: 'vectorDb',
    status: 'connected',
    itemCount: 1243,
    lastSync: '2 hours ago',
    icon: <Database size={24} className="text-indigo-600" />,
    vectorDbUrl: '',
    apiKey: '',
    embeddingModel: 'text-embedding-3-small',
    maxCacheSize: 128,
    sessionTtl: 3600,
    enableCache: true,
    collection: '',
  },
  {
    id: 'source-2',
    name: 'Session Memory',
    type: 'session',
    status: 'active',
    itemCount: 87,
    lastSync: 'Live',
    icon: <History size={24} className="text-teal-600" />,
    vectorDbUrl: '',
    apiKey: '',
    embeddingModel: 'text-embedding-3-small',
    maxCacheSize: 128,
    sessionTtl: 3600,
    enableCache: true,
    collection: '',
  },
  {
    id: 'source-3',
    name: 'Project Qdrant Instance',
    type: 'qdrant',
    status: 'connected',
    itemCount: 8452,
    lastSync: '1 day ago',
    icon: <Database size={24} className="text-purple-600" />,
    vectorDbUrl: '',
    apiKey: '',
    embeddingModel: 'text-embedding-3-small',
    maxCacheSize: 128,
    sessionTtl: 3600,
    enableCache: true,
    collection: 'xmem_collection',
  },
];

const MemorySettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  settings: MemorySettings;
  onChange: (settings: MemorySettings) => void;
  onSave: () => void;
}> = ({ open, onClose, settings, onChange, onSave }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-start gap-6 mb-6">
        <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
          <Database size={20} className="text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-medium text-slate-800 mb-1">Edit Memory Source</h2>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2 text-sm text-slate-800 font-medium"
            value={settings.name}
            onChange={e => onChange({ ...settings, name: e.target.value })}
            placeholder="Source Name"
          />
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2 text-sm text-slate-800 font-medium"
            value={settings.collection || ''}
            onChange={e => onChange({ ...settings, collection: e.target.value })}
            placeholder="Collection Name (for Qdrant, etc)"
          />
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
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="embeddingModel">
              Embedding Model
            </label>
            <select
              id="embeddingModel"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={settings.embeddingModel}
              onChange={e => onChange({ ...settings, embeddingModel: e.target.value })}
            >
              <option value="text-embedding-3-small">text-embedding-3-small</option>
              <option value="text-embedding-3-large">text-embedding-3-large</option>
              <option value="text-embedding-ada-002">text-embedding-ada-002 (Legacy)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
            onClick={onSave}
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
  const [memorySources, setMemorySources] = useState<MemorySource[]>(defaultSources);

  // Filter memory sources based on active tab
  const filteredSources = activeTab === 'all'
    ? memorySources
    : memorySources.filter(source => source.type === activeTab);

  // Handle edit
  const handleEdit = (source: MemorySource) => {
    setEditingSource(source);
    setMemorySettings({
      name: source.name,
      vectorDbUrl: source.vectorDbUrl,
      apiKey: source.apiKey,
      embeddingModel: source.embeddingModel,
      maxCacheSize: source.maxCacheSize,
      sessionTtl: source.sessionTtl,
      enableCache: source.enableCache,
      collection: source.collection || '',
    });
    setEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (source: MemorySource) => {
    setMemorySources(sources => sources.filter(s => s.id !== source.id));
  };

  // Handle save
  const handleSave = () => {
    if (editingSource) {
      setMemorySources(sources => sources.map(s =>
        s.id === editingSource.id
          ? { ...s, ...memorySettings, name: memorySettings.name, collection: memorySettings.collection }
          : s
      ));
    }
    setEditModalOpen(false);
  };

  // Handle status change from child
  const handleStatusChange = (id: string, status: string) => {
    setMemorySources(sources => sources.map(s =>
      s.id === id ? { ...s, status } : s
    ));
  };

  return (
    <div className="space-y-6">
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

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search memory sources..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
      {/* Memory sources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map((source) => (
          <MemorySourceCard
            key={source.id}
            source={source}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      {/* Memory items */}
      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-lg text-slate-800">Recent Memory Items</h2>
        </div>
        <MemoryItemList />
      </div>
      {/* Edit modal */}
      <MemorySettingsModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        settings={memorySettings}
        onChange={setMemorySettings}
        onSave={handleSave}
      />
    </div>
  );
};

export default MemoryManager;