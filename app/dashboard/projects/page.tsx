// app/dashboard/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderGit2, Heart, MessageCircle, Edit, Trash2, Share2, BarChart3, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/auth/useAuth';

// Import Prisma types
import type { Project, ProjectStatus } from '@prisma/client';

// Extended type with relations and counts
type UserProject = Project & {
  group: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    members: number;
    tasks: number;
    joinRequests: number;
  };
};

// ✅ Define the response type
interface UserProjectsResponse {
  projects: UserProject[];
}

export default function ProjectsPage() {
  const { user, status: authStatus, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's projects
  useEffect(() => {
    async function fetchUserProjects() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/users/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json() as UserProjectsResponse;
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load your projects. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserProjects();
  }, [user?.id]);

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      // Search filter
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'All' && project.status !== filterStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'Most Liked') {
        return (b._count?.members || 0) - (a._count?.members || 0);
      }
      if (sortBy === 'Most Comments') {
        return (b._count?.tasks || 0) - (a._count?.tasks || 0);
      }
      return 0;
    });

  // ✅ Updated status options - only OPEN, IN_PROGRESS, COMPLETED
  const statusOptions = ['All', 'OPEN', 'IN_PROGRESS', 'COMPLETED'];
  const sortOptions = ['Newest', 'Oldest', 'Most Liked', 'Most Comments'];

  // Helper to format status for display
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
    };
    return statusMap[status] || status;
  };

  // Helper to get status color
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'OPEN': 'bg-green-100 text-green-700',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700',
      'COMPLETED': 'bg-purple-100 text-purple-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage all your projects</p>
          <p className="text-sm text-gray-400">{projects.length} projects total</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0070f3] to-[#7928ca] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#0070f3]/25"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'All')}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>Filter: {option === 'All' ? 'All Statuses' : formatStatus(option)}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>Sort: {option}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects List - Mobile Responsive Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FolderGit2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No projects found</p>
          <p className="text-gray-400 text-sm mt-1">
            {projects.length === 0 ? "You haven't created any projects yet." : 'Try adjusting your filters.'}
          </p>
          {projects.length === 0 && (
            <Link
              href="/dashboard/projects/new"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-6 h-6 text-[#0070f3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {formatStatus(project.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.techStack && project.techStack.slice(0, 3).map((lang: string) => (
                        <span key={lang} className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                          {lang}
                        </span>
                      ))}
                      {project.techStack && project.techStack.length > 3 && (
                        <span className="text-xs text-gray-400">+{project.techStack.length - 3} more</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {project._count?.members || 0} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {project._count?.tasks || 0} tasks
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        {project.currentMembers || 0}/{project.maxTeamSize || 5} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/projects/${project.id}/dashboard`}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredProjects.length > 10 && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                page === 1
                  ? 'bg-[#0070f3] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}