import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, RefreshCw } from 'lucide-react';

interface MemorySource {
  id: string;
  name: string;
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
  collection?: string;
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

  // Fetch collection info for different DB types
  async function fetchCollectionInfo() {
    if (!source.vectorDbUrl) return;
    if (source.type === 'qdrant' || source.name.toLowerCase().includes('qdrant') || (source.vectorDbUrl && source.vectorDbUrl.toLowerCase().includes('qdrant'))) {
      // Qdrant: GET /collections or /collections/{collection}
      try {
        const baseUrl = source.vectorDbUrl.replace(/\/$/, '');
        let url = `${baseUrl}/collections`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (source.apiKey) headers['api-key'] = source.apiKey;
        // Always use the collection property if present, fallback to 'xmem_collection'
        const collection = source.collection || 'xmem_collection';
        if (collection) {
          url = `${baseUrl}/collections/${collection}`;
        }
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('Failed to fetch Qdrant collection info');
        const data = await res.json();
        // If fetching a specific collection
        if (data.result && typeof data.result.vectors_count === 'number') {
          setItemCount(data.result.vectors_count);
          setLastSync(data.result.status || 'N/A');
        } else if (Array.isArray(data.result)) {
          // If fetching all collections, sum up vectors_count
          const total = data.result.reduce((acc: number, c: { vectors_count?: number }) => acc + (c.vectors_count || 0), 0);
          setItemCount(total);
          setLastSync('N/A');
        } else {
          setItemCount(null);
          setLastSync(null);
        }
      } catch {
        setItemCount(null);
        setLastSync(null);
      }
    } else if (source.type === 'chromadb' || source.name.toLowerCase().includes('chroma')) {
      // ChromaDB: GET /api/v1/collections
      try {
        const baseUrl = source.vectorDbUrl.replace(/\/$/, '');
        const url = `${baseUrl}/api/v1/collections`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (source.apiKey) headers['Authorization'] = `Bearer ${source.apiKey}`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('Failed to fetch ChromaDB collections');
        const data = await res.json();
        // ChromaDB returns a list of collections
        if (Array.isArray(data) && data.length > 0) {
          // Sum up document counts if available
          const total = data.reduce((acc: number, c: { size?: number }) => acc + (c.size || 0), 0);
          setItemCount(total);
          setLastSync('N/A');
        } else {
          setItemCount(null);
          setLastSync(null);
        }
      } catch {
        setItemCount(null);
        setLastSync(null);
      }
    } else {
      // Other DBs: fallback
      setItemCount(null);
      setLastSync(null);
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
      const isQdrant = source.type === 'qdrant' || source.name.toLowerCase().includes('qdrant') || (source.vectorDbUrl && source.vectorDbUrl.toLowerCase().includes('qdrant'));
      const payload = {
        checkConnection: true,
        url: source.vectorDbUrl,
        apiKey: source.apiKey,
        type: isQdrant ? 'qdrant' : source.type,
        collection: source.name === 'Project Qdrant Instance' ? 'xmem_collection' : undefined // or use a field if you have it
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Card header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
            {source.icon}
          </div>
          <div>
            <h3 className="font-medium text-slate-800">{source.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{source.type}</p>
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
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <span className="text-sm text-slate-500">Status</span>
          <span className={`text-sm font-medium inline-flex items-center ${source.status === 'connected' || source.status === 'active'
            ? 'text-emerald-600'
            : 'text-amber-600'
            }`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${source.status === 'connected' || source.status === 'active'
              ? 'bg-emerald-600'
              : 'bg-amber-600'
              }`}></span>
            {source.status}
          </span>
        </div>

        {/* Items and Last Synced */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Items:</span>
            <span className="text-slate-500 font-normal">{itemCount !== null ? itemCount : 'N/A'}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Last Synced:</span>
            <span className="text-slate-400 font-normal">{lastSync !== null ? lastSync : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button
          className="w-full text-sm flex items-center justify-center gap-2 py-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
        {syncError && (
          <div className="mt-2 text-sm text-rose-600 text-center animate-pulse">{syncError}</div>
        )}
      </div>
    </div>
  );
};

export default MemorySourceCard;