'use client';

import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SavedProjectsPage() {
  const savedProjects = [
    { id: 1, title: 'AI Chat App', owner: 'Sarah', languages: ['React', 'TypeScript'], likes: 45 },
    { id: 2, title: 'DevPortfolio', owner: 'Mike', languages: ['Next.js', 'TypeScript'], likes: 32 },
    { id: 3, title: 'React Dashboard', owner: 'Emily', languages: ['React', 'Tailwind'], likes: 28 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Saved Projects</h2>
        <p className="text-gray-500 text-sm mt-1">Your favorite projects from the community</p>
      </div>

      {/* Projects Grid */}
      {savedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProjects.map((project) => (
            <a
              key={project.id}
              href={`/project/${project.id}`}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer"
            >
              {/* Screenshot */}
              <div className="aspect-video bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 flex items-center justify-center">
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
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    {project.likes} likes
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    View
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved projects yet</h3>
          <p className="text-gray-500 mb-6">Start exploring and save projects you love!</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0070f3] to-[#7928ca] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#0070f3]/25 transition-all"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
