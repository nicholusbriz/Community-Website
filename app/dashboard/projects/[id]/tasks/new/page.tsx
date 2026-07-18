'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useProject } from '@/app/lib/hooks/useProjects';
import { useCreateTask } from '@/app/lib/hooks/useProjectTasks';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Calendar,
  User
} from 'lucide-react';

interface NewTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NewTaskPage({ params }: NewTaskPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { actions, isLoading: authLoading, user } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch project data
  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const project = projectData?.project;
  const createTask = useCreateTask(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: '', // Optional: assign to someone
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  // Get project members for assignment dropdown
  const [members, setMembers] = useState<any[]>([]);
  
  React.useEffect(() => {
    if (project?.id) {
      fetch(`/api/projects/${project.id}/members`)
        .then(res => res.json())
        .then(data => {
          if (data.members) {
            setMembers(data.members);
          }
        })
        .catch(() => {
          // Silently fail - assignment is optional
        });
    }
  }, [project?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined,
        assignedToId: formData.assignedToId || undefined,
        // ✅ Status will default to 'TODO' if not assigned, or 'ASSIGNED' if assigned
        // This is handled in the API
      };

      await createTask.mutateAsync(taskData);
      setSuccess('Task created successfully!');
      setTimeout(() => {
        router.push(`/dashboard/projects/${id}/tasks`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

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
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/projects/${id}/tasks`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 text-sm mt-1">
            Add a new task to {project.title}
          </p>
        </div>

        {/* Success/Error Messages */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              placeholder="Describe the task..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all resize-y"
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign To
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.assignedToId}
                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all appearance-none bg-white"
              >
                <option value="">Unassigned (TODO)</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user?.name || 'Unknown'} {member.role === 'OWNER' ? '(Owner)' : member.role === 'LEAD' ? '(Lead)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              If assigned, task status will be set to "ASSIGNED"
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full max-w-xs pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Leave empty for no due date
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <Link
              href={`/dashboard/projects/${id}/tasks`}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="px-6 py-2.5 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}