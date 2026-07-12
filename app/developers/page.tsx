'use client';

import { useState } from 'react';
import { Search, Filter, MessageCircle, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '../public-layout';

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [sortBy, setSortBy] = useState('Most Active');

  const developers = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', skills: ['React', 'TypeScript'], projects: 12, stars: 45 },
    { id: 2, name: 'Mike Chen', role: 'Full Stack Developer', skills: ['Next.js', 'Node.js'], projects: 10, stars: 32 },
    { id: 3, name: 'Emily Rodriguez', role: 'UI/UX Designer', skills: ['Figma', 'TypeScript'], projects: 8, stars: 28 },
    { id: 4, name: 'David Kim', role: 'DevOps Engineer', skills: ['Docker', 'AWS'], projects: 6, stars: 21 },
    { id: 5, name: 'Lisa Thompson', role: 'Product Manager', skills: ['Agile', 'Scrum'], projects: 10, stars: 18 },
    { id: 6, name: 'James Wilson', role: 'Full Stack Developer', skills: ['Vue', 'Python'], projects: 4, stars: 15 },
  ];

  const skills = ['All Skills', 'React', 'TypeScript', 'Next.js', 'Node.js', 'Vue', 'Python', 'Docker', 'AWS', 'Figma'];
  const sortOptions = ['Most Active', 'Most Projects', 'Most Stars', 'Newest'];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Developers</h1>
          <p className="text-gray-600">Discover and connect with talented developers in our community</p>
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
                placeholder="Search developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                >
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
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

      {/* Developers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <a
              key={developer.id}
              href={`/developer/${developer.name.toLowerCase().replace(' ', '')}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer"
            >
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-[#0070f3] transition-colors">
                    {developer.name}
                  </h3>
                  <p className="text-sm text-gray-600">{developer.role}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {developer.skills.map((skill) => (
                  <span key={skill} className="text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{developer.projects}</span> projects
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{developer.stars}</span> stars
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  View
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Msg
                </button>
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
