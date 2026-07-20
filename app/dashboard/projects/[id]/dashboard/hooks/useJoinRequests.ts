// app/lib/hooks/useJoinRequests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useProject } from '@/app/lib/hooks/useProjects'; // ✅ Fixed import path

// Get join requests for a project (only if user has permission)
export function useJoinRequests(projectId: string, status?: string) {
  const { user } = useAuth();
  const { data: projectData } = useProject(projectId);
  const project = projectData?.project;
  
  // Check if user is owner or lead
  const isOwner = project?.ownerId === user?.id;
  const isLead = project?.leads?.some((lead: any) => lead.userId === user?.id) || false;
  const canViewRequests = isOwner || isLead;
  
  const queryString = status && status !== 'ALL' ? `?status=${status}` : '';
  
  return useQuery({
    queryKey: ['join-requests', projectId, status],
    queryFn: async () => {
      // ✅ Only fetch if user has permission
      if (!canViewRequests) {
        return { requests: [] };
      }
      
      const response = await api.get(`/api/projects/${projectId}/requests${queryString}`);
      
      // ✅ Type guard to check if response has status property
      if (response && typeof response === 'object' && 'status' in response && response.status === 403) {
        return { requests: [] };
      }
      
      return response;
    },
    enabled: !!projectId && canViewRequests, // ✅ Only enable if user can view
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on 403 errors
      if (error?.status === 403 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Get pending join requests only
export function usePendingJoinRequests(projectId: string) {
  const { user } = useAuth();
  const { data: projectData } = useProject(projectId);
  const project = projectData?.project;
  
  const isOwner = project?.ownerId === user?.id;
  const isLead = project?.leads?.some((lead: any) => lead.userId === user?.id) || false;
  const canViewRequests = isOwner || isLead;

  return useQuery({
    queryKey: ['join-requests', projectId, 'PENDING'],
    queryFn: async () => {
      if (!canViewRequests) {
        return { requests: [] };
      }
      
      const response = await api.get(`/api/projects/${projectId}/requests?status=PENDING`);
      
      // ✅ Type guard to check if response has status property
      if (response && typeof response === 'object' && 'status' in response && response.status === 403) {
        return { requests: [] };
      }
      
      return response;
    },
    enabled: !!projectId && canViewRequests,
    staleTime: 30 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 403 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
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
      api.post(`/api/projects/${projectId}/requests`, data),
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
      api.delete(`/api/projects/${projectId}/requests/${requestId}`),
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
  const { user } = useAuth();
  const { data: projectData } = useProject(projectId);
  const project = projectData?.project;
  
  const isOwner = project?.ownerId === user?.id;
  const isLead = project?.leads?.some((lead: any) => lead.userId === user?.id) || false;
  const canViewRequests = isOwner || isLead;

  return useQuery({
    queryKey: ['join-request', projectId, requestId],
    queryFn: async () => {
      if (!canViewRequests) {
        return null;
      }
      const response = await api.get(`/api/projects/${projectId}/requests/${requestId}`);
      
      // ✅ Type guard to check if response has status property
      if (response && typeof response === 'object' && 'status' in response && response.status === 403) {
        return null;
      }
      
      return response;
    },
    enabled: !!projectId && !!requestId && canViewRequests,
    staleTime: 30 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 403 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}