// app/api/projects/[id]/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { notifyTaskAssigned } from '@/app/lib/notifications/helpers';

// GET /api/projects/[id]/tasks - Get all tasks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

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

    // Build where clause
    const where: any = { projectId: id };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee) where.assignedToId = assignee;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, image: true },
        },
        assignedBy: {
          select: { id: true, name: true, image: true },
        },
        // ✅ REMOVED: _count.comments since TaskComment was removed
        // If you need to show something else, you could include:
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return handleAuthError(error);
  }
}

// POST /api/projects/[id]/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const { title, description, assignedToId, priority, status, dueDate, labels } = body;

    // Validation
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' },
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
        { error: 'You must be a project member to create tasks' },
        { status: 403 }
      );
    }

    // ✅ Check if user is a project lead (only leads can create tasks)
    const isLead = await prisma.projectLead.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    if (!isLead && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only project leads and the project owner can create tasks' },
        { status: 403 }
      );
    }

    // If assignedTo is provided, verify they are a member
    if (assignedToId) {
      const assigneeMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: assignedToId,
            projectId: id,
          },
        },
      });

      if (!assigneeMember) {
        return NextResponse.json(
          { error: 'Assigned user is not a member of this project' },
          { status: 400 }
        );
      }
    }

    // Get assigner name for notification
    const assigner = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { name: true },
    });

    // ✅ Determine task status based on assignment
    let taskStatus = status || 'TODO';
    if (assignedToId && taskStatus === 'TODO') {
      taskStatus = 'ASSIGNED';
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        projectId: id,
        assignedToId: assignedToId || null,
        assignedById: auth.userId,
        priority: priority || 'MEDIUM',
        status: taskStatus,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels: labels || [],
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, image: true },
        },
        assignedBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Send notification if task is assigned to someone
    if (assignedToId) {
      await notifyTaskAssigned(
        id,
        task.id,
        assignedToId,
        task.title,
        assigner?.name || 'A project lead'
      );
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'TASK_CREATED',
        details: { 
          title: task.title, 
          taskId: task.id,
          assignedTo: task.assignedTo?.name || 'Unassigned',
        },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return handleAuthError(error);
  }
}