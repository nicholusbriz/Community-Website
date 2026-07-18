'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useProject } from '@/app/lib/hooks/useProjects';
import { useProjectTasks } from '@/app/lib/hooks/useProjectTasks';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MessageSquare,
  X,
  ChevronRight
} from 'lucide-react';

// Define types
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedTo: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  dueDate: string | null;
  createdAt: string;
  // ✅ REMOVED: _count.comments since TaskComment was removed
}

interface TasksPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface TasksResponse {
  tasks: Task[];
}

// ✅ Updated status colors - only OPEN, IN_PROGRESS, COMPLETED
const statusColors: Record<string, string> = {
  TODO: 'bg-blue-100 text-blue-700',
  ASSIGNED: 'bg-purple-100 text-purple-700',
  UNASSIGNED: 'bg-gray-100 text-gray-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  TODO: 'To Do',
  ASSIGNED: 'Assigned',
  UNASSIGNED: 'Unassigned',
  COMPLETED: 'Completed',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export default function TasksPage({ params }: TasksPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { actions, isLoading: authLoading } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Fetch project data
  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const project = projectData?.project;

  // Fetch tasks with proper typing
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    error: tasksError,
    refetch 
  } = useProjectTasks(id, {
    search: searchQuery,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  // Get tasks with proper typing and fallback
  const tasks: Task[] = (tasksData as TasksResponse)?.tasks || [];
  const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // ✅ Updated status options - only TODO, ASSIGNED, UNASSIGNED, COMPLETED
  const statusOptions = ['ALL', 'TODO', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED'];
  const priorityOptions = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Handle task click - navigate to task details
  const handleTaskClick = (taskId: string) => {
    router.push(`/dashboard/projects/${id}/tasks/${taskId}`);
  };

  // Loading state
  if (authLoading || projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  // Error state
  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load project</p>
        <Link href="/dashboard/projects" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            {/* Back button goes to Project Dashboard */}
            <Link
              href={`/dashboard/projects/${id}/dashboard`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage all tasks for {project.title}
            </p>
          </div>
          {/* Create Task button navigates to the new task page */}
          <Link
            href={`/dashboard/projects/${id}/tasks/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: progress + '%' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{completedTasks} completed</span>
            <span>{tasks.length} total</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'ALL' ? 'All Status' : statusLabels[status as keyof typeof statusLabels] || status}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === 'ALL' ? 'All Priority' : priority}
                  </option>
                ))}
              </select>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks yet</p>
              <p className="text-gray-400 text-sm mt-1">Get started by creating your first task</p>
              <Link
                href={`/dashboard/projects/${id}/tasks/new`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tasks.map((task: Task) => {
                // Get the status color
                const statusColor = statusColors[task.status] || 'bg-gray-100 text-gray-700';
                const statusLabel = statusLabels[task.status as keyof typeof statusLabels] || task.status;
                const priorityColor = priorityColors[task.priority] || 'bg-gray-100 text-gray-700';

                return (
                  <div 
                    key={task.id} 
                    onClick={() => handleTaskClick(task.id)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={'w-2 h-2 rounded-full flex-shrink-0 ' + (
                            task.status === 'COMPLETED' ? 'bg-green-500' :
                            task.status === 'ASSIGNED' ? 'bg-purple-500' :
                            task.status === 'TODO' ? 'bg-blue-500' :
                            'bg-gray-400'
                          )} />
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {task.title}
                          </h3>
                          <span className={'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ' + statusColor}>
                            {statusLabel}
                          </span>
                          <span className={'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ' + priorityColor}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          {task.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {task.assignedTo.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {/* ✅ REMOVED: comments count since TaskComment was removed */}
                          {/* Task discussions are handled in project chat */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}