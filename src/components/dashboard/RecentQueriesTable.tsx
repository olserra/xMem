import React, { useEffect, useState } from 'react';
// import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ExternalLink } from 'lucide-react';

interface Query {
  id: string | number;
  text: string;
  score?: number;
  size?: number;
  // Add more fields as needed
}

interface RecentQueriesTableProps {
  collection?: string;
}

const RecentQueriesTable: React.FC<RecentQueriesTableProps> = ({ collection = 'xmem_collection' }) => {
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/qdrant-queries?collection=${encodeURIComponent(collection)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRecentQueries(data.queries || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error fetching queries');
      }
      setLoading(false);
    };
    fetchQueries();
  }, [collection]);

  return (
    <div className="w-full">
      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Query
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-slate-400">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-rose-500">{error}</td>
              </tr>
            ) : recentQueries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-slate-400">No recent queries found.</td>
              </tr>
            ) : (
              recentQueries.map((query) => (
                <tr key={query.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 max-w-xs truncate">
                    {query.text}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {typeof query.score === 'number' ? query.score : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {typeof query.size === 'number' ? query.size : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Card layout for mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {loading ? (
          <div className="text-center text-slate-400 py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-rose-500 py-4">{error}</div>
        ) : recentQueries.length === 0 ? (
          <div className="text-center text-slate-400 py-4">No recent queries found.</div>
        ) : (
          recentQueries.map((query) => (
            <div key={query.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-slate-200">
              <div className="font-semibold text-slate-800 text-sm mb-1">Query</div>
              <div className="text-slate-700 text-sm break-words mb-2">{query.text}</div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span><span className="font-medium text-slate-700">Score:</span> {typeof query.score === 'number' ? query.score : '—'}</span>
                <span><span className="font-medium text-slate-700">Size:</span> {typeof query.size === 'number' ? query.size : '—'}</span>
                <button className="text-indigo-600 hover:text-indigo-900 ml-2">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentQueriesTable;