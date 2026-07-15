// app/dashboard/profile/ui/ProfileSkeleton.tsx
'use client'

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="animate-pulse">
        {/* Back Button */}
        <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
        </div>

        {/* Profile Form Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-8 shadow-xl shadow-indigo-100/50">
          
          {/* Avatar Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-2xl bg-gray-200 dark:bg-gray-700 border-4 border-white"></div>
              <div className="flex flex-col gap-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>

          {/* Basic Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>

            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
          </div>
        </div>

        {/* Password Section Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mt-8 shadow-xl shadow-indigo-100/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                {i === 1 && (
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mt-2"></div>
                )}
              </div>
            ))}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}