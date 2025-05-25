import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, RefreshCw } from 'lucide-react';

interface MemorySource {
  id: string;
  type: string;
  status: string;
  itemCount: number;
  lastSync: string;
  icon: React.ReactNode;
  vectorDbUrl: string;
  apiKey: string;
  embeddingModel: string;
  maxCacheSize: number;
  sessionTtl: number;
  enableCache: boolean;
  collection: string;
}

interface MemorySourceCardProps {
  source: MemorySource;
  onEdit?: (source: MemorySource) => void;
  onDelete?: (source: MemorySource) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const MemorySourceCard: React.FC<MemorySourceCardProps> = ({ source, onEdit, onDelete, onStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [qdrantMetrics, setQdrantMetrics] = useState<{
    points_count?: number;
    indexed_vectors_count?: number;
    segments_count?: number;
    optimizer_status?: string;
  } | null>(null);

  // Fetch collection info for different DB types
  async function fetchCollectionInfo() {
    setSyncError(null);
    if (!source.vectorDbUrl) {
      setSyncError('No vector DB URL provided.');
      setItemCount(null);
      setQdrantMetrics(null);
      return;
    }
    try {
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
      const data = await res.json();
      if (!res.ok) {
        setSyncError(data.error || 'Failed to fetch collection info.');
        setItemCount(null);
        setQdrantMetrics(null);
        return;
      }
      // Qdrant metrics
      if (
        source.type === 'qdrant' ||
        (source.vectorDbUrl && source.vectorDbUrl.toLowerCase().includes('qdrant'))
      ) {
        setItemCount(
          typeof data.points_count === 'number'
            ? data.points_count
            : null
        );
        setQdrantMetrics({
          points_count: data.points_count,
          indexed_vectors_count: data.indexed_vectors_count,
          segments_count: data.segments_count,
          optimizer_status: data.optimizer_status,
        });
      } else {
        // ChromaDB or other
        setItemCount(
          typeof data.points_count === 'number' ? data.points_count : null
        );
        setQdrantMetrics(null);
      }
    } catch (err: unknown) {
      setSyncError(err instanceof Error ? err.message : 'Failed to fetch collection info.');
      setItemCount(null);
      setQdrantMetrics(null);
    }
  }

  useEffect(() => {
    fetchCollectionInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.vectorDbUrl, source.apiKey, source.type, source.collection]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const isQdrant = source.type === 'qdrant' || (source.vectorDbUrl && source.vectorDbUrl.toLowerCase().includes('qdrant'));
      const payload = {
        checkConnection: true,
        url: source.vectorDbUrl,
        apiKey: source.apiKey,
        type: isQdrant ? 'qdrant' : source.type,
        collection: source.collection === 'xmem_collection' ? 'xmem_collection' : undefined
      };
      const res = await fetch('/api/vector-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 'connected') {
        setSyncError(null);
        if (onStatusChange) onStatusChange(source.id, 'connected');
        setLastSync(new Date().toLocaleString());
        await fetchCollectionInfo();
      } else {
        setSyncError(data.error || 'Failed to connect to the database.');
        if (onStatusChange) onStatusChange(source.id, 'disconnected');
      }
    } catch (e: unknown) {
      setSyncError(e instanceof Error ? e.message : 'Failed to connect to the database.');
      if (onStatusChange) onStatusChange(source.id, 'disconnected');
    }
    setSyncing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col min-h-[320px]">
      {/* Card header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
            {source.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-slate-800 truncate max-w-[140px]" title={source.collection}>{source.collection}</h3>
            <p className="text-xs text-slate-500 capitalize truncate max-w-[140px]" title={source.type}>{source.type}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full focus:outline-none cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-20">
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 cursor-pointer"
                onClick={() => { setMenuOpen(false); if (onEdit) { onEdit(source); } }}
              >
                Edit
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-rose-50 text-sm text-rose-600 cursor-pointer"
                onClick={() => { setMenuOpen(false); if (onDelete) { onDelete(source); } }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          {syncError && (
            <div className="mb-2 text-xs text-rose-600 animate-pulse">{syncError}</div>
          )}
          <div className="flex justify-between mb-3 items-center">
            <span className="text-sm text-slate-500">Status</span>
            <span className={`text-sm font-medium inline-flex items-center ${source.status === 'connected' || source.status === 'active'
              ? 'text-emerald-600'
              : 'text-amber-600'
              }`} title={source.status}>
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${source.status === 'connected' || source.status === 'active'
                ? 'bg-emerald-600'
                : 'bg-amber-600'
                }`}></span>
              {source.status}
            </span>
          </div>
          {/* Items and Last Synced */}
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between text-xs text-slate-500 items-center">
              <span>Items (count):</span>
              <span className="text-slate-500 font-normal truncate max-w-[80px]">{itemCount !== null ? itemCount : 'N/A'}</span>
            </div>
            {qdrantMetrics && (
              <>
                {typeof qdrantMetrics.points_count === 'number' && (
                  <div className="flex justify-between text-xs text-slate-500 items-center">
                    <span>Points Count:</span>
                    <span className="text-slate-500 font-normal truncate max-w-[80px]">{qdrantMetrics.points_count}</span>
                  </div>
                )}
                {typeof qdrantMetrics.indexed_vectors_count === 'number' && (
                  <div className="flex justify-between text-xs text-slate-500 items-center">
                    <span>Indexed Vectors:</span>
                    <span className="text-slate-500 font-normal truncate max-w-[80px]">{qdrantMetrics.indexed_vectors_count}</span>
                  </div>
                )}
                {typeof qdrantMetrics.segments_count === 'number' && (
                  <div className="flex justify-between text-xs text-slate-500 items-center">
                    <span>Segments:</span>
                    <span className="text-slate-500 font-normal truncate max-w-[80px]">{qdrantMetrics.segments_count}</span>
                  </div>
                )}
                {qdrantMetrics.optimizer_status && (
                  <div className="flex justify-between text-xs text-slate-500 items-center">
                    <span>Optimizer:</span>
                    <span className="text-slate-500 font-normal truncate max-w-[80px]">{qdrantMetrics.optimizer_status}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between text-xs text-slate-500 items-center">
              <span>Last Synced:</span>
              <span className="text-slate-400 font-medium text-[13px] max-w-[160px] break-words">{lastSync !== null ? lastSync : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
        <button
          className="w-full text-sm flex items-center justify-center gap-2 py-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>
    </div>
  );
};

export default MemorySourceCard;