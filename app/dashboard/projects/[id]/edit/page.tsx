// app/dashboard/projects/[id]/edit/page.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useProject, useUpdateProject } from '@/app/lib/hooks/useProjects';
import { useGroups } from '@/app/lib/hooks/useGroups';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  X,
  Loader2,
  Code,
  Target,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Save
} from 'lucide-react';

// Import Prisma types
import type { Project, ProjectStatus, Difficulty } from '@prisma/client';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Use Prisma's Project type directly
type ProjectWithGroup = Project & {
  group: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { actions, isLoading: authLoading } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  
  const { data: projectData, isLoading: projectLoading, error: projectError } = useProject(id);
  const updateProject = useUpdateProject();
  const { data: groups, isLoading: groupsLoading } = useGroups();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    goals: [] as string[],
    maxTeamSize: 1, // ✅ Changed from 5 to 1
    difficulty: 'INTERMEDIATE' as Difficulty,
    duration: '',
    repositoryUrl: '',
    demoUrl: '',
    requirements: '',
    learningOutcomes: [] as string[],
    groupId: '',
    status: 'OPEN' as ProjectStatus, // ✅ Changed from DRAFT to OPEN
  });
  
  const [newTech, setNewTech] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [projectSlug, setProjectSlug] = useState('');

  // Load project data when available
  useEffect(() => {
    if (projectData) {
      const project = projectData as any;
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || [],
        goals: project.goals || [],
        maxTeamSize: project.maxTeamSize || 1,
        difficulty: (project.difficulty as Difficulty) || 'INTERMEDIATE',
        duration: project.duration || '',
        repositoryUrl: project.repositoryUrl || '',
        demoUrl: project.demoUrl || '',
        requirements: project.requirements || '',
        learningOutcomes: project.learningOutcomes || [],
        groupId: project.groupId || '',
        status: (project.status as ProjectStatus) || 'OPEN',
      });
      setProjectSlug(project.slug || id);
      setIsLoading(false);
    }
  }, [projectData, id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }
    
    if (formData.techStack.length === 0) {
      newErrors.techStack = 'Add at least one technology';
    }
    
    if (formData.goals.length === 0) {
      newErrors.goals = 'Add at least one goal';
    }
    
    // ✅ Updated validation: maxTeamSize must be at least 1
    if (formData.maxTeamSize < 1 || formData.maxTeamSize > 20) {
      newErrors.maxTeamSize = 'Team size must be between 1 and 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setErrors({});
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const updateData = {
        ...formData,
        maxTeamSize: Number(formData.maxTeamSize),
        // ✅ projectType, visibility, and screenshots are removed - don't send them
      };
      
      await updateProject.mutateAsync({ id, data: updateData });
      setSuccess('Project updated successfully!');
      
      setTimeout(() => {
        const slug = projectSlug || id;
        router.push(`/projects/${slug}`);
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to update project:', error);
      setErrors({ submit: error.message || 'Failed to update project. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addTech = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoal = (goal: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter(g => g !== goal)
    });
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData({
        ...formData,
        learningOutcomes: [...formData.learningOutcomes, newOutcome.trim()]
      });
      setNewOutcome('');
    }
  };

  const removeOutcome = (outcome: string) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes.filter(o => o !== outcome)
    });
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    
    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format. Please use JPEG, PNG, GIF, or WEBP.`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      const url = URL.createObjectURL(file);
    }
  };

  // ✅ Updated status options - only OPEN, IN_PROGRESS, COMPLETED
  const statusOptions = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  if (authLoading || projectLoading || isLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  if (projectError) {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/projects" 
          className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          Edit Project
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Update your project details
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Basic Information
          </h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-stone-200 dark:border-white/10'
                }`}
                placeholder="e.g., AI-Powered Chat Assistant"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-stone-200 dark:border-white/10'
                }`}
                placeholder="Describe what this project is about..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Project Status
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Category */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Project Category
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Select Category
            </label>
            <select
              value={formData.groupId || ''}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
            >
              <option value="">Select a category...</option>
              {groups?.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.icon || ''} {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Tech Stack *
          </h2>
          
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className="flex-1 px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="e.g., React, Node.js, Python"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors"
              >
                Add
              </button>
            </div>
            
            {errors.techStack && (
              <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8] rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Goals *
          </h2>
          
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                className="flex-1 px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="e.g., Build a real-time dashboard"
              />
              <button
                type="button"
                onClick={addGoal}
                className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors"
              >
                Add
              </button>
            </div>
            
            {errors.goals && (
              <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
            )}
            
            <div className="space-y-1 mt-2">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-white/5 rounded-lg">
                  <span className="text-[#1B2A56] dark:text-[#8CA0DE]">•</span>
                  <span className="flex-1 text-sm text-stone-700 dark:text-stone-300">{goal}</span>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal)}
                    className="text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Settings */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Team Size *
              </label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
                min={1}
                max={20}
                className={`w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white ${
                  errors.maxTeamSize ? 'border-red-500' : 'border-stone-200 dark:border-white/10'
                }`}
              />
              {errors.maxTeamSize && (
                <p className="mt-1 text-sm text-red-600">{errors.maxTeamSize}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  difficulty: e.target.value as Difficulty
                })}
                className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
              >
                <option value="BEGINNER">🟢 Beginner</option>
                <option value="INTERMEDIATE">🟡 Intermediate</option>
                <option value="ADVANCED">🔴 Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Duration & Links */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Duration & Links
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="e.g., 3 months, 6 weeks"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Repository URL
              </label>
              <input
                type="url"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="https://demo.example.com"
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Requirements
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Skills & Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
              placeholder="Describe the skills, experience, or requirements for team members..."
            />
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Learning Outcomes
          </h2>
          
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                className="flex-1 px-4 py-2 bg-white dark:bg-[#2d2d2d] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white"
                placeholder="e.g., Learn full-stack development"
              />
              <button
                type="button"
                onClick={addOutcome}
                className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-1 mt-2">
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-white/5 rounded-lg">
                  <span className="text-[#1B2A56] dark:text-[#8CA0DE]">•</span>
                  <span className="flex-1 text-sm text-stone-700 dark:text-stone-300">{outcome}</span>
                  <button
                    type="button"
                    onClick={() => removeOutcome(outcome)}
                    className="text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200 dark:border-white/10">
          <Link
            href="/dashboard/projects"
            className="px-6 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateProject.isPending}
            className="px-6 py-2.5 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateProject.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}