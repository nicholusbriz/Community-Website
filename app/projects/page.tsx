'use client';

import { useState } from 'react';
import { Search, Filter, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '../public-layout';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState('Newest');

  const projects = [
    { id: 1, title: 'AI Chat App', languages: ['React', 'TypeScript'], tags: ['AI', 'Chat'], owner: 'Sarah', likes: 45, comments: 12 },
    { id: 2, title: 'DevPortfolio', languages: ['Next.js', 'TypeScript'], tags: ['Portfolio', 'Web'], owner: 'Mike', likes: 32, comments: 8 },
    { id: 3, title: 'React Dashboard', languages: ['React', 'Tailwind'], tags: ['Dashboard', 'UI'], owner: 'Emily', likes: 28, comments: 15 },
    { id: 4, title: 'EcoTracker', languages: ['Python', 'Django'], tags: ['Environment', 'Data'], owner: 'James', likes: 21, comments: 6 },
    { id: 5, title: 'Task Manager', languages: ['Vue', 'TypeScript'], tags: ['Productivity', 'SaaS'], owner: 'Lisa', likes: 18, comments: 9 },
    { id: 6, title: 'Social Media App', languages: ['React Native', 'Firebase'], tags: ['Mobile', 'Social'], owner: 'David', likes: 15, comments: 11 },
  ];

  const languages = ['All Languages', 'React', 'Next.js', 'Vue', 'Python', 'TypeScript', 'JavaScript'];
  const tags = ['All Tags', 'AI', 'Web', 'Mobile', 'Dashboard', 'SaaS', 'Data'];
  const sortOptions = ['Newest', 'Most Liked', 'Most Comments', 'Oldest'];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">All Projects</h1>
          <p className="text-gray-600">Browse and discover amazing projects from our community</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
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
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/project/${project.id}`}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer"
            >
              {/* Screenshot */}
              <div className="aspect-videobg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.languages.map((lang) => (
                    <span key={lang} className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#0070f3] transition-colors">
                  {project.title}
                </h3>

                {/* Owner */}
                <p className="text-sm text-gray-600 mb-4">👤 {project.owner}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {project.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {project.comments} comments
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    View
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {[1, 2, 3, 4, 5].map((page) => (
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
          <button className="px-4 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
