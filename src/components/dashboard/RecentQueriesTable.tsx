import React from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

const RecentQueriesTable: React.FC = () => {
  // Example data for recent queries
  const recentQueries = [
    {
      id: 'q-1',
      query: 'What are the latest updates to the project timeline?',
      timestamp: '2 minutes ago',
      relevanceScore: 0.92,
      contextSize: '3.8 KB',
      feedback: 'positive',
    },
    {
      id: 'q-2',
      query: 'Summarize the meeting notes from yesterday',
      timestamp: '28 minutes ago',
      relevanceScore: 0.87,
      contextSize: '5.2 KB',
      feedback: 'positive',
    },
    {
      id: 'q-3',
      query: 'What were the key points from the Q1 review?',
      timestamp: '1 hour ago',
      relevanceScore: 0.76,
      contextSize: '4.1 KB',
      feedback: 'negative',
    },
    {
      id: 'q-4',
      query: 'Who is responsible for the marketing deliverables?',
      timestamp: '3 hours ago',
      relevanceScore: 0.89,
      contextSize: '2.7 KB',
      feedback: 'positive',
    },
    {
      id: 'q-5',
      query: 'What was the budget allocated for infrastructure?',
      timestamp: '5 hours ago',
      relevanceScore: 0.81,
      contextSize: '3.4 KB',
      feedback: 'neutral',
    },
  ];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Query
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Relevance
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Size
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Feedback
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {recentQueries.map((query) => (
            <tr key={query.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 max-w-xs truncate">
                {query.query}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {query.timestamp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        query.relevanceScore > 0.9
                          ? 'bg-emerald-500'
                          : query.relevanceScore > 0.8
                          ? 'bg-blue-500'
                          : query.relevanceScore > 0.7
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${query.relevanceScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-slate-600">{query.relevanceScore.toFixed(2)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {query.contextSize}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {query.feedback === 'positive' && (
                  <ThumbsUp size={16} className="text-emerald-500" />
                )}
                {query.feedback === 'negative' && (
                  <ThumbsDown size={16} className="text-rose-500" />
                )}
                {query.feedback === 'neutral' && (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <ExternalLink size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentQueriesTable;