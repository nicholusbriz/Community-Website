'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/auth/useAuth';
import { 
  Loader2,
  Search,
  Filter,
  User,
  Calendar,
  MessageSquare,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderKanban,
  Users,
  Tag,
  X
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  labels: string[];
  dueDate: string | null;
  createdAt: string;
  project: {
    id: string;
    title: string;
    slug: string;
  };
  assignedBy?: {
    id: string;
    name: string | null;
  } | null;
  _count?: {
    comments: number;
  };
}

interface TasksResponse {
  tasks: Task[];
}

export default function DashboardTasksPage() {
  const router = useRouter();
  const { user, actions, isLoading: authLoading } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/tasks');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch tasks assigned to the current user
  useEffect(() => {
    async function fetchTasks() {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
        
        const response = await fetch(`/api/tasks/assigned?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [isAuthenticated, searchQuery, statusFilter, priorityFilter]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'BACKLOG': 'bg-gray-100 text-gray-700',
      'TODO': 'bg-blue-100 text-blue-700',
      'IN_PROGRESS': 'bg-purple-100 text-purple-700',
      'REVIEW': 'bg-yellow-100 text-yellow-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'BLOCKED': 'bg-red-100 text-red-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      'LOW': 'bg-green-100 text-green-700',
      'MEDIUM': 'bg-yellow-100 text-yellow-700',
      'HIGH': 'bg-orange-100 text-orange-700',
      'CRITICAL': 'bg-red-100 text-red-700',
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-700';
  };

  // Status label mapping
  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      'BACKLOG': 'Backlog',
      'TODO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'Review',
      'COMPLETED': 'Completed',
      'BLOCKED': 'Blocked',
    };
    return labelMap[status] || status;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'BLOCKED':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const statusOptions = ['ALL', 'BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED'];
  const priorityOptions = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">
            Tasks assigned to you across all projects
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">To Do</p>
            <p className="text-2xl font-bold text-blue-600">{todoTasks}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">{inProgressTasks}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Blocked</p>
            <p className="text-2xl font-bold text-red-600">{blockedTasks}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
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
                    {status === 'ALL' ? 'All Status' : getStatusLabel(status)}
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
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks assigned</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'You don\'t have any tasks assigned to you yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => router.push(`/dashboard/projects/${task.project.id}/tasks/${task.id}`)}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Project and Title */}
                      <div className="flex items-center gap-2 mb-1">
                        <FolderKanban className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500 hover:text-blue-600 truncate">
                          {task.project.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.assignedBy && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Assigned by {task.assignedBy.name || 'Unknown'}
                          </span>
                        )}
                        {task._count?.comments !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {task._count.comments} comments
                          </span>
                        )}
                        {task.labels && task.labels.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {task.labels.slice(0, 2).join(', ')}
                            {task.labels.length > 2 && ` +${task.labels.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Count */}
        {!loading && !error && tasks.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}