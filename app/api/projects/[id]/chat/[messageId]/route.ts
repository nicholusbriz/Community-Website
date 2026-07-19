// app/api/projects/[id]/chat/[messageId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// GET /api/projects/[id]/chat/[messageId] - Get a specific chat message
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, messageId } = await params;

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

    const message = await prisma.projectMessage.findFirst({
      where: {
        id: messageId,
        projectId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error fetching message:', error);
    return handleAuthError(error);
  }
}

// PUT /api/projects/[id]/chat/[messageId] - Update a chat message
export async function PUT(
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
        { error: 'Content is required' },
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

    if (!membership) {
      return NextResponse.json(
        { error: 'You must be a project member to edit messages' },
        { status: 403 }
      );
    }

    // Get the message
    const message = await prisma.projectMessage.findFirst({
      where: {
        id: messageId,
        projectId: id,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Only the author can edit
    if (message.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the author can edit this message' },
        { status: 403 }
      );
    }

    const updatedMessage = await prisma.projectMessage.update({
      where: { id: messageId },
      data: {
        content: content.trim(),
        isEdited: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return handleAuthError(error);
  }
}

// DELETE /api/projects/[id]/chat/[messageId] - Delete a chat message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, messageId } = await params;

    // Verify user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'You must be a project member to delete messages' },
        { status: 403 }
      );
    }

    // Get the message
    const message = await prisma.projectMessage.findFirst({
      where: {
        id: messageId,
        projectId: id,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Only the author or project owner can delete
    const project = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (message.userId !== auth.userId && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the author or project owner can delete this message' },
        { status: 403 }
      );
    }

    // Check if message has replies - if so, soft delete or handle accordingly
    const repliesCount = await prisma.projectMessage.count({
      where: { parentId: messageId },
    });

    if (repliesCount > 0) {
      // Option 1: Soft delete - mark as deleted but keep replies
      await prisma.projectMessage.update({
        where: { id: messageId },
        data: {
          content: '[Message deleted]',
          isEdited: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Message content removed (replies preserved)',
      });
    }

    // No replies - hard delete
    await prisma.projectMessage.delete({
      where: { id: messageId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'MESSAGE_SENT',
        details: {
          action: 'MESSAGE_DELETED',
          messageId: messageId,
          deletedBy: auth.userId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return handleAuthError(error);
  }
}

// POST /api/projects/[id]/chat/[messageId] - Reply to a message
// Consolidated endpoint - replaces separate reply endpoint
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

    // Log activity with projectId
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

    // Optional: Notify the parent message author (if not the same person)
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