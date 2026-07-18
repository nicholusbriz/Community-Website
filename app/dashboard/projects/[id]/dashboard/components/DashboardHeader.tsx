// app/dashboard/projects/[id]/dashboard/components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  ListChecks, 
  TrendingUp,
  Settings,
  Plus,
  RefreshCw,
  Crown,
  Shield,
  MessageSquare
} from 'lucide-react';

interface DashboardHeaderProps {
  project: any;
  isOwner: boolean;
  pendingRequests: number;
  onRefresh: () => void;
  projectId: string;
}

// ✅ Updated helper functions with new statuses
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'OPEN': 'bg-green-50 text-green-700 border-green-200',
    'IN_PROGRESS': 'bg-blue-50 text-blue-700 border-blue-200',
    'COMPLETED': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
  };
  return labels[status] || status;
};

export function DashboardHeader({ 
  project, 
  isOwner, 
  pendingRequests, 
  onRefresh,
  projectId 
}: DashboardHeaderProps) {
  // ✅ Calculate completion percentage safely
  const totalTasks = project._count?.tasks || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            
            {/* Pending requests badge */}
            {isOwner && pendingRequests > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 animate-pulse">
                {pendingRequests} pending requests
              </span>
            )}
            
            {/* Featured badge */}
            {project.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                ⭐ Featured
              </span>
            )}
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {project._count?.members || 0} members
            </span>
            <span className="flex items-center gap-1.5">
              <ListChecks className="w-4 h-4" />
              {totalTasks} tasks
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              {completionPercentage}% complete
            </span>
            {/* ✅ Show lead count if available */}
            {project.leads && project.leads.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-yellow-500" />
                {project.leads.length} lead{project.leads.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          
          {/* Settings - Only for owner */}
          {isOwner && (
            <Link
              href={`/dashboard/projects/${projectId}/settings`}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          )}
          
          {/* Chat Button */}
          <Link
            href={`/dashboard/projects/${projectId}/chat`}
            className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Link>
          
          {/* New Task - Only for leads and owner */}
          {(isOwner || project.isLead) && (
            <Link
              href={`/dashboard/projects/${projectId}/tasks/new`}
              className="px-4 py-2.5 bg-[#1B2A56] text-white rounded-xl hover:bg-[#16223F] transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Progress Bar (optional enhancement) */}
      {totalTasks > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Project Progress</span>
            <span className="text-xs font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-[#1B2A56] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}