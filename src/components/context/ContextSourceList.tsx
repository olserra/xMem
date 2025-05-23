import React, { useEffect, useState } from 'react';
import { Database } from 'lucide-react';

interface ContextSourceListProps {
  selectedSource: string;
  onSourceSelect: (sourceId: string) => void;
  projectId: string;
  searchTerm?: string;
}

const ContextSourceList: React.FC<ContextSourceListProps> = ({
  selectedSource,
  onSourceSelect,
  projectId,
  searchTerm = ''
}) => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/vector-sources?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => setSources(data))
      .catch(() => setError('Failed to load sources'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center text-slate-400">Loading sources...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!filteredSources.length) return <div className="p-4 text-center text-slate-400">No sources for this project.</div>;

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
      <ul className="py-2">
        {filteredSources.map((source) => (
          <li key={source.id}>
            <button
              onClick={() => onSourceSelect(source.id)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm ${selectedSource === source.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center bg-slate-100 ${selectedSource === source.id ? 'bg-indigo-100' : ''
                  }`}>
                  <Database size={16} className="text-indigo-600" />
                </div>
                <span>{source.name}</span>
              </div>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs text-slate-600">
                {source.itemCount ?? 0}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextSourceList;