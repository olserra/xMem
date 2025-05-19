'use client';
import React, { useState } from 'react';
import { Search, Filter, Database, History } from 'lucide-react';
import MemorySourceCard from '../components/memory/MemorySourceCard';
import MemoryItemList from '../components/memory/MemoryItemList';

const MemoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vectorDb');

  // Example memory sources
  const memorySources = [
    {
      id: 'source-1',
      name: 'Project Documentation',
      type: 'vectorDb',
      status: 'connected',
      itemCount: 1243,
      lastSync: '2 hours ago',
      icon: <Database size={24} className="text-indigo-600" />,
    },
    {
      id: 'source-2',
      name: 'Session Memory',
      type: 'session',
      status: 'active',
      itemCount: 87,
      lastSync: 'Live',
      icon: <History size={24} className="text-teal-600" />,
    },
    {
      id: 'source-3',
      name: 'Project Qdrant Instance',
      type: 'vectorDb',
      status: 'connected',
      itemCount: 8452,
      lastSync: '1 day ago',
      icon: <Database size={24} className="text-purple-600" />,
    },
  ];

  // Filter memory sources based on active tab
  const filteredSources = activeTab === 'all'
    ? memorySources
    : memorySources.filter(source => source.type === activeTab);

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
          <MemorySourceCard key={source.id} source={source} />
        ))}
      </div>
      {/* Memory items */}
      <div className="bg-white rounded-lg shadow-sm mt-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-lg text-slate-800">Recent Memory Items</h2>
        </div>
        <MemoryItemList />
      </div>
    </div>
  );
};

export default MemoryManager;