// app/lib/notifications/types.ts
import type { Notification } from '@prisma/client';

export type NotificationWithProject = Notification & {
  project: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export interface NotificationsResponse {
  notifications: NotificationWithProject[];
  unreadCount: number;
}
