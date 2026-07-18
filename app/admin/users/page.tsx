// app/admin/users/page.tsx
'use client'

import { useState } from 'react'
import { useUsers, useRoles, useUpdateUserRole, useDeleteUser } from '@/app/lib/hooks/useUsers'
import { useAuth } from '@/app/lib/auth/useAuth'
import { Search, ChevronLeft, ChevronRight, X, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const limit = 10
  
  const { actions } = useAuth()
  const isSuperAdmin = actions.isSuperAdmin()
  const userRole = actions.getUserRole()
  
  const { data, isLoading, error, refetch } = useUsers({
    page,
    limit,
    search,
    role: roleFilter,
  })
  
  const { data: roles } = useRoles()
  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()
  
  const handleRoleUpdate = async (userId: string, roleId: string) => {
    try {
      await updateRole.mutateAsync({ userId, roleId })
      setShowRoleModal(false)
      refetch()
    } catch (error: any) {
      // Error is already handled in the mutation
      console.error('Role update error:', error)
    }
  }
  
  const handleDelete = async (userId: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    setDeleteLoading(userId)
    try {
      await deleteUser.mutateAsync(userId)
    } catch (error: any) {
      // Error is already handled in the mutation
      console.error('Delete error:', error)
    } finally {
      setDeleteLoading(null)
    }
  }
  
  const getRoleBadgeColor = (roleName: string) => {
    switch(roleName) {
      case 'SUPERADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      // PROJECT_LEAD removed - now managed at project level
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  
  // Filter roles to exclude PROJECT_LEAD
  const getAvailableRoles = () => {
    if (!roles) return []
    
    return roles.filter((role: any) => {
      // Exclude PROJECT_LEAD from global role assignment
      if (role.name === 'PROJECT_LEAD') return false
      
      // If not superadmin, also exclude SUPERADMIN
      if (!isSuperAdmin && role.name === 'SUPERADMIN') return false
      
      return true
    })
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 dark:text-stone-400">Loading users...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Error: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }
  
  const users = data?.users || []
  const pagination = data?.pagination
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          User Management
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Manage all users, roles, and permissions
        </p>
        <div className="flex items-center gap-3 mt-1">
          {isSuperAdmin && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
              🔒 Super Admin Access
            </span>
          )}
          {userRole === 'ADMIN' && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              🛡️ Admin Access (Can promote/demote, cannot delete)
            </span>
          )}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
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
        
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 text-stone-900 dark:text-white min-w-[140px]"
          >
            <option value="">All Roles</option>
            <option value="USER">👤 USER</option>
            {/* PROJECT_LEAD removed from global role filter */}
            <option value="ADMIN">🛡️ ADMIN</option>
            <option value="SUPERADMIN">🔒 SUPERADMIN</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#1e1e1e] rounded-lg border border-stone-200 dark:border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5">
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">Projects</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500 dark:text-stone-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-500 dark:text-stone-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-b border-stone-100 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/developers/${user.username || user.id}`} className="flex items-center gap-3 hover:underline">
                      <div className="w-8 h-8 rounded-full bg-[#1B2A56] text-white flex items-center justify-center text-sm font-medium">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-stone-900 dark:text-white">
                        {user.name || 'Unknown User'}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-300 text-sm">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.name)}`}>
                      {user.role?.name || 'USER'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-300 text-sm">
                    {user._count?.projectsCreated || 0}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-300 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowRoleModal(true)
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        Edit Role
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-3 w-3" />
                          {deleteLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.total)} of {pagination.total} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-stone-600 dark:text-stone-300">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRoleModal(false)}>
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                Edit User Role
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5 text-stone-500 dark:text-stone-400" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">User</p>
              <p className="font-medium text-stone-900 dark:text-white">
                {selectedUser.name || selectedUser.email}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Current Role: <span className="font-medium text-stone-700 dark:text-stone-300">{selectedUser.role?.name || 'USER'}</span>
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Select New Role
              </label>
              
              {selectedUser.role?.name === 'SUPERADMIN' && !isSuperAdmin ? (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                    <span>🔒</span>
                    This user is a <strong>SUPERADMIN</strong>. Only Super Admins can modify their role.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedUser.roleId || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, roleId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-white/10 rounded-lg bg-white dark:bg-[#2d2d2d] text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30"
                >
                  <option value="">Select a role...</option>
                  {getAvailableRoles().map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.name === 'SUPERADMIN' ? '🔒' : ''}
                    </option>
                  ))}
                </select>
              )}
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> PROJECT_LEAD role is now managed at the project level by project owners.
                  You can only assign system-level roles here (USER, ADMIN, SUPERADMIN).
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUser.roleId && selectedUser.roleId !== selectedUser.role?.id) {
                    handleRoleUpdate(selectedUser.id, selectedUser.roleId)
                  } else {
                    setShowRoleModal(false)
                  }
                }}
                disabled={
                  updateRole.isPending || 
                  !selectedUser.roleId || 
                  selectedUser.roleId === selectedUser.role?.id || 
                  (selectedUser.role?.name === 'SUPERADMIN' && !isSuperAdmin)
                }
                className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateRole.isPending ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}