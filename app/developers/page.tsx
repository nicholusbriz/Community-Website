'use client'

import { useState } from 'react'
import { useUsersDirectory } from '@/app/lib/hooks/useUsersDirectory'
import Link from 'next/link'
import { 
  Search, 
  X, 
  Filter, 
  Users, 
  MapPin,
  FolderGit2,
  User,
  Shield,
  Crown,
  Code2,
  GitBranch,
  Link2,
  Globe,
  Briefcase,
  Award,
  Clock
} from 'lucide-react'

export default function DevelopersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const limit = 12

  const { data, isLoading, error, refetch } = useUsersDirectory({
    page,
    limit,
    search,
  })

  // Get role badge color
  const getRoleBadgeColor = (roleName: string) => {
    switch(roleName) {
      case 'SUPERADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'PROJECT_LEAD':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Get role icon
  const getRoleIcon = (roleName: string) => {
    switch(roleName) {
      case 'SUPERADMIN':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading developers...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-md mx-auto p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-xl text-center">
            <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Failed to Load Developers</h3>
            <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const users = data?.users || []
  const pagination = data?.pagination

  // Get unique skills from all users for filter
  const allSkills = users.flatMap(user => user.skills || [])
  const uniqueSkills = [...new Set(allSkills)]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Developers
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Connect with talented developers and collaborators
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search developers by name, username, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="sm:w-56 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all"
            >
              <option value="">All Skills</option>
              {uniqueSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{users.length}</span> of <span className="font-semibold text-gray-700 dark:text-gray-300">{pagination.total}</span> developers
            </span>
          </div>
        )}

        {/* Developer Grid */}
        {users.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
            <Users className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No developers found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {search ? `No results for "${search}"` : 'No developers match your filters'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <Link
                key={user.id}
                href={`/developers/${user.id}`}
                className="group block bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    {/* Online status indicator */}
                    {user.isActive && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1a1a1a]"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.name || 'Unknown User'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.name || 'USER')}`}>
                        {user.role?.name || 'USER'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.username ? `@${user.username}` : user.email}
                    </p>
                    
                    {user.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <FolderGit2 className="h-3 w-3" />
                        <span>{user._count?.projectsCreated || 0} projects</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="h-3 w-3" />
                        <span>{user._count?.memberships || 0} teams</span>
                      </div>
                    </div>
                    
                    {user.skills && user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {user.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                            +{user.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}