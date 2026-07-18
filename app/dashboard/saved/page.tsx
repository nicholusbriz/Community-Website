'use client';

import { Heart, ArrowRight, FolderGit2 } from 'lucide-react';
import Link from 'next/link';

export default function SavedProjectsPage() {
  // Saved projects will be fetched from the API
  // Currently empty - users can save projects from the explore page

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Projects</h1>
        <p className="text-gray-600 mt-1">Your favorite projects from the community</p>
      </div>

      {/* Empty State */}
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
    </div>
  );
}