import React from 'react';
import { Shuffle, FileText, Clock, ThumbsUp, RefreshCw } from 'lucide-react';

interface RankingFactors {
  similarity: number;
  recency: number;
  feedback: number;
}

interface RankingControlsProps {
  method: string;
  factors: RankingFactors;
  onFactorChange: (factor: keyof RankingFactors, value: number) => void;
}

const RankingControls: React.FC<RankingControlsProps> = ({ 
  method, 
  factors,
  onFactorChange 
}) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-slate-800 mb-4">Ranking Configuration</h3>
      
      {/* Method description */}
      <div className="mb-6 p-3 bg-white rounded-md border border-slate-200">
        {method === 'smart' && (
          <div className="flex items-start gap-3">
            <Shuffle size={20} className="text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-800">Smart Ranking</h4>
              <p className="text-sm text-slate-600 mt-1">
                Combines multiple factors to intelligently rank context based on similarity, recency, and user feedback.
              </p>
            </div>
          </div>
        )}
        
        {method === 'similarity' && (
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-800">Similarity Ranking</h4>
              <p className="text-sm text-slate-600 mt-1">
                Ranks context purely by semantic similarity with the current query or conversation.
              </p>
            </div>
          </div>
        )}
        
        {method === 'recency' && (
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-800">Recency Ranking</h4>
              <p className="text-sm text-slate-600 mt-1">
                Prioritizes recently added or accessed context items over older ones.
              </p>
            </div>
          </div>
        )}
        
        {method === 'manual' && (
          <div className="flex items-start gap-3">
            <RefreshCw size={20} className="text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-800">Manual Selection</h4>
              <p className="text-sm text-slate-600 mt-1">
                Allows direct control over context selection and ordering for fine-grained control.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Ranking factors sliders (only shown for smart ranking) */}
      {method === 'smart' && (
        <div className="space-y-6">
          <h4 className="font-medium text-sm text-slate-700 mb-3">Ranking Factors</h4>
          
          {/* Similarity factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-600 flex items-center gap-2">
                <FileText size={14} className="text-indigo-500" />
                Similarity
              </label>
              <span className="text-sm font-medium text-slate-700">
                {Math.round(factors.similarity * 100)}%
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.similarity}
              onChange={(e) => onFactorChange('similarity', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <p className="text-xs text-slate-500 mt-1">
              Weight given to semantic similarity between context and query
            </p>
          </div>
          
          {/* Recency factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-600 flex items-center gap-2">
                <Clock size={14} className="text-indigo-500" />
                Recency
              </label>
              <span className="text-sm font-medium text-slate-700">
                {Math.round(factors.recency * 100)}%
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.recency}
              onChange={(e) => onFactorChange('recency', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <p className="text-xs text-slate-500 mt-1">
              Importance of how recently the context was added or referenced
            </p>
          </div>
          
          {/* Feedback factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-600 flex items-center gap-2">
                <ThumbsUp size={14} className="text-indigo-500" />
                Feedback
              </label>
              <span className="text-sm font-medium text-slate-700">
                {Math.round(factors.feedback * 100)}%
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.feedback}
              onChange={(e) => onFactorChange('feedback', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <p className="text-xs text-slate-500 mt-1">
              Impact of previous user feedback on context relevance
            </p>
          </div>
        </div>
      )}
      
      {/* Additional controls based on method */}
      {method === 'similarity' && (
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Similarity Threshold</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue="0.7"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Relaxed</span>
              <span>Strict</span>
            </div>
          </div>
        </div>
      )}
      
      {method === 'recency' && (
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Time Window</label>
            <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
              <option>Last 1 hour</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Apply button */}
      <div className="mt-8">
        <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Apply Rankings
        </button>
      </div>
    </div>
  );
};

export default RankingControls;