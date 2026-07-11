'use client';

export default function ProjectsComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">All Projects</h2>
        <button className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/25">
          + New Project
        </button>
      </div>

      {/* Placeholder content */}
      <div className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#A78BFA]">Projects Placeholder</h3>
          <p className="text-gray-400">
            All projects will be displayed here. This component will show the complete list of community projects with their details, status, and management options.
          </p>
        </div>
      </div>

      {/* Sample project cards (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-6 hover:border-[#8B5CF6]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#A78BFA] text-xs rounded-full">
                Active
              </span>
              <span className="text-gray-500 text-sm">Project #{i}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-[#A78BFA] transition-colors">
              Sample Project {i}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              This is a placeholder for project description. Real project data will be displayed here.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>👥 5 members</span>
              <span>•</span>
              <span>📅 Due soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
