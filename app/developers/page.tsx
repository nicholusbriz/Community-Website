// app/developers/page.tsx
'use client'

import { useState } from 'react'
import { useUsersDirectory } from '@/app/lib/hooks/useUsersDirectory'
import Link from 'next/link'
import { 
  Search, 
  X, 
  Filter, 
  Users, 
  Database, 
  Table,
  MapPin,
  FolderGit2,
  User,
  Shield,
  Crown,
  Code2,
  Star,
  ArrowRight,
  GitBranch,
  Link2,
  Globe
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-stone-500 dark:text-stone-400">Loading developers...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Error loading developers: {error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const users = data?.users || []
  const pagination = data?.pagination

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-[#1B2A56] dark:text-[#8CA0DE]" />
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Developers
            </h1>
            <p className="text-stone-500 dark:text-stone-400">
              Connect with talented developers in the community
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            Live Data: users table
          </span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">GET /api/users</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="Search developers by name, username, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1e1e1e] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 dark:focus:ring-[#8CA0DE]/30 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-stone-100 dark:hover:bg-white/5 text-stone-400 dark:text-stone-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="sm:w-48 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#1e1e1e] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white appearance-none"
          >
            <option value="">All Skills</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Next.js">Next.js</option>
            <option value="Tailwind CSS">Tailwind CSS</option>
            <option value="Docker">Docker</option>
            <option value="AWS">AWS</option>
            <option value="MongoDB">MongoDB</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="Prisma">Prisma</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {pagination && (
        <div className="flex items-center gap-2 mb-4">
          <Table className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Showing {users.length} of {pagination.total} developers
          </span>
        </div>
      )}

      {/* Developer Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10">
          <Users className="h-12 w-12 text-stone-400 dark:text-stone-500 mx-auto mb-3" />
          <p className="text-stone-500 dark:text-stone-400">No developers found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-[#1B2A56] dark:text-[#8CA0DE] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => (
            <Link
              key={user.id}
              // ✅ Use ID for the URL
              href={`/developers/${user.id}`}
              className="group block bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6 hover:shadow-md hover:border-[#1B2A56]/30 dark:hover:border-[#8CA0DE]/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B0F1A] via-[#16223F] to-[#1B2A56] text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-stone-900 dark:text-white truncate">
                      {user.name || 'Unknown User'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.name || 'USER')}`}>
                      {user.role?.name || 'USER'}
                    </span>
                  </div>
                  
                  {/* ✅ Show username if available, otherwise show email */}
                  <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                    {user.username ? `@${user.username}` : user.email}
                  </p>
                  
                  {user.bio && (
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-stone-400 dark:text-stone-500">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <FolderGit2 className="h-3 w-3" />
                      {user._count?.projectsCreated || 0} projects
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <Users className="h-3 w-3" />
                      {user._count?.memberships || 0} memberships
                    </div>
                  </div>
                  
                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {user.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8] rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-full text-xs">
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
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Data Source: users table</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">GET /api/users/count</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 disabled:opacity-50 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-stone-600 dark:text-stone-300">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 disabled:opacity-50 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}