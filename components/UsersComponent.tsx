'use client';

export default function UsersComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">Project Owners</h2>
        <button className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/25">
          + Add User
        </button>
      </div>

      {/* Placeholder content */}
      <div className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#A78BFA]">Users Placeholder</h3>
          <p className="text-gray-400">
            All project owners will be displayed here. This component will show the complete list of users who own projects with their profiles and contact information.
          </p>
        </div>
      </div>

      {/* Sample user cards (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-6 hover:border-[#8B5CF6]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-[#A78BFA] transition-colors">
                  User {i}
                </h3>
                <p className="text-gray-500 text-sm">Project Owner</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              This is a placeholder for user description. Real user data will be displayed here.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📋 {i + 2} projects</span>
              <span>•</span>
              <span>✓ Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
