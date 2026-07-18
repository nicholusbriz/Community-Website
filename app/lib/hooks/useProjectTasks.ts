// app/lib/hooks/useProjectTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

export function useProjectTasks(projectId: string, params?: {
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}) {
  const queryString = new URLSearchParams();
  if (params?.search) queryString.append('search', params.search);
  if (params?.status) queryString.append('status', params.status);
  if (params?.priority) queryString.append('priority', params.priority);
  if (params?.assignee) queryString.append('assignee', params.assignee);

  const url = '/api/projects/' + projectId + '/tasks' + (queryString.toString() ? '?' + queryString.toString() : '');

  return useQuery({
    queryKey: ['project-tasks', projectId, params],
    queryFn: () => api.get(url),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ Fix: Accept data as argument
    mutationFn: (data: any) => {
      return api.post('/api/projects/' + projectId + '/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      api.put('/api/projects/' + projectId + '/tasks/' + taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => api.delete('/api/projects/' + projectId + '/tasks/' + taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    },
  });
}