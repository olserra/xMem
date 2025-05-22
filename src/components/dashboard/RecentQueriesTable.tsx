import React, { useEffect, useState } from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Query {
  id: string | number;
  text: string;
  number?: number;
  flag?: boolean;
  // Add more fields as needed
}

const RecentQueriesTable: React.FC = () => {
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/qdrant-queries');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRecentQueries(data.queries || []);
      } catch (e: any) {
        setError(e.message || 'Error fetching queries');
      }
      setLoading(false);
    };
    fetchQueries();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Query
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Number
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Flag
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
                  {typeof query.number === 'number' ? query.number : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {query.flag === true && <ThumbsUp size={16} className="text-emerald-500" />}
                  {query.flag === false && <ThumbsDown size={16} className="text-rose-500" />}
                  {typeof query.flag !== 'boolean' && <span className="text-slate-400">—</span>}
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
  );
};

export default RecentQueriesTable;