import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getAuthUser } from '@/app/lib/auth/api-utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, taskId } = await params;
    
    console.log('Fetching task:', { id, taskId });

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
        { error: 'You must be a project member to view tasks' },
        { status: 403 }
      );
    }

    // First check if the task exists
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: id, // Make sure it belongs to the project
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        // ✅ REMOVED: comments relation since TaskComment was removed
        // Task discussions are now handled at the project level via ProjectMessage
      },
    });

    if (!task) {
      console.log('Task not found:', { taskId, projectId: id });
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const transformedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      labels: task.labels || [],
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assignedToId: task.assignedToId,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      project: task.project,
      // ✅ REMOVED: comments array
      subtasks: [],
      attachments: [],
      // ✅ Add message count or link to project chat
      discussionLink: `/dashboard/projects/${id}/chat?task=${taskId}`,
    };

    return NextResponse.json(transformedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}