'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  MessageSquare,
  AlertCircle,
  ListChecks,
  Users,
  UserPlus,
  UserCheck,
  X,
  Crown,
  Shield,
  ChevronDown,
  Check,
  Save
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useTask, useUpdateTask, useDeleteTask } from '@/app/lib/hooks/useTasks';
import { useProject } from '@/app/lib/hooks/useProjects';

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
}

interface Member {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio?: string | null;
  skills?: string[];
  role?: 'OWNER' | 'LEAD' | 'MEMBER';
  isAssigned?: boolean;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const { id: projectId, taskId } = React.use(params);
  const { actions, isLoading: authLoading, user } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  
  const [assigning, setAssigning] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { data: task, isLoading: taskLoading, error: taskError, refetch: refetchTask } = useTask(projectId, taskId);
  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const project = projectData?.project;
  
  const updateTask = useUpdateTask(projectId, taskId);
  const deleteTask = useDeleteTask(projectId, taskId);

  // Check if user is team lead or project owner
  const isTeamLead = project?.leads?.some((lead: any) => lead.userId === user?.id) || false;
  const isProjectOwner = project?.ownerId === user?.id;
  const canAssignMembers = isTeamLead || isProjectOwner;
  const canEditDelete = isTeamLead || isProjectOwner;

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  // Redirect to All Tasks page if task fails to load
  React.useEffect(() => {
    if (taskError || !task) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/projects/${projectId}/tasks`);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [taskError, task, projectId, router]);

  // Populate edit form when task loads
  React.useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status || 'TODO',
      });
    }
  }, [task]);

  // Fetch project members
  useEffect(() => {
    async function fetchMembers() {
      if (!projectId) return;
      setLoadingMembers(true);
      setMemberError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/members`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch members: ${response.status}`);
        }
        
        const data = await response.json();
        
        const allMembers = data.members.map((member: any) => ({
          id: member.userId,
          name: member.user?.name || null,
          email: member.user?.email || '',
          image: member.user?.image || null,
          bio: member.user?.bio || null,
          skills: member.user?.skills || [],
          role: member.role || 'MEMBER',
          isAssigned: task?.assignedTo?.id === member.userId,
        }));
        
        setMembers(allMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMemberError(error instanceof Error ? error.message : 'Failed to load members');
      } finally {
        setLoadingMembers(false);
      }
    }
    fetchMembers();
  }, [projectId, task]);

  // Handle assign member
  const handleAssignMember = async (memberId: string) => {
    if (!canAssignMembers) {
      alert('Only the project owner or team leads can assign tasks');
      return;
    }
    
    setAssigning(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: memberId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign member');
      }

      await refetchTask();
    } catch (error) {
      console.error('Error assigning member:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign member to task');
    } finally {
      setAssigning(false);
    }
  };

  // Handle unassign member
  const handleUnassignMember = async () => {
    if (!canAssignMembers) {
      alert('Only the project owner or team leads can unassign tasks');
      return;
    }
    
    if (!confirm('Remove assignment from this task?')) return;
    
    setAssigning(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/assign`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unassign member');
      }

      await refetchTask();
    } catch (error) {
      console.error('Error unassigning member:', error);
      alert(error instanceof Error ? error.message : 'Failed to unassign member from task');
    } finally {
      setAssigning(false);
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const taskData = {
        title: editFormData.title,
        description: editFormData.description,
        dueDate: editFormData.dueDate || undefined,
        status: editFormData.status,
      };

      await updateTask.mutateAsync(taskData);
      setSuccess('Task updated successfully!');
      await refetchTask();
      
      setTimeout(() => {
        setIsEditing(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    
    try {
      await deleteTask.mutateAsync();
      router.push(`/dashboard/projects/${projectId}/tasks`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
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

  if (authLoading || taskLoading || projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Task Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The task you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/projects/${projectId}/tasks`}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ListChecks className="w-4 h-4 mr-2" />
              Back to All Tasks
            </Link>
            <p className="text-sm text-gray-400">
              Redirecting automatically in a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Updated status colors - only TODO, ASSIGNED, UNASSIGNED, COMPLETED
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

  const assignedMemberName = task.assignedTo?.name || 'Unassigned';

  // ✅ Status options for edit form
  const statusOptions = ['TODO', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/dashboard/projects/${projectId}/tasks`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tasks
        </Link>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isEditing ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full max-w-xs px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                    className="w-full max-w-xs pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editFormData.title.trim()}
                  className="px-6 py-2.5 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSubmitting ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      Task #{taskId.slice(0, 8)}
                    </span>
                  </div>
                </div>
                {canEditDelete && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs text-gray-400">Assigned to</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {assignedMemberName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Due Date</span>
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Created</span>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Labels</span>
                    <span>{task.labels?.length > 0 ? task.labels.join(', ') : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                {task.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  Team Members
                </h3>
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
              ) : memberError ? (
                <p className="text-sm text-red-500 p-2">{memberError}</p>
              ) : members.length === 0 ? (
                <p className="text-sm text-gray-500 p-2 text-center">No members available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (canAssignMembers && !member.isAssigned) {
                          handleAssignMember(member.id);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        member.isAssigned
                          ? 'bg-green-50 border-green-200 cursor-default'
                          : canAssignMembers
                          ? 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer hover:shadow-sm'
                          : 'bg-gray-50 border-gray-200 cursor-default'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                        {member.image ? (
                          <img src={member.image} alt={member.name || ''} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          member.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.name || 'Unknown'}
                          </p>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        <p className="text-[10px] text-gray-400">{getRoleLabel(member.role)}</p>
                      </div>
                      {member.isAssigned ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-green-600 font-medium">Assigned</span>
                          {canAssignMembers && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnassignMember();
                              }}
                              className="text-xs text-red-500 hover:text-red-700 ml-2"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ) : (
                        canAssignMembers && (
                          <div className="flex items-center gap-1 text-blue-500">
                            <UserPlus className="w-4 h-4" />
                            <span className="text-xs font-medium">Assign</span>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section - REMOVED since TaskComment is gone */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Task Discussion
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Task discussions are now handled in the <strong>Project Chat</strong>.
                </p>
                <Link
                  href={`/dashboard/projects/${projectId}/chat`}
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Project Chat →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}