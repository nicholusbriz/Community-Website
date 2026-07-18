// app/lib/hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'
import type { Project, ProjectStatus, Difficulty } from '@prisma/client'

// ✅ Extend Prisma's Project type with relations and counts
export type ProjectWithRelations = Project & {
  group: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  } | null
  createdBy: {
    id: string
    name: string | null
    image: string | null
  } | null
  owner: {
    id: string
    name: string | null
    image: string | null
  } | null
  members?: Array<{
    userId: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }>
  leads?: Array<{
    userId: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }>
  tasks?: Array<{
    id: string
    title: string
    status: string
    assignedToId: string | null
  }>
  _count?: {
    members: number
    tasks: number
    joinRequests: number
  }
}

export interface ProjectResponse {
  project: ProjectWithRelations
}

export interface ProjectsResponse {
  projects: ProjectWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Get a single project by ID
export function useProject(id: string) {
  return useQuery<ProjectResponse>({
    queryKey: ['project', id],
    queryFn: () => api.get(`/api/projects/${id}`),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

// Get projects with pagination and filters
export function useProjects(params?: {
  page?: number
  limit?: number
  status?: ProjectStatus
  groupId?: string
  search?: string
  difficulty?: Difficulty
}) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.groupId) queryString.append('groupId', params.groupId)
  if (params?.search) queryString.append('search', params.search)
  if (params?.difficulty) queryString.append('difficulty', params.difficulty)
  
  const url = `/api/projects${queryString.toString() ? '?' + queryString.toString() : ''}`
  
  return useQuery<ProjectsResponse>({
    queryKey: ['projects', params],
    queryFn: () => api.get(url),
    staleTime: 60 * 1000,
  })
}

// Create a new project
export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => {
      console.log('📤 Creating project with data:', data)
      return api.post('/api/projects', data)
    },
    onSuccess: (data) => {
      console.log('✅ Project created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      console.error('❌ Failed to create project:', error)
    },
  })
}

// Update a project by ID
export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      console.log('📤 Updating project:', id, data)
      return api.put(`/api/projects/${id}`, data)
    },
    onSuccess: (data, variables) => {
      console.log('✅ Project updated successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      console.error('❌ Failed to update project:', error)
    },
  })
}

// Delete a project by ID
export function useDeleteProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('📤 Deleting project:', id)
      return api.delete(`/api/projects/${id}`)
    },
    onSuccess: (_, id) => {
      console.log('✅ Project deleted successfully:', id)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      console.error('❌ Failed to delete project:', error)
    },
  })
}