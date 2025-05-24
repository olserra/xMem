'use client';
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Database, Cpu, Clock, Users } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import MemoryUsageChart from '../components/dashboard/MemoryUsageChart';
import ContextRelevanceChart from '../components/dashboard/ContextRelevanceChart';
import RecentQueriesTable from '../components/dashboard/RecentQueriesTable';

// Remove the import for MetricCardProps and define the type locally
// interface MetricCardProps is not exported from MetricCard, so define it here
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [vectorDbMetrics, setVectorDbMetrics] = useState<{
    points_count?: number;
    indexed_vectors_count?: number;
    segments_count?: number;
    optimizer_status?: string;
  } | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [collection, setCollection] = useState('xmem_collection');
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    // Fetch Qdrant metrics from internal API route to avoid CORS
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const res = await fetch('/api/qdrant-metrics');
        if (res.ok) {
          const data = await res.json();
          setVectorDbMetrics(data);
        } else {
          setVectorDbMetrics(null);
        }
      } catch {
        setVectorDbMetrics(null);
      }
      setLoadingMetrics(false);
    };
    fetchMetrics();
  }, []);

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
          type Collection = { name?: string; collection_name?: string; id?: string };
          const names = data.result.collections.map((c: Collection) => c.name || c.collection_name || c.id || c);
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

  const metrics: MetricCardProps[] = [
    {
      title: 'Total Vectors',
      value: loadingMetrics ? '...' : (vectorDbMetrics?.points_count?.toLocaleString() ?? 'N/A'),
      change: '',
      trend: 'neutral',
      icon: <Database size={20} className="text-indigo-600" />
    },
    {
      title: 'Indexed Vectors',
      value: loadingMetrics ? '...' : (vectorDbMetrics?.indexed_vectors_count?.toLocaleString() ?? 'N/A'),
      change: '',
      trend: 'neutral',
      icon: <Cpu size={20} className="text-teal-600" />
    },
    {
      title: 'Segments',
      value: loadingMetrics ? '...' : (vectorDbMetrics?.segments_count?.toLocaleString() ?? 'N/A'),
      change: '',
      trend: 'neutral',
      icon: <Clock size={20} className="text-amber-600" />
    },
    {
      title: 'Optimizer',
      value: loadingMetrics ? '...' : (vectorDbMetrics?.optimizer_status ?? 'N/A'),
      change: '',
      trend: 'neutral',
      icon: <Users size={20} className="text-purple-600" />
    },
  ];

  return (
    <div className="space-y-6">
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
      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Memory Usage Distribution</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <MemoryUsageChart />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Context Relevance Scores</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <ContextRelevanceChart collection={collection} />
        </div>
      </div>
      {/* Recent queries table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-800">Recent Queries</h2>
          <button className="text-sm text-indigo-600 flex items-center gap-1">
            See All <ArrowUpRight size={14} />
          </button>
        </div>
        <RecentQueriesTable collection={collection} />
      </div>
    </div>
  );
};

export default Dashboard;