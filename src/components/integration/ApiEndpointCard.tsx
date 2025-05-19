import React from 'react';
import { Code } from 'lucide-react';

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
}

interface ApiEndpointCardProps {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
}

const ApiEndpointCard: React.FC<ApiEndpointCardProps> = ({ 
  endpoint, 
  isSelected,
  onSelect 
}) => {
  return (
    <div 
      className={`rounded-lg border transition-all cursor-pointer overflow-hidden ${
        isSelected 
          ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-sm' 
          : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center mb-3">
          <Code size={20} className="text-indigo-600" />
        </div>
        
        <h3 className="font-medium text-slate-800 mb-1">{endpoint.name}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{endpoint.description}</p>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            endpoint.method === 'GET' ? 'bg-emerald-100 text-emerald-800' :
            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
            endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-800' :
            'bg-rose-100 text-rose-800'
          }`}>
            {endpoint.method}
          </span>
          <code className="text-xs font-mono text-slate-700 truncate">{endpoint.path}</code>
        </div>
      </div>
      
      <div className={`h-1 ${isSelected ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
    </div>
  );
};

export default ApiEndpointCard;