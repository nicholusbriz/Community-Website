// app/lib/hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

// Get all members for a project (including owner and leads)
export function useMembers(projectId: string) {
  return useQuery({
    queryKey: ['members', projectId],
    queryFn: () => api.get(`/api/projects/${projectId}/members`),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ✅ REMOVED: useAddMember - Members are now added through join requests only
// Members can only join via the join requests system

// Remove a member from a project
export function useRemoveMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => 
      api.delete(`/api/projects/${projectId}/members?userId=${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to remove member:', error);
    },
  });
}

// ✅ NEW: Make a member a project lead
export function useMakeProjectLead(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => 
      api.patch(`/api/projects/${projectId}/members/${userId}/make-lead`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to make project lead:', error);
    },
  });
}

// ✅ NEW: Remove a member from project lead
export function useRemoveProjectLead(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => 
      api.delete(`/api/projects/${projectId}/members/${userId}/make-lead`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to remove project lead:', error);
    },
  });
}

// ✅ NEW: Get project leads (if needed separately)
export function useProjectLeads(projectId: string) {
  return useQuery({
    queryKey: ['project-leads', projectId],
    queryFn: () => api.get(`/api/projects/${projectId}/leads`),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}