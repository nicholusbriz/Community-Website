import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

export function useAnalytics(projectId: string) {
  return useQuery({
    queryKey: ['analytics', projectId],
    queryFn: () => api.get(`/api/projects/${projectId}/analytics`),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
