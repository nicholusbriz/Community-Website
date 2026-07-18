// app/dashboard/projects/[id]/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useProject } from '@/app/lib/hooks/useProjects';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2,
  Settings,
  Save,
  AlertCircle,
  Archive,
  Trash2,
  X,
  CheckCircle
} from 'lucide-react';
import type { ProjectStatus, Difficulty } from '@prisma/client';

interface SettingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { user, actions, isLoading: authLoading } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // Fetch project data
  const { data: projectData, isLoading: projectLoading, refetch } = useProject(id);
  const project = projectData?.project;

  // ✅ Updated form data - removed visibility
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN' as ProjectStatus,
    maxTeamSize: 1,
    difficulty: 'INTERMEDIATE' as Difficulty,
    duration: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: (project.status as ProjectStatus) || 'OPEN',
        maxTeamSize: project.maxTeamSize || 1,
        difficulty: (project.difficulty as Difficulty) || 'INTERMEDIATE',
        duration: project.duration || '',
      });
    }
  }, [project]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  const isOwner = user?.id === project?.ownerId;

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

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-500 text-lg font-medium">Access Denied</p>
        <p className="text-gray-500">Only the project owner can access settings</p>
        <Link href={`/dashboard/projects/${id}/dashboard`} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // ✅ Updated handleSubmit with proper typing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          maxTeamSize: formData.maxTeamSize,
          difficulty: formData.difficulty,
          duration: formData.duration,
          // ✅ visibility removed - all projects are public
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }

      setSuccess('Settings updated successfully!');
      refetch();
    } catch (error: any) {
      alert(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Updated archive - uses status: 'ARCHIVED' (still exists in ProjectStatus)
  const handleArchive = async () => {
    if (!confirm('Archive this project? It will be hidden from public view.')) return;
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      });
      if (response.ok) {
        router.push('/dashboard/projects');
      }
    } catch (error) {
      alert('Failed to archive project');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project permanently? This action cannot be undone.')) return;
    try {
      const response = await fetch(`/api/projects/${id}?hardDelete=true`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/dashboard/projects');
      }
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  // ✅ Updated status options - only OPEN, IN_PROGRESS, COMPLETED
  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const difficultyOptions: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/projects/${id}/dashboard`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your project settings and preferences
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Project Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* ✅ Visibility removed - all projects are public */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Team Size</label>
                <input
                  type="number"
                  value={formData.maxTeamSize}
                  onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0) + option.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 months, 6 weeks"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Info: Public Projects */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              All projects are <strong>public</strong> by default. Visibility settings are managed at the platform level.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/dashboard/projects/${id}/dashboard`}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-xl border border-red-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            These actions are permanent and cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleArchive}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive Project
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}