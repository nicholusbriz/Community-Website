// app/lib/hooks/useUsersDirectory.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'

export interface DeveloperUser {
  id: string
  name: string | null
  username: string | null
  bio: string | null
  location: string | null
  skills: string[]
  image: string | null
  role: {
    name: string
  }
  _count: {
    projectsCreated: number
    memberships: number
  }
  createdAt: string
  // ✅ Add projects for profile view
  projects?: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
  }>
  github?: string | null
  linkedin?: string | null
  portfolio?: string | null
  email?: string
}

export interface UsersDirectoryResponse {
  users: DeveloperUser[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PublicUserResponse {
  user: DeveloperUser
}

/**
 * Fetch all users for the developers directory (public)
 * 
 * Usage:
 * const { data, isLoading } = useUsersDirectory({ page: 1, search: 'john' })
 */
export function useUsersDirectory(params?: {
  page?: number
  limit?: number
  search?: string
}) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.search) queryString.append('search', params.search)
  
  const url = `/api/users${queryString.toString() ? '?' + queryString.toString() : ''}`
  
  return useQuery<UsersDirectoryResponse>({
    queryKey: ['users-directory', params],
    queryFn: () => api.get(url),
    staleTime: 60 * 1000,
  })
}

/**
 * Fetch a single user by ID (public)
 * 
 * Usage:
 * const { data, isLoading } = usePublicUser('user-id-here')
 */
export function usePublicUser(userId: string) {
  return useQuery<PublicUserResponse>({
    queryKey: ['public-user', userId],
    queryFn: () => api.get(`/api/users/${userId}`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch users by skill (public)
 * 
 * Usage:
 * const { data } = useUsersBySkill('React')
 */
export function useUsersBySkill(skill: string, params?: {
  page?: number
  limit?: number
}) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  queryString.append('skill', skill)
  
  const url = `/api/users${queryString.toString() ? '?' + queryString.toString() : ''}`
  
  return useQuery<UsersDirectoryResponse>({
    queryKey: ['users-by-skill', skill, params],
    queryFn: () => api.get(url),
    enabled: !!skill,
    staleTime: 60 * 1000,
  })
}

/**
 * Get total user count (public)
 * 
 * Usage:
 * const { data } = useUsersCount()
 */
export function useUsersCount() {
  return useQuery<{ total: number }>({
    queryKey: ['users-count'],
    queryFn: () => api.get('/api/users/count'),
    staleTime: 5 * 60 * 1000,
  })
}