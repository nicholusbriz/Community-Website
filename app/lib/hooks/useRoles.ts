// app/lib/hooks/useRoles.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/api/client'
import { Role } from '@prisma/client'

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/roles'),
    staleTime: 5 * 60 * 1000,
  })
}