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
    if (
      source.type === 'qdrant' ||
      source.name.toLowerCase().includes('qdrant') ||
      (source.vectorDbUrl && source.vectorDbUrl.toLowerCase().includes('qdrant'))
    ) {
      // Qdrant: Try /collections/{collection} first, fallback to /collections
      try {
        const baseUrl = source.vectorDbUrl.replace(/\/$/, '');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (source.apiKey) headers['api-key'] = source.apiKey;
        const collection = source.collection || 'xmem_collection';
        let url = `${baseUrl}/collections/${collection}`;
        let res = await fetch(url, { headers });
        let text = await res.text();
        console.log('Qdrant fetchCollectionInfo (collection)', { url, headers, status: res.status, text });
        if (res.ok) {
          const data = JSON.parse(text);
          if (data.result && typeof data.result.vectors_count === 'number') {
            setItemCount(data.result.vectors_count);
            return;
          }
        } else {
          // If not found, fallback to all collections
          if (res.status === 404) {
            url = `${baseUrl}/collections`;
            res = await fetch(url, { headers });
            text = await res.text();
            console.log('Qdrant fetchCollectionInfo (all)', { url, headers, status: res.status, text });
            if (!res.ok) throw new Error('Failed to fetch Qdrant collections');
            const data = JSON.parse(text);
            if (Array.isArray(data.result)) {
              const total = data.result.reduce((acc: number, c: { vectors_count?: number }) => acc + (c.vectors_count || 0), 0);
              setItemCount(total);
              return;
            }
          } else {
            throw new Error(`Qdrant error: ${res.status} ${text}`);
          }
        }
        setItemCount(null);
      } catch (err) {
        console.error('Qdrant fetchCollectionInfo error', err);
        setItemCount(null);
      }
    } else if (
      source.type === 'chromadb' ||
      source.name.toLowerCase().includes('chroma')
    ) {
      // ChromaDB: GET /api/v1/collections
      try {
        const baseUrl = source.vectorDbUrl.replace(/\/$/, '');
        const url = `${baseUrl}/api/v1/collections`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (source.apiKey) headers['Authorization'] = `Bearer ${source.apiKey}`;
        console.log('ChromaDB fetchCollectionInfo', { url, headers });
        const res = await fetch(url, { headers });
        const text = await res.text();
        console.log('ChromaDB fetchCollectionInfo response', { status: res.status, text });
        if (!res.ok) throw new Error('Failed to fetch ChromaDB collections');
        const data = JSON.parse(text);
        // ChromaDB returns a list of collections
        if (Array.isArray(data) && data.length > 0) {
          // Sum up document counts if available
          const total = data.reduce((acc: number, c: { size?: number }) => acc + (c.size || 0), 0);
          setItemCount(total);
        } else {
          setItemCount(null);
        }
      } catch {
        setItemCount(null);
      }
    } else {
      // Other DBs: fallback
      setItemCount(null);
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
            <h3 className="font-medium text-slate-800 truncate max-w-[140px]" title={source.name}>{source.name}</h3>
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
        {syncError && (
          <div className="mt-2 text-sm text-rose-600 text-center animate-pulse">{syncError}</div>
        )}
      </div>
    </div>
  );
};

export default MemorySourceCard;