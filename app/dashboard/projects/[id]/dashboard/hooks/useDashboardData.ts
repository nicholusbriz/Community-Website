// hooks/useDashboardData.ts
import { useProject } from '@/app/lib/hooks/useProjects';
import { useAnalytics } from './useAnalytics';
import { useMembers } from './useMembers';
import { useJoinRequests } from './useJoinRequests';
import { useActivities } from './useActivities';
import { useProjectChat } from '@/app/lib/hooks/useProjectChat';
import { useCallback } from 'react';

// Import Prisma types
import type { User, JoinRequest, ProjectMember, Task } from '@prisma/client';

// ✅ Updated interface - removed projectType and visibility
interface ProjectWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  goals: string[];
  maxTeamSize: number;
  currentMembers: number;
  status: string;
  difficulty: string;
  // ✅ REMOVED: projectType
  // ✅ REMOVED: visibility
  // ✅ REMOVED: screenshots
  duration: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  requirements: string | null;
  learningOutcomes: string[];
  groupId: string | null;
  createdById: string;
  ownerId: string;
  isVerified: boolean;
  isFeatured: boolean;
  isArchived: boolean;
  views: number;
  joinCount: number;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date | null;
  endDate: Date | null;
  completedAt: Date | null;
  group: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    icon: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  members?: Array<{
    userId: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  leads?: Array<{
    userId: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
    assignedToId: string | null;
    assignedTo?: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
    dueDate: Date | null;
    description: string | null;
    priority: string;
    labels: string[];
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
  }>;
  _count?: {
    members: number;
    tasks: number;
    joinRequests: number;
  };
}

interface MemberWithUser {
  userId: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'skills'>;
  role?: string;
  tasksCompleted?: number;
}

interface JoinRequestWithUser extends JoinRequest {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  reviewedBy?: Pick<User, 'id' | 'name' | 'email'> | null;
}

interface ActivityWithUser {
  id: string;
  action: string;
  details: any;
  createdAt: Date;
  user: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
}

interface ChatMessageWithUser {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  parentId: string | null;
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  parent?: ChatMessageWithUser | null;
}

// Define the dashboard data structure
interface DashboardData {
  project: ProjectWithRelations | null;
  analytics: {
    taskStats: Array<{ status: string; _count: number }>;
    recentActivity: any[];
  };
  members: MemberWithUser[];
  owner: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
  joinRequests: JoinRequestWithUser[];
  activities: ActivityWithUser[];
  chat: {
    messages: ChatMessageWithUser[];
    isLoading: boolean;
  };
}

export function useDashboardData(projectId: string) {
  // Fetch all data using React Query hooks
  const project = useProject(projectId);
  const analytics = useAnalytics(projectId);
  const members = useMembers(projectId);
  const joinRequests = useJoinRequests(projectId);
  const activities = useActivities(projectId);
  const chat = useProjectChat(projectId);

  // Combine loading states
  const isLoading = 
    project.isLoading || 
    analytics.isLoading || 
    members.isLoading || 
    joinRequests.isLoading || 
    activities.isLoading ||
    chat.isLoading;

  // Combine errors
  const error = project.error || analytics.error || members.error || joinRequests.error || activities.error || chat.error;

  // Combined data with proper fallbacks
  const data: DashboardData = {
    project: (project.data?.project as ProjectWithRelations) || null,
    analytics: {
      taskStats: (analytics.data as any)?.taskStats || [],
      recentActivity: (analytics.data as any)?.recentActivity || [],
    },
    members: (members.data as any)?.members || [],
    owner: (members.data as any)?.owner || null,
    joinRequests: (joinRequests.data as any)?.joinRequests || [],
    activities: (activities.data as any)?.activities || [],
    chat: {
      messages: (chat.data as any)?.messages || [],
      isLoading: chat.isLoading || false,
    },
  };

  // Refresh all data
  const refetch = useCallback(() => {
    project.refetch();
    analytics.refetch();
    members.refetch();
    joinRequests.refetch();
    activities.refetch();
  }, [project, analytics, members, joinRequests, activities]);

  // ✅ REMOVED: addMember function - members are now added only through join requests

  // Remove member function
  const removeMember = useCallback(async (userId: string) => {
    const response = await fetch(`/api/projects/${projectId}/members?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove member');
    }

    // Refetch data
    members.refetch();
    analytics.refetch();
  }, [projectId, members, analytics]);

  // ✅ Make project lead function
  const makeProjectLead = useCallback(async (userId: string) => {
    const response = await fetch(`/api/projects/${projectId}/members/${userId}/make-lead`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to make user a project lead');
    }

    // Refetch data to reflect the new role
    members.refetch();
    analytics.refetch();
    
    return await response.json();
  }, [projectId, members, analytics]);

  // ✅ Remove project lead function (NEW)
  const removeProjectLead = useCallback(async (userId: string) => {
    const response = await fetch(`/api/projects/${projectId}/members/${userId}/make-lead`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove user from project lead');
    }

    // Refetch data to reflect the role change
    members.refetch();
    analytics.refetch();
    
    return await response.json();
  }, [projectId, members, analytics]);

  // Mutations for join requests - ✅ Updated endpoints
  const approveRequest = useCallback(async (requestId: string) => {
    const response = await fetch(`/api/projects/${projectId}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve request');
    }

    // Refetch data
    joinRequests.refetch();
    members.refetch();
    analytics.refetch();
  }, [projectId, joinRequests, members, analytics]);

  const rejectRequest = useCallback(async (requestId: string, reason?: string) => {
    const response = await fetch(`/api/projects/${projectId}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject request');
    }

    // Refetch data
    joinRequests.refetch();
  }, [projectId, joinRequests]);

  // Chat functions
  const sendMessage = useCallback(
    async (content: string) => {
      return await (chat.sendMessage as any)({ content });
    },
    [chat]
  );

  const sendReply = useCallback(
    async (content: string, parentId: string) => {
      return await (chat.sendReply as any)({ content, parentId });
    },
    [chat]
  );

  return {
    data,
    isLoading,
    error,
    refetch,
    // REMOVED: addMember - members are added through join requests only
    removeMember,
    makeProjectLead, // Make a member a project lead
    removeProjectLead, // Remove a member from project lead
    approveRequest,
    rejectRequest,
    sendMessage,
    sendReply,
  };
}