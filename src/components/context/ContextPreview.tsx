import React from 'react';
import { Trash, Star, MoveUp, MoveDown, MoveHorizontal } from 'lucide-react';

interface ContextPreviewProps {
  method: string;
  maxSize: number;
  currentSize: number;
}

const ContextPreview: React.FC<ContextPreviewProps> = ({ method, maxSize, currentSize }) => {
  // Example context items for preview
  const contextItems = [
    {
      id: 'ctx-1',
      content: 'The memory orchestrator component ensures efficient retrieval and ranking of context for LLM inputs based on multiple factors including semantic similarity, recency, and user feedback.',
      source: 'Technical Documentation',
      score: 0.92,
      size: 510,
      selected: true,
    },
    {
      id: 'ctx-2',
      content: 'In yesterday\'s meeting, we decided to prioritize the context ranking algorithm to improve response quality over raw throughput. This should help with the issues reported by the QA team last week.',
      source: 'Meeting Notes',
      score: 0.87,
      size: 430,
      selected: true,
    },
    {
      id: 'ctx-3',
      content: 'User feedback shows that context relevance issues are most noticeable in complex multi-turn conversations where the topic shifts gradually. We need to improve tracking of conversation flow.',
      source: 'User Research',
      score: 0.81,
      size: 520,
      selected: true,
    },
    {
      id: 'ctx-4',
      content: 'The system should maintain a session-specific memory that decays over time, with importance weights adjusted based on explicit and implicit user feedback.',
      source: 'Requirements Doc',
      score: 0.79,
      size: 380,
      selected: true,
    },
    {
      id: 'ctx-5',
      content: 'Performance testing indicates that we can optimize vector similarity search by implementing approximate nearest neighbors with HNSW indexing.',
      source: 'Technical Documentation',
      score: 0.76,
      size: 410,
      selected: true,
    },
    {
      id: 'ctx-6',
      content: 'The API should provide endpoints for managing conversation context, including manual overrides for context selection when needed.',
      source: 'API Design',
      score: 0.68,
      size: 380,
      selected: false,
    },
    {
      id: 'ctx-7',
      content: 'Make sure all retrieval operations are properly logged for auditing and debugging.',
      source: 'Team Chat',
      score: 0.61,
      size: 210,
      selected: false,
    },
  ];
  
  // Calculate usage percentage
  const usagePercentage = (currentSize / maxSize) * 100;
  
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
            className={`h-full rounded-full ${
              usagePercentage < 70 ? 'bg-emerald-500' : 
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
            <li key={item.id} className={`p-4 hover:bg-slate-50 ${!item.selected ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-sm">
                  <div className={`h-5 w-5 rounded mr-2 flex items-center justify-center ${
                    item.selected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.selected && <Star size={12} />}
                  </div>
                  <span className="font-medium text-slate-700">{item.source}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.score > 0.9 ? 'bg-emerald-100 text-emerald-800' :
                    item.score > 0.8 ? 'bg-blue-100 text-blue-800' :
                    item.score > 0.7 ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {item.score.toFixed(2)}
                  </span>
                  
                  <span className="text-xs text-slate-500">{item.size} tokens</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 mb-3">{item.content}</p>
              
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
                
                <button className="p-1 text-slate-400 hover:text-rose-600" title="Remove from context">
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