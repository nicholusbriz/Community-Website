// app/dashboard/notifications/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useNotifications } from '@/app/lib/hooks/useNotifications';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2,
  Bell,
  Check,
  CheckCircle,
  X,
  UserPlus,
  MessageSquare,
  Users,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { actions, isLoading: authLoading } = useAuth();
  const isAuthenticated = actions.isAuthenticated();
  const [filter, setFilter] = useState('ALL');

  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    refetch,
    markAsRead,
    markAllAsRead,
    isMarking,
    isMarkingAll
  } = useNotifications({ limit: 100 });

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/notifications');
    }
  }, [authLoading, isAuthenticated, router]);

  const filteredNotifications = filter === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const typeOptions = ['ALL', 'REQUEST', 'TASK', 'PROJECT', 'MENTION', 'SYSTEM'];

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST': return <UserPlus className="w-5 h-5 text-yellow-500" />;
      case 'TASK': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'PROJECT': return <Users className="w-5 h-5 text-purple-500" />;
      case 'MENTION': return <MessageSquare className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      REQUEST: 'Join Request',
      TASK: 'Task Update',
      PROJECT: 'Project Update',
      MENTION: 'Mention',
      SYSTEM: 'System',
    };
    return labels[type] || type;
  };

  // ✅ Fixed: Accept string or Date
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return d.toLocaleDateString();
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B2A56]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 text-sm mt-1">
              {unreadCount > 0 ? unreadCount + ' unread notifications' : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAll}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isMarkingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Mark all read
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (
                  filter === type
                    ? 'bg-[#1B2A56] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {type === 'ALL' ? 'All' : getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={'p-4 hover:bg-gray-50 transition-colors ' + (notification.isRead ? '' : 'bg-blue-50/30')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">
                            {getTypeLabel(notification.type)}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mt-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.project && (
                        <Link
                          href={'/projects/' + notification.project.slug}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                        >
                          View Project →
                        </Link>
                      )}
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block ml-3"
                        >
                          View Details →
                        </Link>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            disabled={isMarking}
                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                          >
                            {isMarking ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Mark as read'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}