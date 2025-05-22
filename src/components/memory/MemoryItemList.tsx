import React, { useEffect, useState } from 'react';
import { ChevronRight, File, MessageSquare, Clock } from 'lucide-react';

const getIcon = (type: string | undefined) => {
  if (!type) return <File size={16} className="text-slate-400" />;
  if (type === 'conversation' || type === 'chat' || type === 'message') return <MessageSquare size={16} className="text-teal-600" />;
  return <File size={16} className="text-indigo-600" />;
};

const MemoryItemList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/qdrant-queries');
        if (!res.ok) throw new Error('Failed to fetch memory items');
        const data = await res.json();
        setItems(data.queries || []);
      } catch (e: any) {
        setError(e.message || 'Error fetching memory items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="px-6 py-4 text-slate-400">Loading...</div>;
  if (error) return <div className="px-6 py-4 text-rose-500">{error}</div>;
  if (!items.length) return <div className="px-6 py-4 text-slate-400">No memory items found.</div>;

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-slate-200">
        {items.map((item) => {
          // Try to extract fields from payload
          const title = item.title || item.text || item.content || 'Untitled';
          const type = item.type || item.kind || undefined;
          const source = item.source || item.sessionId || item.session_id || 'Unknown';
          const createdAt = item.createdAt || item.created_at || item.timestamp || null;
          const size = item.size || (item.text ? `${item.text.length} chars` : null);
          const icon = getIcon(type);
          return (
            <li key={item.id} className="hover:bg-slate-50 transition-colors">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                      {icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-slate-900 truncate">{title}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-slate-500">{source}</span>
                      {type && <><span className="mx-2 text-slate-300">•</span><span className="text-xs text-slate-500">{type}</span></>}
                      {createdAt && <><span className="mx-2 text-slate-300">•</span><span className="text-xs text-slate-500 flex items-center"><Clock size={12} className="mr-1" />{createdAt}</span></>}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-4">
                  {size && <span className="text-sm text-slate-500">{size}</span>}
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MemoryItemList;