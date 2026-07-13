'use client';

import { Heart, ArrowRight, User, FolderGit2, Star } from 'lucide-react';
import Link from 'next/link';

export default function SavedProjectsPage() {
  const savedProjects = [
    { id: 1, title: 'AI Chat App', owner: 'Sarah Johnson', languages: ['React', 'TypeScript'], likes: 45, saved: true },
    { id: 2, title: 'DevPortfolio', owner: 'Mike Chen', languages: ['Next.js', 'TypeScript'], likes: 32, saved: true },
    { id: 3, title: 'React Dashboard', owner: 'Emily Rodriguez', languages: ['React', 'Tailwind'], likes: 28, saved: true },
    { id: 4, title: 'EcoTracker', owner: 'Alex Rivera', languages: ['Python', 'Django'], likes: 19, saved: true },
  ];

  const toggleSave = (projectId: number) => {
    // In a real app, this would call an API
    console.log('Toggle save for project:', projectId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Projects</h1>
        <p className="text-gray-600 mt-1">Your favorite projects from the community</p>
      </div>

      {/* Projects Grid */}
      {savedProjects.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {savedProjects.length} saved project{savedProjects.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Recently Saved</option>
                <option>Most Liked</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all"
              >
                {/* Project Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                  <FolderGit2 className="w-12 h-12 text-blue-400/50" />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleSave(project.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                    >
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Languages */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Owner */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span>{project.owner}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      {project.likes} likes
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/project/${project.id}`}
                      className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                    >
                      View Project
                    </Link>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved projects yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Start exploring the community and save projects you love. Your saved projects will appear here.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}