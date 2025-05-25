import React from 'react';

interface MemoryUsageChartProps {
  collection?: string;
}

const MemoryUsageChart: React.FC<MemoryUsageChartProps> = (/* { collection } */) => {
  // This is a placeholder for an actual chart component
  // In a real implementation, you would use a chart library like Chart.js, Recharts, etc.

  return (
    <div className="relative h-60 w-full pb-6">
      {/* Simulating a chart with color bars for visual representation */}
      <div className="absolute bottom-6 left-0 w-full h-[calc(100%-1.5rem)] flex items-end justify-between p-4 gap-4">
        <div className="w-1/5 h-[30%] bg-indigo-600 rounded-t-md"></div>
        <div className="w-1/5 h-[65%] bg-indigo-500 rounded-t-md"></div>
        <div className="w-1/5 h-[45%] bg-indigo-400 rounded-t-md"></div>
        <div className="w-1/5 h-[75%] bg-indigo-300 rounded-t-md"></div>
        <div className="w-1/5 h-[55%] bg-indigo-200 rounded-t-md"></div>
      </div>

      {/* Chart labels - clearly out of the columns area */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 gap-4 pointer-events-none">
        <div className="w-1/5 flex justify-center">
          <span className="text-xs text-slate-600 text-center">Vector DB</span>
        </div>
        <div className="w-1/5 flex justify-center">
          <span className="text-xs text-slate-600 text-center">Session</span>
        </div>
        <div className="w-1/5 flex justify-center">
          <span className="text-xs text-slate-600 text-center">Cache</span>
        </div>
        <div className="w-1/5 flex justify-center">
          <span className="text-xs text-slate-600 text-center">Embeddings</span>
        </div>
        <div className="w-1/5 flex justify-center">
          <span className="text-xs text-slate-600 text-center">Other</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryUsageChart;