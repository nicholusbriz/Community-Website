// app/lib/hooks/usePublicUser.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'

export interface PublicUser {
  id: string
  name: string | null
  username: string | null
  bio: string | null
  location: string | null
  skills: string[]
  github: string | null
  linkedin: string | null
  portfolio: string | null
  image: string | null
  email: string
  createdAt: string
  role: {
    name: string
  }
  _count: {
    projectsCreated: number
    projectsOwned: number
    memberships: number
  }
  projectsCreated: Array<{
    id: string
    title: string
    slug: string
    status: string
    createdAt: string
  }>
}

export interface PublicUserResponse {
  user: PublicUser
}

/**
 * Fetch a public user profile by username
 * 
 * Usage:
 * const { data, isLoading } = usePublicUser('johndoe')
 * console.log(data?.user.name)
 */
export function usePublicUser(username: string) {
  return useQuery<PublicUserResponse>({
    queryKey: ['public-user', username],
    queryFn: () => api.get(`/api/users/${username}`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}