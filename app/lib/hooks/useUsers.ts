// app/lib/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'
import { User, Role } from '@prisma/client'

// Extend Prisma User type with additional fields from the API
interface UserWithRelations extends User {
  role: Role
  _count?: {
    projectsCreated: number
    projectsOwned: number
    memberships: number
  }
  projects?: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
  }>
}

export interface UsersResponse {
  users: UserWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface UserResponse {
  user: UserWithRelations
}

// ─── ADMIN QUERIES ─────────────────────────────────────────────

/**
 * Fetch all users for admin panel
 * Requires ADMIN or SUPERADMIN role
 */
export function useUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
}) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.search) queryString.append('search', params.search)
  if (params?.role) queryString.append('role', params.role)
  
  const url = `/api/admin/users${queryString.toString() ? '?' + queryString.toString() : ''}`
  
  return useQuery<UsersResponse>({
    queryKey: ['admin-users', params],
    queryFn: () => api.get(url),
    staleTime: 60 * 1000,
  })
}

/**
 * Fetch a single user for admin panel
 * Requires ADMIN or SUPERADMIN role
 */
export function useAdminUser(userId: string) {
  return useQuery<UserResponse>({
    queryKey: ['admin-user', userId],
    queryFn: () => api.get(`/api/admin/users/${userId}`),
    enabled: !!userId,
  })
}

/**
 * Fetch all available roles for admin panel
 * Requires ADMIN or SUPERADMIN role
 */
export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/admin/roles'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ─── ADMIN MUTATIONS ───────────────────────────────────────────

/**
 * Update a user's role
 * Requires ADMIN or SUPERADMIN role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      api.put('/api/admin/users/role', { userId, roleId }),
    
    onMutate: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] })
      
      const previousUsers = queryClient.getQueryData(['admin-users'])
      
      queryClient.setQueryData(['admin-users'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          users: old.users?.map((user: any) =>
            user.id === userId ? { ...user, roleId } : user
          )
        }
      })
      
      return { previousUsers }
    },
    
    onError: (err: any, variables: any, context: any) => {
      // Your API client throws errors with message property
      const errorMessage = err?.message || 'Unknown error'
      
      // Check for PROJECT_LEAD error (you might want to check the error message)
      if (errorMessage.includes('PROJECT_LEAD') || errorMessage.includes('project level')) {
        alert('⚠️ PROJECT_LEAD role cannot be assigned globally. It is managed at the project level by project owners.')
      } else if (errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
        alert('⚠️ You do not have permission to perform this action.')
      } else {
        alert(`❌ Failed to update role: ${errorMessage}`)
      }
      
      queryClient.setQueryData(['admin-users'], context?.previousUsers)
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

/**
 * Delete a user (soft delete)
 * Requires SUPERADMIN role
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`/api/admin/users/${userId}`),
    
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] })
      
      const previousData = queryClient.getQueryData(['admin-users'])
      
      queryClient.setQueryData(['admin-users'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          users: old.users?.filter((user: any) => user.id !== userId),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          }
        }
      })
      
      return { previousData }
    },
    
    onError: (error: any, userId: string, context: any) => {
      const errorMessage = error?.message || 'Unknown error'
      
      if (errorMessage.includes('403') || errorMessage.includes('SUPERADMIN')) {
        alert('⚠️ Only SUPERADMIN can delete users. Please contact your system administrator.')
      } else if (errorMessage.includes('cannot delete your own account')) {
        alert('⚠️ You cannot delete your own account.')
      } else {
        alert(`❌ Failed to delete user: ${errorMessage}`)
      }
      
      queryClient.setQueryData(['admin-users'], context?.previousData)
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    
    onSuccess: (_data: any, userId: string) => {
      console.log(`✅ User ${userId} deleted successfully`)
    },
  })
}

/**
 * Update user profile (own profile)
 * Requires authentication
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => api.put('/api/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}