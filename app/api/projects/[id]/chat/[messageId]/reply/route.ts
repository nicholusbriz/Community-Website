// app/api/projects/[id]/chat/[messageId]/reply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// POST /api/projects/[id]/chat/[messageId]/reply - Reply to a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, messageId } = await params;
    const body = await request.json();
    const { content } = body;

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
      select: { ownerId: true, title: true },
    });

    if (!membership && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to reply to messages' },
        { status: 403 }
      );
    }

    // Check if parent message exists and get the author
    const parentMessage = await prisma.projectMessage.findUnique({
      where: { id: messageId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!parentMessage || parentMessage.projectId !== id) {
      return NextResponse.json(
        { error: 'Parent message not found' },
        { status: 404 }
      );
    }

    const reply = await prisma.projectMessage.create({
      data: {
        content: content.trim(),
        projectId: id,
        userId: auth.userId,
        parentId: messageId,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        parent: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    // ✅ Log activity with projectId
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'MESSAGE_SENT',
        details: { 
          messageId: reply.id, 
          parentId: messageId,
          isReply: true,
        },
      },
    });

    // ✅ Optional: Notify the parent message author (if not the same person)
    if (parentMessage.userId !== auth.userId) {
      await prisma.notification.create({
        data: {
          userId: parentMessage.userId,
          projectId: id,
          title: 'New Reply to Your Message',
          message: `${auth.user.name || 'Someone'} replied to your message: "${content.slice(0, 50)}${content.length > 50 ? '...' : ''}"`,
          type: 'MENTION',
          link: `/dashboard/projects/${id}/chat`,
        },
      });
    }

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error('Error replying to message:', error);
    return handleAuthError(error);
  }
}