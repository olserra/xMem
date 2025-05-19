'use client';

import React, { useState } from 'react';
import { Sliders, Search, Shuffle, Clock, FileText, ArrowDownWideNarrow } from 'lucide-react';
import ContextPreview from '../components/context/ContextPreview';
import RankingControls from '../components/context/RankingControls';
import ContextSourceList from '../components/context/ContextSourceList';

const ContextManager: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [rankingMethod, setRankingMethod] = useState('smart');

  // Example context configuration
  const contextConfig = {
    maxSize: 4000,
    currentSize: 2840,
    chunkStrategy: 'semantic',
    rankingFactors: {
      similarity: 0.7,
      recency: 0.2,
      feedback: 0.1,
    },
  };

  // Available ranking methods
  const rankingMethods = [
    { id: 'smart', name: 'Smart Ranking', icon: <Shuffle size={16} /> },
    { id: 'similarity', name: 'Similarity', icon: <FileText size={16} /> },
    { id: 'recency', name: 'Recency', icon: <Clock size={16} /> },
    { id: 'manual', name: 'Manual Selection', icon: <ArrowDownWideNarrow size={16} /> },
  ];

  return (
    <div className="space-y-6">
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
              />
            </div>
          </div>
          <ContextSourceList
            selectedSource={selectedSource}
            onSourceSelect={setSelectedSource}
          />
        </div>
        {/* Main content area with context preview */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Context preview header */}
          <div className="p-4 flex justify-between items-center border-b border-slate-200">
            <h2 className="font-medium text-slate-800">Context Preview</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <Sliders size={14} />
                <span>Settings</span>
              </button>
              <select
                value={rankingMethod}
                onChange={(e) => setRankingMethod(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {rankingMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Context preview and controls */}
          <div className="flex flex-col md:flex-row h-[calc(100%-57px)]">
            <div className="flex-1 border-r border-slate-200 overflow-y-auto">
              <ContextPreview
                method={rankingMethod}
                maxSize={contextConfig.maxSize}
                currentSize={contextConfig.currentSize}
              />
            </div>
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 overflow-y-auto">
              <RankingControls
                method={rankingMethod}
                factors={contextConfig.rankingFactors}
                onFactorChange={(factor, value) => {
                  // In a real app, this would update the ranking factors
                  console.log(`Changed ${factor} to ${value}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextManager;