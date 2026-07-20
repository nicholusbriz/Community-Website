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
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  X,
  ChevronRight,
  RefreshCw,
  Tag,
  Users,
  UserPlus,
  UserMinus,
  Crown,
  Shield,
  Save
} from 'lucide-react';
import { useAuth as useAuthHook } from '@/app/lib/auth/useAuth';
import { useTask, useUpdateTask, useDeleteTask } from '@/app/lib/hooks/useTasks';

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
  labels?: string[];
}

interface Member {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role?: 'OWNER' | 'LEAD' | 'MEMBER';
  isAssigned?: boolean;
}

interface TasksPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface TasksResponse {
  tasks: Task[];
}

// Status colors
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
  const { id: projectId } = React.use(params);
  const { actions, isLoading: authLoading, user } = useAuthHook();
  const isAuthenticated = actions.isAuthenticated();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Expanded task state
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  
  // ✅ Track which member is being assigned/unassigned
  const [assigningMemberId, setAssigningMemberId] = useState<string | null>(null);
  const [unassigningMemberId, setUnassigningMemberId] = useState<string | null>(null);
  
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
  const [error, setError] = useState('');

  // Fetch project data
  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const project = projectData?.project;

  // Fetch tasks
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    error: tasksError,
    refetch: refetchTasks 
  } = useProjectTasks(projectId, {
    search: searchQuery,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
  });

  // Task operations
  const updateTask = useUpdateTask(projectId, expandedTaskId || '');
  const deleteTask = useDeleteTask(projectId, expandedTaskId || '');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  // Get tasks
  const tasks: Task[] = (tasksData as TasksResponse)?.tasks || [];
  const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const statusOptions = ['ALL', 'TODO', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED'];
  const priorityOptions = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Check if user is team lead or project owner
  const isTeamLead = project?.leads?.some((lead: any) => lead.userId === user?.id) || false;
  const isProjectOwner = project?.ownerId === user?.id;
  const canAssignMembers = isTeamLead || isProjectOwner;
  const canEditDelete = isTeamLead || isProjectOwner;

  // Fetch members when a task is expanded
  const fetchMembers = async (taskId: string) => {
    if (!projectId) return;
    setLoadingMembers(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/members`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      
      // Get the task to check assignments
      const taskResponse = await fetch(`/api/projects/${projectId}/tasks/${taskId}`);
      const taskData = await taskResponse.json();
      
      const allMembers = data.members.map((member: any) => ({
        id: member.userId,
        name: member.user?.name || null,
        email: member.user?.email || '',
        image: member.user?.image || null,
        role: member.role || 'MEMBER',
        isAssigned: taskData.task?.assignedTo?.id === member.userId,
      }));
      
      setMembers(allMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Handle task expand/collapse
  const handleTaskToggle = async (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setEditingTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      setEditingTaskId(null);
      setSuccess('');
      setError('');
      await fetchMembers(taskId);
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

  // ✅ Handle assign member with loading state
  const handleAssignMember = async (memberId: string) => {
    if (!canAssignMembers || !expandedTaskId) return;
    
    // Set loading state for this specific member
    setAssigningMemberId(memberId);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${expandedTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: memberId }),
      });
      
      if (!response.ok) throw new Error('Failed to assign member');
      
      // Refresh data
      await refetchTasks();
      await fetchMembers(expandedTaskId);
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to assign member');
    } finally {
      setAssigningMemberId(null);
    }
  };

  // ✅ Handle unassign member with loading state
  const handleUnassignMember = async (memberId: string) => {
    if (!canAssignMembers || !expandedTaskId) return;
    if (!confirm('Remove assignment from this task?')) return;
    
    // Set loading state for this specific member
    setUnassigningMemberId(memberId);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${expandedTaskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to unassign member');
      
      // Refresh data
      await refetchTasks();
      await fetchMembers(expandedTaskId);
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to unassign member');
    } finally {
      setUnassigningMemberId(null);
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedTaskId) return;
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateTask.mutateAsync({
        title: editFormData.title,
        description: editFormData.description,
        dueDate: editFormData.dueDate || undefined,
        status: editFormData.status,
      });
      setSuccess('Task updated successfully!');
      await refetchTasks();
      await fetchMembers(expandedTaskId);
      setTimeout(() => {
        setSuccess('');
        setEditingTaskId(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!expandedTaskId) return;
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask.mutateAsync();
      setExpandedTaskId(null);
      await refetchTasks();
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
    setError('');
    setSuccess('');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'TODO': 'bg-blue-100 text-blue-700',
      'ASSIGNED': 'bg-purple-100 text-purple-700',
      'UNASSIGNED': 'bg-gray-100 text-gray-700',
      'COMPLETED': 'bg-green-100 text-green-700',
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

  const getRoleBadge = (role?: string) => {
    if (role === 'OWNER') {
      return <Crown className="w-3 h-3 text-yellow-500" />;
    } else if (role === 'LEAD') {
      return <Shield className="w-3 h-3 text-blue-500" />;
    }
    return null;
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'OWNER') return 'Owner';
    if (role === 'LEAD') return 'Team Lead';
    return 'Member';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/projects/${projectId}/dashboard`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage all tasks for {project.title}
          </p>
        </div>
        <Link
          href={`/dashboard/projects/${projectId}/tasks/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors shadow-sm hover:shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
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
              onClick={() => refetchTasks()}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
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
              href={`/dashboard/projects/${projectId}/tasks/new`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Task
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task: Task) => {
              const statusColor = statusColors[task.status] || 'bg-gray-100 text-gray-700';
              const statusLabel = statusLabels[task.status as keyof typeof statusLabels] || task.status;
              const priorityColor = priorityColors[task.priority] || 'bg-gray-100 text-gray-700';
              const isExpanded = expandedTaskId === task.id;
              const isEditing = editingTaskId === task.id;

              return (
                <div key={task.id} className="overflow-hidden">
                  {/* Task Summary - Click to expand */}
                  <div 
                    onClick={() => handleTaskToggle(task.id)}
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
                              <User className="w-3 h-3 flex-shrink-0" />
                              {task.assignedTo.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
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
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <p className="text-red-700 text-sm">{error}</p>
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
                                    {statusLabels[status as keyof typeof statusLabels] || status}
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
                                  {task.assignedTo?.name || 'Unassigned'}
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
                              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="block text-xs text-gray-400">Labels</span>
                                <span className="break-words">
                                  {task.labels && task.labels.length > 0 ? task.labels.join(', ') : 'None'}
                                </span>
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

                          {/* ✅ Members Section with Loading States */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                Team Members
                              </h4>
                              {canAssignMembers ? (
                                <span className="text-xs text-gray-400">Click a member to assign</span>
                              ) : (
                                <span className="text-xs text-gray-400">Only owner or leads can assign</span>
                              )}
                            </div>

                            {loadingMembers ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                              </div>
                            ) : members.length === 0 ? (
                              <p className="text-sm text-gray-500 p-2 text-center">No members available</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                                {members.map((member) => {
                                  const isAssigning = assigningMemberId === member.id;
                                  const isUnassigning = unassigningMemberId === member.id;
                                  const isAssigned = member.isAssigned;
                                  
                                  return (
                                    <div
                                      key={member.id}
                                      onClick={() => {
                                        if (canAssignMembers && !isAssigned && !isAssigning) {
                                          handleAssignMember(member.id);
                                        }
                                      }}
                                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                        isAssigned
                                          ? 'bg-green-50 border-green-200'
                                          : canAssignMembers && !isAssigning && !isUnassigning
                                          ? 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer hover:shadow-sm'
                                          : 'bg-gray-50 border-gray-200'
                                      } ${(isAssigning || isUnassigning) ? 'opacity-70' : ''}`}
                                    >
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                                        {member.image ? (
                                          <img src={member.image} alt={member.name || ''} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                          member.name?.[0]?.toUpperCase() || 'U'
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                          <p className="text-xs font-medium text-gray-900 truncate">
                                            {member.name || 'Unknown'}
                                          </p>
                                          {getRoleBadge(member.role)}
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate">{member.email}</p>
                                      </div>
                                      
                                      {/* ✅ Assignment Status with Loading */}
                                      <div className="flex-shrink-0">
                                        {isAssigning ? (
                                          // Loading spinner when assigning
                                          <div className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                            <span className="text-[10px] text-blue-500">Assigning...</span>
                                          </div>
                                        ) : isUnassigning ? (
                                          // Loading spinner when unassigning
                                          <div className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                                            <span className="text-[10px] text-red-500">Removing...</span>
                                          </div>
                                        ) : isAssigned ? (
                                          // Show assigned with remove button
                                          <div className="flex items-center gap-1.5">
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                            <span className="text-[10px] text-green-600 font-medium hidden sm:inline">Assigned</span>
                                            {canAssignMembers && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleUnassignMember(member.id);
                                                }}
                                                className="text-red-400 hover:text-red-600 transition-colors p-0.5 hover:bg-red-50 rounded"
                                                title="Remove assignment"
                                              >
                                                <UserMinus className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        ) : (
                                          // Show assign button
                                          canAssignMembers && (
                                            <div className="flex items-center gap-1 text-blue-500">
                                              <UserPlus className="w-3.5 h-3.5" />
                                              <span className="text-[10px] font-medium hidden sm:inline">Assign</span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {canEditDelete && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
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
                            </div>
                          )}
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
    </div>
  );
}