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
  const [collection, setCollection] = useState<string>('__all__');
  const [collections, setCollections] = useState<string[]>([]);
  const [memorySources, setMemorySources] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all memory sources to build the collection dropdown
    const fetchSources = async () => {
      try {
        const res = await fetch('/api/vector-sources');
        if (res.ok) {
          const data = await res.json();
          setMemorySources(data);
          const uniqueCollections = Array.from(new Set(data.map((s: any) => s.collection).filter(Boolean)));
          setCollections(uniqueCollections);
        }
      } catch { }
    };
    fetchSources();
  }, []);

  useEffect(() => {
    // Fetch metrics for the selected collection or all
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        if (collection === '__all__') {
          // Aggregate metrics for all collections
          let totalPoints = 0;
          let totalIndexed = 0;
          let totalSegments = 0;
          let optimizerStatus = '';
          for (const source of memorySources) {
            if (!source.collection) continue;
            const res = await fetch('/api/vector-collection-info', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                vectorDbUrl: source.vectorDbUrl,
                apiKey: source.apiKey,
                type: source.type,
                collection: source.collection,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              totalPoints += data.points_count || 0;
              totalIndexed += data.indexed_vectors_count || 0;
              totalSegments += data.segments_count || 0;
              if (data.optimizer_status) optimizerStatus = data.optimizer_status;
            }
          }
          setVectorDbMetrics({
            points_count: totalPoints,
            indexed_vectors_count: totalIndexed,
            segments_count: totalSegments,
            optimizer_status: optimizerStatus,
          });
        } else {
          // Single collection
          const source = memorySources.find(s => s.collection === collection);
          if (!source) {
            setVectorDbMetrics(null);
            setLoadingMetrics(false);
            return;
          }
          const res = await fetch('/api/vector-collection-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vectorDbUrl: source.vectorDbUrl,
              apiKey: source.apiKey,
              type: source.type,
              collection: source.collection,
            }),
          });
          if (res.ok) {
            setVectorDbMetrics(await res.json());
          } else {
            setVectorDbMetrics(null);
          }
        }
      } catch {
        setVectorDbMetrics(null);
      }
      setLoadingMetrics(false);
    };
    if (memorySources.length > 0) fetchMetrics();
  }, [collection, memorySources]);

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
          <option value="__all__">All Collections</option>
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
          <MemoryUsageChart collection={collection === '__all__' ? undefined : collection} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Context Relevance Scores</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <ContextRelevanceChart
            collection={collection === '__all__' ? undefined : collection}
            vectorDbUrl={collection === '__all__' ? undefined : (memorySources.find(s => s.collection === collection)?.vectorDbUrl)}
            apiKey={collection === '__all__' ? undefined : (memorySources.find(s => s.collection === collection)?.apiKey)}
            type={collection === '__all__' ? undefined : (memorySources.find(s => s.collection === collection)?.type)}
          />
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
        <RecentQueriesTable collection={collection === '__all__' ? undefined : collection} />
      </div>
    </div>
  );
};

export default Dashboard;