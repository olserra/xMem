import React, { useEffect, useState } from 'react';
import { Trash, Star, MoveUp, MoveDown, MoveHorizontal } from 'lucide-react';

interface ContextPreviewProps {
  method: string;
  maxSize: number;
  currentSize: number;
  projectId: string;
  sourceId: string;
  onContextItemsLoaded?: (items: any[]) => void;
}

const ContextPreview: React.FC<ContextPreviewProps> = ({ method, maxSize, currentSize, projectId, sourceId, onContextItemsLoaded }) => {
  const [contextItems, setContextItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // TODO: Update API to support filtering by projectId/sourceId if needed
    fetch(`/api/qdrant-queries`)
      .then(res => res.json())
      .then(data => {
        setContextItems(data.queries || []);
        if (onContextItemsLoaded) onContextItemsLoaded(data.queries || []);
      })
      .catch(() => setError('Failed to load context items'))
      .finally(() => setLoading(false));
  }, [projectId, sourceId]);

  // Calculate usage percentage
  const usagePercentage = (currentSize / maxSize) * 100;

  if (loading) return <div className="p-4 text-center text-slate-400">Loading context...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!contextItems.length) return <div className="p-4 text-center text-slate-400">No context items found.</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Context usage meter */}
      <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Context Usage</span>
          <span className="text-sm text-slate-500">{currentSize} / {maxSize} tokens</span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${usagePercentage < 70 ? 'bg-emerald-500' :
              usagePercentage < 90 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Context items */}
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-slate-200">
          {contextItems.map((item) => (
            <li key={item.id} className={`p-4 hover:bg-slate-50`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-sm">
                  <div className={`h-5 w-5 rounded mr-2 flex items-center justify-center bg-indigo-100 text-indigo-700`}>
                    <Star size={12} />
                  </div>
                  <span className="font-medium text-slate-700">{item.source || item.collection || 'Unknown Source'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                    {item.score ? item.score.toFixed(2) : 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500">{item.size || 0} tokens</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-3">{item.content || item.text || JSON.stringify(item)}</p>

              <div className="flex justify-end space-x-2">
                {method === 'manual' && (
                  <>
                    <button className="p-1 text-slate-400 hover:text-slate-700" title="Move up">
                      <MoveUp size={14} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-700" title="Move down">
                      <MoveDown size={14} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-700" title="Adjust importance">
                      <MoveHorizontal size={14} />
                    </button>
                  </>
                )}

                <button className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Remove from context">
                  <Trash size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContextPreview;