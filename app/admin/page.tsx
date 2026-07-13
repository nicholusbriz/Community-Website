// app/admin/page.tsx
'use client'

import { useAuth } from '@/app/lib/auth/useAuth'

export default function AdminPage() {
  const { user, isLoading, actions } = useAuth()
  const isAdmin = actions.isAdmin()
  const userRole = actions.getUserRole()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">
          Access Denied: You need ADMIN or SUPERADMIN role to view this page.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Role: {userRole}</h2>
          <p className="text-gray-600 mb-4">
            Welcome to the admin dashboard. As an {userRole}, you have access to administrative functions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin functionality placeholders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">Manage user accounts and permissions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Content Moderation</h3>
            <p className="text-gray-600 text-sm">Review and moderate community content</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Project Approval</h3>
            <p className="text-gray-600 text-sm">Review and approve project submissions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Event Management</h3>
            <p className="text-gray-600 text-sm">Create and manage community events</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View community analytics and reports</p>
          </div>

          {userRole === 'SUPERADMIN' && (
            <div className="bg-purple-50 rounded-lg shadow p-6 border-2 border-purple-200">
              <h3 className="text-lg font-semibold mb-2 text-purple-700">SuperAdmin Panel</h3>
              <p className="text-gray-600 text-sm">Access to system-level controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
