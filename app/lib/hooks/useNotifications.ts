// app/lib/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';
import { useAuth } from '@/app/lib/auth/useAuth';
// ✅ Import Prisma types directly
import type { Notification } from '@prisma/client';

// ✅ Only create a type for the API response structure
// This extends Prisma's Notification type with the relation
type NotificationWithProject = Notification & {
  project: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

// ✅ Only create a type for the API response wrapper
interface NotificationsResponse {
  notifications: NotificationWithProject[];
  unreadCount: number;
}

export function useNotifications(params?: {
  limit?: number;
  unread?: boolean;
  type?: string;
}) {
  const queryClient = useQueryClient();
  const { status } = useAuth();
  const isAuthenticated = status === 'authenticated';

  const queryString = new URLSearchParams();
  if (params?.limit) queryString.append('limit', params.limit.toString());
  if (params?.unread) queryString.append('unread', 'true');
  if (params?.type) queryString.append('type', params.type);

  const url = '/api/notifications' + (queryString.toString() ? '?' + queryString.toString() : '');

  // ✅ Type the query response
  const { data, isLoading, error, refetch } = useQuery<NotificationsResponse>({
    queryKey: ['notifications', params],
    queryFn: () => api.get(url),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchInterval: isAuthenticated ? 10000 : false,
  });

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) =>
      api.put('/api/notifications', { notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () =>
      api.put('/api/notifications', { markAll: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    error,
    refetch,
    markAsRead: markAsRead.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync,
    isMarking: markAsRead.isPending,
    isMarkingAll: markAllAsRead.isPending,
  };
}