import React from 'react';
import { MoreVertical, RefreshCw } from 'lucide-react';

interface MemorySource {
  id: string;
  name: string;
  type: string;
  status: string;
  itemCount: number;
  lastSync: string;
  icon: React.ReactNode;
}

interface MemorySourceCardProps {
  source: MemorySource;
}

const MemorySourceCard: React.FC<MemorySourceCardProps> = ({ source }) => {
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
        
        <button className="text-slate-400 hover:text-slate-700">
          <MoreVertical size={18} />
        </button>
      </div>
      
      {/* Card body */}
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <span className="text-sm text-slate-500">Status</span>
          <span className={`text-sm font-medium inline-flex items-center ${
            source.status === 'connected' || source.status === 'active'
              ? 'text-emerald-600'
              : 'text-amber-600'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              source.status === 'connected' || source.status === 'active'
                ? 'bg-emerald-600'
                : 'bg-amber-600'
            }`}></span>
            {source.status}
          </span>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-sm text-slate-500">Items</span>
          <span className="text-sm font-medium text-slate-800">{source.itemCount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Last Synced</span>
          <span className="text-sm font-medium text-slate-800">{source.lastSync}</span>
        </div>
      </div>
      
      {/* Card actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button className="w-full text-sm flex items-center justify-center gap-2 py-2 text-indigo-600 hover:text-indigo-800 transition-colors">
          <RefreshCw size={14} />
          <span>Sync Now</span>
        </button>
      </div>
    </div>
  );
};

export default MemorySourceCard;