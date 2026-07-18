'use client';

import { Users, ListChecks, Clock, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  project: any;
  analytics: any;
  pendingRequests: number;
}

export function StatsGrid({ project, analytics, pendingRequests }: StatsGridProps) {
  const taskStats = analytics?.taskStats || [];
  const totalTasks = taskStats.reduce((sum: number, s: any) => sum + s._count, 0);
  const completedTasks = taskStats.find((s: any) => s.status === 'COMPLETED')?._count || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { 
      label: 'Total Members', 
      value: project._count?.members || 0, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50'
    },
    { 
      label: 'Total Tasks', 
      value: totalTasks, 
      icon: ListChecks, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50'
    },
    { 
      label: 'Pending Requests', 
      value: pendingRequests, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50'
    },
    { 
      label: 'Completion Rate', 
      value: `${progress}%`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1.5">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
