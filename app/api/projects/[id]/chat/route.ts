// app/api/projects/[id]/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { notifyNewMessage } from '@/app/lib/notifications/helpers';

// GET /api/projects/[id]/chat - Get all chat messages for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    // Verify user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    const project = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!membership && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to view messages' },
        { status: 403 }
      );
    }

    const where: any = { projectId: id, parentId: null };
    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    const messages = await prisma.projectMessage.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return handleAuthError(error);
  }
}

// POST /api/projects/[id]/chat - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    const project = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!membership && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to send messages' },
        { status: 403 }
      );
    }

    // If replying, verify parent message exists
    if (parentId) {
      const parentMessage = await prisma.projectMessage.findUnique({
        where: { id: parentId },
      });

      if (!parentMessage || parentMessage.projectId !== id) {
        return NextResponse.json(
          { error: 'Parent message not found' },
          { status: 404 }
        );
      }
    }

    // Get sender info for notification
    const sender = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { name: true },
    });

    const message = await prisma.projectMessage.create({
      data: {
        content: content.trim(),
        projectId: id,
        userId: auth.userId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // ✅ Send notification to all project members except the sender
    // Get all project members except the sender
    const members = await prisma.projectMember.findMany({
      where: {
        projectId: id,
        userId: { not: auth.userId },
      },
      select: { userId: true },
    });

    // Send notification to each member
    if (members.length > 0) {
      await notifyNewMessage(
        id,
        auth.userId,
        sender?.name || 'A user',
        content,
        parentId || undefined
      );
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'MESSAGE_SENT',
        details: { messageId: message.id },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return handleAuthError(error);
  }
}