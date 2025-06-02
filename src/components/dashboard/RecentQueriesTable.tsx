'use client';
import React, { useEffect, useState } from 'react';
// import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ExternalLink, X, Copy, Trash, ThumbsUp, ThumbsDown, RefreshCw, Info, Link } from 'lucide-react';
import { useTagContext } from '../tags/TagContext';

interface Query {
  id: string | number;
  text?: string;
  score?: number;
  size?: number;
  // Add more fields as needed
}

interface RecentQueriesTableProps {
  collection?: string;
  type?: string; // Add type prop to determine DB provider
}

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-teal-100 text-teal-800',
];

const RecentQueriesTable: React.FC<RecentQueriesTableProps> = ({ collection = 'xmem_collection', type }) => {
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTagsForId } = useTagContext();

  // Determine DB Provider
  const dbProvider = (type && type.toLowerCase() === 'pinecone') ? 'Pinecone' : 'Qdrant';
  const collectionName = collection || 'Unknown';

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reRunMsg, setReRunMsg] = useState('');

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

  // CTA handlers
  const handleCopy = () => {
    if (selectedQuery?.text) {
      navigator.clipboard.writeText(selectedQuery.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setDeleted(false);
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          data: { id: selectedQuery?.id, collection: collectionName },
        }),
      });
      if (res.ok) {
        setDeleted(true);
        setTimeout(() => {
          setDeleted(false);
          setModalOpen(false);
        }, 1200);
      } else {
        setDeleted(false);
        alert('Failed to delete query.');
      }
    } catch {
      setDeleted(false);
      alert('Failed to delete query.');
    }
    setActionLoading(false);
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (feedback === type) return; // Already selected
    setFeedback(type);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryId: selectedQuery?.id,
          rating: type === 'up' ? 5 : 1,
        }),
      });
    } catch { }
    // No timeout: keep the highlight persistently
  };

  const handleReRun = async () => {
    setActionLoading(true);
    setReRunMsg('');
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: selectedQuery?.text }),
      });
      if (res.ok) {
        setReRunMsg('Query re-run!');
      } else {
        setReRunMsg('Failed to re-run query.');
      }
    } catch {
      setReRunMsg('Failed to re-run query.');
    }
    setTimeout(() => {
      setReRunMsg('');
      setActionLoading(false);
    }, 1200);
  };

  const handleOpenSource = () => {
    if (selectedQuery && selectedQuery.url) {
      window.open(selectedQuery.url, '_blank');
    }
  };

  // Modal component (copied from ContextManager/MemoryManager)
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
            <X size={22} />
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Query Details Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedQuery && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Query Details</h2>
            {/* CTA Button Group (TODO: backend integration for delete, feedback, re-run) */}
            <div className="flex flex-row flex-wrap gap-2 mb-6 items-center justify-start">
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm cursor-pointer"
                onClick={handleCopy}
                disabled={copied}
                title="Copy Query Text"
              >
                <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm cursor-pointer"
                onClick={handleDelete}
                disabled={actionLoading || deleted}
                title="Delete Query"
              >
                <Trash size={16} /> {deleted ? 'Deleted!' : 'Delete'}
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm cursor-pointer ${feedback === 'up' ? 'ring-2 ring-emerald-400' : ''}`}
                onClick={() => handleFeedback('up')}
                title="Thumbs Up"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm cursor-pointer ${feedback === 'down' ? 'ring-2 ring-rose-400' : ''}`}
                onClick={() => handleFeedback('down')}
                title="Thumbs Down"
              >
                <ThumbsDown size={16} />
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm cursor-pointer"
                onClick={handleReRun}
                disabled={actionLoading}
                title="Re-run Query"
              >
                <RefreshCw size={16} /> Re-run
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm cursor-pointer"
                onClick={handleOpenSource}
                title="Open in Source"
              >
                <Link size={16} /> Open Source
              </button>
            </div>
            {reRunMsg && <div className="mb-2 text-emerald-600 text-sm">{reRunMsg}</div>}
            <div className="mb-2"><span className="font-medium text-slate-700">Text:</span> {selectedQuery.text}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">Score:</span> {typeof selectedQuery.score === 'number' ? selectedQuery.score : '—'}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">Size:</span> {typeof selectedQuery.size === 'number' ? selectedQuery.size : '—'}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">Source:</span> {selectedQuery.source || selectedQuery.collection || 'Unknown'}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">DB Provider:</span> {dbProvider}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">Collection:</span> {collectionName}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">ID:</span> {selectedQuery.id}</div>
            <div className="mb-2"><span className="font-medium text-slate-700">Tags:</span> {getTagsForId(selectedQuery.id.toString()).join(', ') || '—'}</div>
            <div className="mt-4 bg-slate-50 rounded p-3 text-xs text-slate-700">
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(selectedQuery, null, 2)}</pre>
            </div>
          </div>
        )}
      </Modal>
      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Query
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                DB Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Collection
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-slate-400">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-rose-500">{error}</td>
              </tr>
            ) : recentQueries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-slate-400">No recent queries found.</td>
              </tr>
            ) : (
              recentQueries.slice(0, 5).map((query) => {
                const tags = getTagsForId(query.id.toString());
                const source = query.source || query.collection || 'Unknown';
                return (
                  <tr key={query.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 max-w-xs truncate">
                      {query.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, i) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColors[i % tagColors.length]}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {typeof query.score === 'number' ? query.score : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {typeof query.size === 'number' ? query.size : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {dbProvider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {collectionName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        onClick={() => { setSelectedQuery(query); setModalOpen(true); }}
                        title="View Details"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
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
          recentQueries.slice(0, 5).map((query) => {
            const tags = getTagsForId(query.id.toString());
            const source = query.source || query.collection || 'Unknown';
            return (
              <div key={query.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-slate-200">
                <div className="font-semibold text-slate-800 text-sm mb-1">Query</div>
                <div className="text-slate-700 text-sm break-words mb-2">{query.text}</div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColors[i % tagColors.length]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                  <span><span className="font-medium text-slate-700">Score:</span> {typeof query.score === 'number' ? query.score : '—'}</span>
                  <span><span className="font-medium text-slate-700">Size:</span> {typeof query.size === 'number' ? query.size : '—'}</span>
                  <span><span className="font-medium text-slate-700">Source:</span> {source}</span>
                  <span><span className="font-medium text-slate-700">DB Provider:</span> {dbProvider}</span>
                  <span><span className="font-medium text-slate-700">Collection:</span> {collectionName}</span>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 ml-2 cursor-pointer"
                    onClick={() => { setSelectedQuery(query); setModalOpen(true); }}
                    title="View Details"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentQueriesTable;