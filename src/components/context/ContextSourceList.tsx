import React from 'react';
import { Database, MessageSquare, File, Clock, Calendar } from 'lucide-react';

interface ContextSourceListProps {
  selectedSource: string;
  onSourceSelect: (sourceId: string) => void;
}

const ContextSourceList: React.FC<ContextSourceListProps> = ({ 
  selectedSource, 
  onSourceSelect 
}) => {
  // Example context sources
  const sources = [
    { 
      id: 'all', 
      name: 'All Sources', 
      count: 124, 
      icon: <Database size={16} className="text-indigo-600" /> 
    },
    { 
      id: 'recent-conversations', 
      name: 'Recent Conversations', 
      count: 32, 
      icon: <MessageSquare size={16} className="text-teal-600" /> 
    },
    { 
      id: 'project-docs', 
      name: 'Project Documents', 
      count: 48, 
      icon: <File size={16} className="text-amber-600" /> 
    },
    { 
      id: 'meeting-notes', 
      name: 'Meeting Notes', 
      count: 15, 
      icon: <Calendar size={16} className="text-purple-600" /> 
    },
    { 
      id: 'recent-queries', 
      name: 'Recent Queries', 
      count: 29, 
      icon: <Clock size={16} className="text-rose-600" /> 
    },
  ];
  
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
      <ul className="py-2">
        {sources.map((source) => (
          <li key={source.id}>
            <button
              onClick={() => onSourceSelect(source.id)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                selectedSource === source.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center bg-slate-100 ${
                  selectedSource === source.id ? 'bg-indigo-100' : ''
                }`}>
                  {source.icon}
                </div>
                <span>{source.name}</span>
              </div>
              
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs text-slate-600">
                {source.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextSourceList;