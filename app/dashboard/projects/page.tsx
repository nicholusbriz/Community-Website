'use client';

import { useState } from 'react';
import { Plus, FolderGit2, Heart, MessageCircle, Edit, Trash2, Share2, BarChart3, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { DashboardPageShell } from '@/components/dashboard/dashboard-page-shell';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const projects = [
    { id: 1, title: 'AI Chat App', status: 'Published', languages: ['React', 'TypeScript'], likes: 45, comments: 12 },
    { id: 2, title: 'DevPortfolio', status: 'Draft', languages: ['Next.js', 'TypeScript'], likes: 32, comments: 8 },
    { id: 3, title: 'React Dashboard', status: 'Published', languages: ['React', 'Tailwind'], likes: 28, comments: 15 },
    { id: 4, title: 'Task Manager', status: 'Published', languages: ['Vue', 'TypeScript'], likes: 21, comments: 6 },
    { id: 5, title: 'EcoTracker', status: 'Draft', languages: ['Python', 'Django'], likes: 18, comments: 9 },
    { id: 6, title: 'Social Media App', status: 'Published', languages: ['React Native', 'Firebase'], likes: 15, comments: 11 },
  ];

  const statusOptions = ['All', 'Published', 'Draft'];
  const sortOptions = ['Newest', 'Oldest', 'Most Liked', 'Most Comments'];

  return (
    <DashboardPageShell
      title="My Projects"
      description="Manage all your projects"
      action={
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#0070f3] to-[#7928ca] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#0070f3]/25"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      }
    >

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
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
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>Filter: {option}</option>
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

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-6 h-6 text-[#0070f3]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.languages.map((lang) => (
                      <span key={lang} className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {project.comments} comments
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <Link
                  href={`/project/${project.id}`}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  View
                </Link>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
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

      {/* Pagination */}
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
    </DashboardPageShell>
  );
}
