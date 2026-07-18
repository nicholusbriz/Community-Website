import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

export function useActivities(projectId: string) {
  return useQuery({
    queryKey: ['activities', projectId],
    queryFn: () => api.get(`/api/projects/${projectId}/activity`),
    enabled: !!projectId,
    staleTime: 60 * 1000, // 1 minute
  });
}
