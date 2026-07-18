// app/lib/hooks/useGroups.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'

export interface Group {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  projectCount: number
}

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.get<{ groups: Group[] }>('/api/groups')
      // ✅ Return the groups array directly
      return response.groups || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}