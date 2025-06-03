'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sliders, Search, Shuffle, Clock, FileText, ArrowDownWideNarrow } from 'lucide-react';
import ContextPreview from '../components/context/ContextPreview';
import RankingControls from '../components/context/RankingControls';
import ContextSourceList from '../components/context/ContextSourceList';

// Simple Modal component (copied from MemoryManager)
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/60">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl cursor-pointer"
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

interface ContextManagerProps {
  projectId: string;
}

const defaultContextConfig = {
  maxSize: 4000,
  chunkStrategy: 'semantic',
  rankingFactors: {
    similarity: 0.7,
    recency: 0.2,
    feedback: 0.1,
  },
};

const ContextManager: React.FC<ContextManagerProps> = ({ projectId }) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [rankingMethod, setRankingMethod] = useState('smart');
  const [currentSize, setCurrentSize] = useState(0);
  const [contextConfig, setContextConfig] = useState(defaultContextConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [formConfig, setFormConfig] = useState(contextConfig);
  const [searchTerm, setSearchTerm] = useState('');
  const [collection, setCollection] = useState('xmem_collection');
  const [collections, setCollections] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Fetch available collections from Qdrant
    const fetchCollections = async () => {
      try {
        const qdrantUrl = process.env.NEXT_PUBLIC_QDRANT_URL;
        const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY;
        if (!qdrantUrl) return;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) headers['api-key'] = apiKey;
        const res = await fetch(`${qdrantUrl.replace(/\/$/, '')}/collections`, { headers });
        if (!res.ok) return;
        const data = await res.json();
        if (data.result && Array.isArray(data.result.collections)) {
          const names = data.result.collections.map((c: { name?: string; collection_name?: string; id?: string }) => c.name || c.collection_name || c.id || '');
          setCollections(names);
          if (names.length && !names.includes(collection)) {
            setCollection(names.includes('xmem_collection') ? 'xmem_collection' : names[0]);
          }
        }
      } catch { }
    };
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Available ranking methods
  const rankingMethods = [
    { id: 'smart', name: 'Smart Ranking', icon: <Shuffle size={16} /> },
    { id: 'similarity', name: 'Similarity', icon: <FileText size={16} /> },
    { id: 'recency', name: 'Recency', icon: <Clock size={16} /> },
    { id: 'manual', name: 'Manual Selection', icon: <ArrowDownWideNarrow size={16} /> },
  ];

  const handleOpenSettings = () => {
    setFormConfig(contextConfig);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    setContextConfig(formConfig);
    setShowSettings(false);
  };

  const handleContextItemsLoaded = useCallback(
    (items: Array<{ size?: number }>) => setCurrentSize(items.reduce((sum: number, item: { size?: number }) => sum + (item.size || 0), 0)),
    []
  );

  return (
    <div className="flex flex-col h-full">
      {/* Collection selector */}
      <div className="flex items-center gap-4 p-4">
        <label className="text-sm font-medium text-slate-700">Collection:</label>
        <select
          value={collection}
          onChange={e => setCollection(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-9"
        >
          {collections.length === 0 && <option value={collection}>{collection}</option>}
          {collections.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      {/* Context management interface */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar with context sources */}
        <div className="lg:w-80 flex-shrink-0 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-medium text-slate-800">Context Sources</h2>
            <div className="relative mt-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search sources..."
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                onClick={() => setSelectedSources(collections)}
                type="button"
              >Select All</button>
              <button
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                onClick={() => setSelectedSources([])}
                type="button"
              >Deselect All</button>
            </div>
          </div>
          <ContextSourceList
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
            projectId={projectId}
            searchTerm={searchTerm}
          />
        </div>
        {/* Main content area with context preview */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Context preview header */}
          <div className="p-4 flex flex-col gap-2 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-slate-800">Context Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={handleOpenSettings}
                >
                  <Sliders size={14} />
                  <span>Settings</span>
                </button>
                <select
                  value={rankingMethod}
                  onChange={(e) => setRankingMethod(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {rankingMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter your semantic search query..."
              className="mt-2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Context preview and controls */}
          <div className="flex flex-col md:flex-row h-[calc(100%-57px)]">
            <div className="flex-1 border-r border-slate-200 overflow-y-auto">
              <ContextPreview
                method={rankingMethod}
                maxSize={contextConfig.maxSize}
                currentSize={currentSize}
                projectId={projectId}
                sourceIds={selectedSources}
                collection={collection}
                query={query}
                onContextItemsLoaded={handleContextItemsLoaded}
              />
            </div>
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 overflow-y-auto p-4">
              <RankingControls
                method={rankingMethod}
                factors={contextConfig.rankingFactors}
                onFactorChange={(factor, value) => {
                  setContextConfig(cfg => ({
                    ...cfg,
                    rankingFactors: { ...cfg.rankingFactors, [factor]: value },
                  }));
                }}
                onApply={() => {
                  console.log('Apply Rankings clicked', contextConfig);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Settings Modal */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)}>
        <h2 className="text-lg font-medium text-slate-800 mb-4">Context Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Context Size (tokens)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formConfig.maxSize}
              min={100}
              max={32000}
              onChange={e => setFormConfig({ ...formConfig, maxSize: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chunk Strategy</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formConfig.chunkStrategy}
              onChange={e => setFormConfig({ ...formConfig, chunkStrategy: e.target.value })}
            >
              <option value="semantic">Semantic</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 cursor-pointer"
            onClick={() => setShowSettings(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleSaveSettings}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(ContextManager);