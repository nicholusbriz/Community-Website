// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserSafe } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    // ✅ Use getAuthUserSafe instead of getAuthUser to handle unauthenticated gracefully
    const auth = await getAuthUserSafe(request);
    
    // If not authenticated, return empty notifications
    if (!auth) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unread') === 'true';
    const type = searchParams.get('type');

    const where: any = { userId: auth.userId };
    if (unreadOnly) where.isRead = false;
    if (type) where.type = type;

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: auth.userId, isRead: false },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthUserSafe(request);
    
    // If not authenticated, return empty response
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: auth.userId, isRead: false },
        data: { isRead: true, updatedAt: new Date() },
      });
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, updatedAt: new Date() },
    });

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}