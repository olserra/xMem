import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold mt-2 text-slate-800">{value}</p>
          
          <div className="flex items-center mt-2">
            {trend === 'up' && (
              <span className="flex items-center text-emerald-600 text-sm">
                <ArrowUp size={14} className="mr-1" />
                {change}
              </span>
            )}
            {trend === 'down' && (
              <span className="flex items-center text-rose-600 text-sm">
                <ArrowDown size={14} className="mr-1" />
                {change}
              </span>
            )}
            {trend === 'neutral' && (
              <span className="text-slate-500 text-sm">{change}</span>
            )}
            <span className="text-slate-400 text-xs ml-1">from last month</span>
          </div>
        </div>
        
        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;