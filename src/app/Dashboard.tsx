import React from 'react';
import { BarChart, ArrowUpRight, Database, Cpu, Clock, Users } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import MemoryUsageChart from '../components/dashboard/MemoryUsageChart';
import ContextRelevanceChart from '../components/dashboard/ContextRelevanceChart';
import RecentQueriesTable from '../components/dashboard/RecentQueriesTable';

// Import the MetricCardProps type
import type { MetricCardProps } from '../components/dashboard/MetricCard';

const Dashboard: React.FC = () => {
  // Example metrics data
  const metrics: MetricCardProps[] = [
    {
      title: 'Total Retrievals',
      value: '14,582',
      change: '+15%',
      trend: 'up',
      icon: <Database size={20} className="text-indigo-600" />
    },
    {
      title: 'Avg. Context Size',
      value: '4.2 KB',
      change: '-8%',
      trend: 'down',
      icon: <Cpu size={20} className="text-teal-600" />
    },
    {
      title: 'Retrieval Time',
      value: '42ms',
      change: '-12%',
      trend: 'down',
      icon: <Clock size={20} className="text-amber-600" />
    },
    {
      title: 'Active Sessions',
      value: '187',
      change: '+24%',
      trend: 'up',
      icon: <Users size={20} className="text-purple-600" />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title and description */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Memory Orchestrator Dashboard</h1>
        <p className="text-slate-500 mt-1">Monitor your hybrid memory system performance at a glance</p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Memory Usage Distribution</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <MemoryUsageChart />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Context Relevance Scores</h2>
            <button className="text-sm text-indigo-600 flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </button>
          </div>
          <ContextRelevanceChart />
        </div>
      </div>

      {/* Recent queries table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-800">Recent Queries</h2>
          <button className="text-sm text-indigo-600 flex items-center gap-1">
            See All <ArrowUpRight size={14} />
          </button>
        </div>
        <RecentQueriesTable />
      </div>
    </div>
  );
};

export default Dashboard;