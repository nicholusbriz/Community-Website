// app/admin/super/page.tsx
'use client'

import { useAuth } from '@/app/lib/auth/useAuth'

export default function SuperAdminPage() {
  const { user, isLoading, actions } = useAuth()
  const isSuperAdmin = actions.isSuperAdmin()
  const userRole = actions.getUserRole()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">
          Access Denied: You need SUPERADMIN role to view this page.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">SuperAdmin Dashboard</h1>
          <p className="text-gray-600">System-level administration and controls</p>
        </div>

        <div className="bg-purple-50 rounded-lg shadow p-6 mb-6 border-2 border-purple-200">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Your Role: SUPERADMIN</h2>
          <p className="text-gray-700 mb-4">
            You have full system access. Use these controls carefully as they affect the entire platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SuperAdmin functionality placeholders */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">User Role Management</h3>
            <p className="text-gray-600 text-sm">Assign and modify user roles (ADMIN, SUPERADMIN)</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
            <p className="text-gray-600 text-sm">Modify system-wide settings and configurations</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">Database Management</h3>
            <p className="text-gray-600 text-sm">Direct database operations and migrations</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">API Key Management</h3>
            <p className="text-gray-600 text-sm">Generate and manage API keys for integrations</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
            <p className="text-gray-600 text-sm">View comprehensive system audit logs</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">System Health</h3>
            <p className="text-gray-600 text-sm">Monitor system performance and health metrics</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold mb-2 text-red-700">Emergency Controls</h3>
            <p className="text-gray-600 text-sm">System shutdown and emergency procedures</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">Admin Oversight</h3>
            <p className="text-gray-600 text-sm">Monitor and manage admin user activities</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2">Feature Flags</h3>
            <p className="text-gray-600 text-sm">Enable/disable features across the platform</p>
          </div>
        </div>

        <div className="mt-8 bg-red-50 rounded-lg shadow p-6 border-2 border-red-200">
          <h3 className="text-lg font-semibold mb-2 text-red-700">⚠️ Warning</h3>
          <p className="text-gray-700 text-sm">
            Actions taken in this dashboard can have irreversible effects on the entire platform. 
            Please ensure you understand the implications before making changes.
          </p>
        </div>
      </div>
    </div>
  )
}
