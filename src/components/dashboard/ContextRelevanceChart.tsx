"use client";

import React, { useEffect, useState } from 'react';

const ContextRelevanceChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder during SSR to avoid hydration mismatch
    return <div className="relative h-60 w-full" />;
  }

  // This is a placeholder for an actual chart component
  // In a real implementation, you would use a chart library like Chart.js, Recharts, etc.
  return (
    <div className="relative h-60 w-full">
      {/* Simulating a chart with dots for visual representation */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-4">
        {Array.from({ length: 24 }).map((_, i) => {
          // Generate varying sizes based on position
          const size = 16 + Math.floor(Math.random() * 40);

          // Generate different colors for the dots
          const colors = [
            'bg-teal-500', 'bg-indigo-500', 'bg-purple-500',
            'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          // Opacity based on simulated relevance
          const opacity = 0.3 + Math.random() * 0.7;

          return (
            <div
              key={i}
              className={`rounded-full ${color}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Chart overlay message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-slate-400 text-sm italic">Interactive relevance visualization will render here</p>
      </div>
    </div>
  );
};

export default ContextRelevanceChart;