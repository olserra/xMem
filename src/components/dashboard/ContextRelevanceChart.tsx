"use client";

import React, { useEffect, useState } from 'react';

const AXIS_HEIGHT = 32;
const CHART_HEIGHT = 240;
const CHART_WIDTH = 520;

const ContextRelevanceChart: React.FC = () => {
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/qdrant-queries?relevanceOnly=true');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setScores(data.scores || []);
      } catch {
        setScores([]);
      }
      setLoading(false);
    };
    fetchScores();
  }, []);

  if (loading) {
    return <div className="relative h-60 w-full flex items-center justify-center text-slate-400">Loading...</div>;
  }

  if (!scores.length) {
    return <div className="relative h-60 w-full flex items-center justify-center text-slate-400">No data</div>;
  }

  // Chart area dimensions
  const chartHeight = CHART_HEIGHT;
  const chartWidth = CHART_WIDTH;
  const yMax = 100;
  const yMin = 0;
  const xStep = chartWidth / (scores.length + 1);

  // Map scores to chart coordinates
  const points = scores.map((score, i) => {
    const x = xStep * (i + 1);
    const y = chartHeight - ((score - yMin) / (yMax - yMin)) * (chartHeight - AXIS_HEIGHT);
    // Size and color based on score
    const size = 16 + Math.round((score / 100) * 40);
    let color = '#f43f5e'; // rose-500
    if (score > 90) color = '#10b981'; // emerald-500
    else if (score > 80) color = '#3b82f6'; // blue-500
    else if (score > 70) color = '#f59e42'; // amber-500
    else if (score > 60) color = '#a78bfa'; // purple-500
    else if (score > 50) color = '#6366f1'; // indigo-500
    const opacity = 0.5 + (score / 200);
    return { x, y, size, color, opacity, score };
  });

  // Y axis ticks
  const yTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="relative w-full flex justify-center">
      <svg width={chartWidth + 60} height={chartHeight + AXIS_HEIGHT}>
        {/* Y axis */}
        <g>
          {/* Axis line */}
          <line x1={40} y1={AXIS_HEIGHT} x2={40} y2={chartHeight} stroke="#64748b" strokeWidth={1.5} />
          {/* Ticks and labels */}
          {yTicks.map((tick) => {
            const y = chartHeight - ((tick - yMin) / (yMax - yMin)) * (chartHeight - AXIS_HEIGHT);
            return (
              <g key={tick}>
                <line x1={36} y1={y} x2={40} y2={y} stroke="#64748b" strokeWidth={1} />
                <text x={28} y={y + 4} fontSize={12} fill="#64748b" textAnchor="end">{tick}</text>
              </g>
            );
          })}
          {/* Y axis label */}
          <text x={10} y={AXIS_HEIGHT + (chartHeight - AXIS_HEIGHT) / 2} fontSize={13} fill="#334155" textAnchor="middle" transform={`rotate(-90 10,${AXIS_HEIGHT + (chartHeight - AXIS_HEIGHT) / 2})`}>
            Relevance Score
          </text>
        </g>
        {/* X axis */}
        <g>
          <line x1={40} y1={chartHeight} x2={chartWidth + 40} y2={chartHeight} stroke="#64748b" strokeWidth={1.5} />
          {/* Ticks and labels */}
          {scores.map((_, i) => (
            <g key={i}>
              <line x1={xStep * (i + 1) + 40} y1={chartHeight} x2={xStep * (i + 1) + 40} y2={chartHeight + 6} stroke="#64748b" strokeWidth={1} />
              <text x={xStep * (i + 1) + 40} y={chartHeight + 20} fontSize={12} fill="#64748b" textAnchor="middle">{i + 1}</text>
            </g>
          ))}
          {/* X axis label */}
          <text x={chartWidth / 2 + 40} y={chartHeight + 32} fontSize={13} fill="#334155" textAnchor="middle">
            Query Index
          </text>
        </g>
        {/* Data points (balls) */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x + 40}
            cy={pt.y}
            r={pt.size / 2}
            fill={pt.color}
            fillOpacity={pt.opacity}
            stroke="#fff"
            strokeWidth={1.5}
          >
            <title>Score: {pt.score}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default ContextRelevanceChart;