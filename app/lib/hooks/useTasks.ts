// app/lib/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

// Get a single task by ID
export function useTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ['task', projectId, taskId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch task');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Update a task
export function useUpdateTask(projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => 
      api.put(`/api/projects/${projectId}/tasks/${taskId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update task:', error);
    },
  });
}

// Delete a task
export function useDeleteTask(projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`/api/projects/${projectId}/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to delete task:', error);
    },
  });
}

// Get all tasks for a project (with optional filters)
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

  const url = `/api/projects/${projectId}/tasks${queryString.toString() ? '?' + queryString.toString() : ''}`;

  return useQuery({
    queryKey: ['project-tasks', projectId, params],
    queryFn: () => api.get(url),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
}

// Create a new task
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post(`/api/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to create task:', error);
    },
  });
}