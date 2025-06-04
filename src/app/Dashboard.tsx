'use client';
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Database, Cpu, Clock, Users } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import MemoryUsageChart from '../components/dashboard/MemoryUsageChart';
import ContextRelevanceChart from '../components/dashboard/ContextRelevanceChart';
import RecentQueriesTable from '../components/dashboard/RecentQueriesTable';
import { useTagContext } from '../components/tags/TagContext';

// Remove the import for MetricCardProps and define the type locally
// interface MetricCardProps is not exported from MetricCard, so define it here
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface MemorySource {
  id: string;
  collection: string;
  vectorDbUrl: string;
  apiKey: string;
  type: string;
  [key: string]: unknown;
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
  const [memorySources, setMemorySources] = useState<MemorySource[]>([]);
  const { setBulkTags } = useTagContext();

  useEffect(() => {
    // Fetch all memory sources to build the collection dropdown
    const fetchSources = async () => {
      try {
        const res = await fetch('/api/vector-sources');
        if (res.ok) {
          const data: MemorySource[] = await res.json();
          setMemorySources(data);
          const uniqueCollections = Array.from(new Set(data.map((s) => s.collection).filter(Boolean)));
          setCollections(uniqueCollections);
        }
      } catch { }
    };
    fetchSources();
  }, []);

  // Set projectId in localStorage if not already set
  if (typeof window !== 'undefined' && window.localStorage) {
    let projectId = window.localStorage.getItem('projectId');
    if (!projectId && memorySources.length > 0) {
      // Try to get from the first memory source
      const firstProjectId = memorySources[0]?.projectId;
      if (firstProjectId) {
        window.localStorage.setItem('projectId', firstProjectId);
      }
    }
  }

  // Fetch all queries and their tags once on dashboard load
  useEffect(() => {
    if (memorySources.length === 0) return;
    const fetchTagsForAllQueries = async () => {
      try {
        const res = await fetch('/api/qdrant-queries');
        if (!res.ok) return;
        const data = await res.json();
        const queries = data.queries || [];
        const limitedQueries = queries.slice(0, 5);
        const tagsMap: Record<string, string[]> = {};
        for (const query of limitedQueries) {
          const text = query.text || '';
          if (!text.trim()) continue;
          const tagRes = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });
          if (tagRes.ok) {
            const tagData = await tagRes.json();
            tagsMap[query.id] = tagData.tags || [];
          } else {
            // Log warning but do not retry or loop
            if (tagRes.status === 502) {
              console.warn('Tags service unavailable or not implemented. Skipping tags for query:', query.id);
            } else {
              console.warn('Failed to fetch tags for query:', query.id, 'Status:', tagRes.status);
            }
          }
        }
        setBulkTags(tagsMap);
      } catch { }
    };
    fetchTagsForAllQueries();
  }, [setBulkTags, memorySources]);

  useEffect(() => {
    if (memorySources.length === 0) return;
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
          const source = memorySources.find((s) => s.collection === collection);
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
    fetchMetrics();
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
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {memorySources.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full text-center text-slate-400">
          No memory sources connected. Please{' '}
          <a
            href="/dashboard/memory"
            className="text-indigo-600 underline hover:text-indigo-800 transition-colors"
          >
            add a source
          </a>{' '}to view dashboard data.
        </div>
      )}
      {/* Collection selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full max-w-full">
        <label className="text-sm font-medium text-slate-700">Collection:</label>
        <select
          value={collection}
          onChange={e => setCollection(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-9 w-full max-w-xs"
        >
          <option value="__all__">All Collections</option>
          {collections.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-full">
        {metrics.map((metric, index) => (
          <div className="w-full" key={index}>
            <MetricCard {...metric} />
          </div>
        ))}
      </div>
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-x-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Memory Usage Distribution</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <MemoryUsageChart collection={collection === '__all__' ? undefined : collection} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full">
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
      <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
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