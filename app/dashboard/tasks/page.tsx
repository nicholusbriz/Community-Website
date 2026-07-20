'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/auth/useAuth';
import { 
  Loader2,
  Search,
  User,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderKanban,
  Tag,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Save,
  X,
  Crown,
  Shield
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
    ownerId: string;
    leads?: Array<{
      userId: string;
    }>;
  };
  assignedTo?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  assignedBy?: {
    id: string;
    name: string | null;
  } | null;
  _count?: {
    comments: number;
  };
}

// Status color mapping
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'BACKLOG': 'bg-gray-100 text-gray-700',
    'TODO': 'bg-blue-100 text-blue-700',
    'ASSIGNED': 'bg-purple-100 text-purple-700',
    'UNASSIGNED': 'bg-gray-100 text-gray-700',
    'IN_PROGRESS': 'bg-purple-100 text-purple-700',
    'REVIEW': 'bg-yellow-100 text-yellow-700',
    'COMPLETED': 'bg-green-100 text-green-700',
    'BLOCKED': 'bg-red-100 text-red-700',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-700';
};

const getPriorityColor = (priority: string) => {
  const colorMap: Record<string, string> = {
    'LOW': 'bg-green-100 text-green-700',
    'MEDIUM': 'bg-yellow-100 text-yellow-700',
    'HIGH': 'bg-orange-100 text-orange-700',
    'CRITICAL': 'bg-red-100 text-red-700',
  };
  return colorMap[priority] || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    'BACKLOG': 'Backlog',
    'TODO': 'To Do',
    'ASSIGNED': 'Assigned',
    'UNASSIGNED': 'Unassigned',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'COMPLETED': 'Completed',
    'BLOCKED': 'Blocked',
  };
  return labelMap[status] || status;
};

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
  
  // Expanded task state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // Edit mode states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [editError, setEditError] = useState('');

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

  // ✅ Check if user can edit/delete a task (owner or lead)
  const canEditTask = (task: Task) => {
    if (!user) return false;
    
    // Check if user is the project owner
    const isOwner = task.project.ownerId === user.id;
    
    // Check if user is a project lead
    const isLead = task.project.leads?.some((lead: any) => lead.userId === user.id) || false;
    
    return isOwner || isLead;
  };

  // Handle task expand/collapse
  const handleTaskToggle = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setEditingTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      setEditingTaskId(null);
      setSuccess('');
      setEditError('');
      // Populate edit form
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setEditFormData({
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          status: task.status || 'TODO',
        });
      }
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedTaskId) return;
    setIsSubmitting(true);
    setEditError('');
    setSuccess('');

    try {
      const task = tasks.find(t => t.id === expandedTaskId);
      if (!task) return;
      
      const response = await fetch(`/api/projects/${task.project.id}/tasks/${expandedTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          dueDate: editFormData.dueDate || undefined,
          status: editFormData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      setSuccess('Task updated successfully!');
      
      // Refresh tasks
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      
      const fetchResponse = await fetch(`/api/tasks/assigned?${params.toString()}`);
      const data = await fetchResponse.json();
      setTasks(data.tasks || []);
      
      setTimeout(() => {
        setSuccess('');
        setEditingTaskId(null);
      }, 1500);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!expandedTaskId) return;
    const task = tasks.find(t => t.id === expandedTaskId);
    if (!task) return;
    
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/projects/${task.project.id}/tasks/${expandedTaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setExpandedTaskId(null);
      
      // Refresh tasks
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      
      const fetchResponse = await fetch(`/api/tasks/assigned?${params.toString()}`);
      const data = await fetchResponse.json();
      setTasks(data.tasks || []);
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    const task = tasks.find(t => t.id === expandedTaskId);
    if (task) {
      setEditFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status || 'TODO',
      });
    }
    setEditError('');
    setSuccess('');
  };

  // Navigate to project tasks page
  const handleViewInProject = (task: Task) => {
    router.push(`/dashboard/projects/${task.project.id}/tasks`);
  };

  const statusOptions = ['ALL', 'BACKLOG', 'TODO', 'ASSIGNED', 'UNASSIGNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED'];
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
              {tasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;
                const isEditing = editingTaskId === task.id;
                const canEdit = canEditTask(task);

                return (
                  <div key={task.id} className="overflow-hidden">
                    {/* Task Summary - Click to expand */}
                    <div 
                      onClick={() => handleTaskToggle(task.id)}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Project Name - Clickable to view project */}
                          <div 
                            className="flex items-center gap-2 mb-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewInProject(task);
                            }}
                          >
                            <FolderKanban className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate">
                              {task.project.title}
                            </span>
                            {/* ✅ Show role badge if user is owner or lead */}
                            {canEdit && (
                              <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                <Shield className="w-3 h-3" />
                                Lead
                              </span>
                            )}
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
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Task Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6">
                        {success && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{success}</p>
                          </div>
                        )}
                        {editError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{editError}</p>
                          </div>
                        )}

                        {isEditing ? (
                          // Edit Form
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all resize-y"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={editFormData.status}
                                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                                >
                                  {statusOptions.filter(s => s !== 'ALL').map((status) => (
                                    <option key={status} value={status}>
                                      {getStatusLabel(status)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Due Date
                                </label>
                                <input
                                  type="date"
                                  value={editFormData.dueDate}
                                  onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSubmitting ? 'Updating...' : 'Update Task'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          // Task Details View
                          <>
                            {/* Task Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-xs text-gray-400">Assigned to</span>
                                  <span className="font-medium text-gray-900 truncate block">
                                    {task.assignedTo?.name || 'You'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-xs text-gray-400">Due Date</span>
                                  <span className="break-words">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-xs text-gray-400">Created</span>
                                  <span className="break-words">{new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                                <FolderKanban className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-xs text-gray-400">Project</span>
                                  <button
                                    onClick={() => handleViewInProject(task)}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block text-left"
                                  >
                                    {task.project.title}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            {task.description && (
                              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{task.description}</p>
                              </div>
                            )}

                            {/* Labels */}
                            {task.labels && task.labels.length > 0 && (
                              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <Tag className="w-4 h-4" />
                                  Labels
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {task.labels.map((label) => (
                                    <span key={label} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ✅ Action Buttons - Only show if user can edit */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                              {canEdit ? (
                                <>
                                  <button
                                    onClick={() => setEditingTaskId(task.id)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 text-sm"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={handleDelete}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 text-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500 italic flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-gray-400" />
                                  Only project leads and owners can edit tasks
                                </div>
                              )}
                              <button
                                onClick={() => handleViewInProject(task)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-sm"
                              >
                                <FolderKanban className="w-3.5 h-3.5" />
                                View in Project
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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