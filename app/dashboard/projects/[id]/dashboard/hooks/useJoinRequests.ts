// app/lib/hooks/useJoinRequests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

// Get join requests for a project
export function useJoinRequests(projectId: string, status?: string) {
  const queryString = status && status !== 'ALL' ? `?status=${status}` : '';
  
  return useQuery({
    queryKey: ['join-requests', projectId, status],
    queryFn: () => api.get(`/api/projects/${projectId}/join-requests${queryString}`),
    enabled: !!projectId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get pending join requests only
export function usePendingJoinRequests(projectId: string) {
  return useJoinRequests(projectId, 'PENDING');
}

// Approve a join request
export function useApproveJoinRequest(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      api.put(`/api/projects/${projectId}/requests/${requestId}`, { status: 'APPROVED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', projectId] });
      queryClient.invalidateQueries({ queryKey: ['members', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to approve join request:', error);
    },
  });
}

// Reject a join request
export function useRejectJoinRequest(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      api.put(`/api/projects/${projectId}/requests/${requestId}`, { status: 'REJECTED', rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to reject join request:', error);
    },
  });
}

// Create a join request (user requests to join)
export function useCreateJoinRequest(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { message?: string; skills?: string[]; experience?: string }) => 
      api.post(`/api/projects/${projectId}/join-requests`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to create join request:', error);
    },
  });
}

// Delete/Cancel a join request
export function useCancelJoinRequest(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => 
      api.delete(`/api/projects/${projectId}/join-requests/${requestId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', projectId] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to cancel join request:', error);
    },
  });
}

// Get a single join request
export function useJoinRequest(projectId: string, requestId: string) {
  return useQuery({
    queryKey: ['join-request', projectId, requestId],
    queryFn: () => api.get(`/api/projects/${projectId}/join-requests/${requestId}`),
    enabled: !!projectId && !!requestId,
    staleTime: 30 * 1000,
  });
}