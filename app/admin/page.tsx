// app/admin/page.tsx
'use client'

import { useAuth } from '@/app/lib/auth/useAuth'
import { useUsers } from '@/app/lib/hooks/useUsers'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'
import Link from 'next/link'
import { Shield, Users, FolderGit2, BarChart, FileText, Settings } from 'lucide-react'

// Define response types
interface StatsResponse {
  total: number
}

interface UsersStatsResponse {
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function AdminPage() {
  const { user, isLoading, actions } = useAuth()
  const isAdmin = actions.isAdmin()
  const userRole = actions.getUserRole()

  // Fetch users for total count
  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 1,
  })

  // Fetch projects for total count
  const { data: projectsData, isLoading: projectsLoading } = useQuery<StatsResponse>({
    queryKey: ['admin-projects-stats'],
    queryFn: () => api.get('/api/admin/projects/stats'),
    staleTime: 60 * 1000,
  })

  // Fetch active projects count
  const { data: activeProjectsData, isLoading: activeProjectsLoading } = useQuery<StatsResponse>({
    queryKey: ['admin-projects-active-stats'],
    queryFn: () => api.get('/api/admin/projects/active-stats'),
    staleTime: 60 * 1000,
  })

  // Fetch reports count
  const { data: reportsData, isLoading: reportsLoading } = useQuery<StatsResponse>({
    queryKey: ['admin-reports-stats'],
    queryFn: () => api.get('/api/admin/reports/stats'),
    staleTime: 60 * 1000,
  })

  if (isLoading || usersLoading || projectsLoading || activeProjectsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-stone-500 dark:text-stone-400">Loading...</div>
      </div>
    )
  }

  // Get real stats from API
  const totalUsers = (usersData as UsersStatsResponse)?.pagination?.total || 0
  const totalProjects = projectsData?.total || 0
  const activeProjects = activeProjectsData?.total || 0
  const totalReports = reportsData?.total || 0

  const stats = [
    { 
      label: 'Total Users', 
      value: totalUsers.toString(), 
      icon: Users, 
      color: 'blue',
      href: '/admin/users'
    },
    { 
      label: 'Total Projects', 
      value: totalProjects.toString(), 
      icon: FolderGit2, 
      color: 'green',
      href: '/admin/projects'
    },
    { 
      label: 'Active Projects', 
      value: activeProjects.toString(), 
      icon: BarChart, 
      color: 'purple',
      href: '/admin/projects?status=active'
    },
    { 
      label: 'Reports', 
      value: totalReports.toString(), 
      icon: FileText, 
      color: 'orange',
      href: '/admin/reports'
    },
  ]

  const adminLinks = [
    { href: '/admin/users', label: 'User Management', icon: Users, description: 'Manage users and roles' },
    { href: '/admin/projects', label: 'Project Management', icon: FolderGit2, description: 'Manage all projects' },
    { href: '/admin/projects/analytics', label: 'Analytics', icon: BarChart, description: 'View platform analytics' },
    { href: '/admin/reports', label: 'Reports', icon: FileText, description: 'Generate reports' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#1B2A56] dark:text-[#8CA0DE]" />
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-stone-500 dark:text-stone-400">
              Welcome back, {user?.name || 'Admin'}! You are logged in as <span className="font-medium">{userRole}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
          }
          return (
            <Link
              key={stat.label}
              href={stat.href || '#'}
              className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-4 hover:shadow-md hover:border-[#1B2A56]/30 dark:hover:border-[#8CA0DE]/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Admin Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10 p-6 hover:shadow-md hover:border-[#1B2A56]/30 dark:hover:border-[#8CA0DE]/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#1B2A56]/10 dark:bg-[#8CA0DE]/10 rounded-lg group-hover:bg-[#1B2A56]/20 dark:group-hover:bg-[#8CA0DE]/20 transition-colors">
                  <Icon className="h-5 w-5 text-[#1B2A56] dark:text-[#8CA0DE]" />
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  {link.label}
                </h3>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {link.description}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Super Admin Only Section */}
      {userRole === 'SUPERADMIN' && (
        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">
              Super Admin Access
            </h3>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            You have full system access. Visit the{' '}
            <Link href="/super" className="font-medium underline hover:text-purple-800 dark:hover:text-purple-200">
              Super Admin Panel
            </Link>
            {' '}for system-level controls.
          </p>
        </div>
      )}
    </div>
  )
}