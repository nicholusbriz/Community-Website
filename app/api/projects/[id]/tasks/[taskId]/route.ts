import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getAuthUser } from '@/app/lib/auth/api-utils';
import { notifyTaskAssigned } from '@/app/lib/notifications/helpers';

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

// PUT /api/projects/[id]/tasks/[taskId] - Assign a task to a user
// Consolidated endpoint - replaces separate assign endpoint
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id: projectId, taskId } = await params;
    const auth = await getAuthUser(request);
    const { assignedToId } = await request.json();

    // Check if task exists and belongs to project
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: projectId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if the user trying to assign is a team lead or owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        leads: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isOwner = project.ownerId === auth.userId;
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId);

    if (!isOwner && !isLead) {
      return NextResponse.json(
        { error: 'Only project owners and team leads can assign tasks' },
        { status: 403 }
      );
    }

    // Check if the user to assign is a member of the project
    const member = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: assignedToId,
        status: 'ACTIVE',
      },
    });

    const lead = await prisma.projectLead.findFirst({
      where: {
        projectId: projectId,
        userId: assignedToId,
      },
    });

    // Check if it's the project owner
    const isOwnerBeingAssigned = project.ownerId === assignedToId;

    if (!member && !lead && !isOwnerBeingAssigned) {
      return NextResponse.json(
        { error: 'User is not a member of this project' },
        { status: 403 }
      );
    }

    // Get assigner name for notification
    const assigner = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { name: true },
    });

    // Update the task with the assigned user
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: assignedToId,
        assignedById: auth.userId,
        status: 'ASSIGNED', // ✅ Auto-set status to ASSIGNED
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
          },
        },
      },
    });

    // ✅ Send notification if task is assigned to someone
    if (assignedToId) {
      await notifyTaskAssigned(
        projectId,
        taskId,
        assignedToId,
        task.title,
        assigner?.name || 'A project lead'
      );
    }

    // Log activity - using TASK_ASSIGNED
    await prisma.activityLog.create({
      data: {
        projectId: projectId,
        userId: auth.userId,
        action: 'TASK_ASSIGNED',
        details: {
          taskId: taskId,
          assignedToId: assignedToId,
          taskTitle: task.title,
          assignedToName: updatedTask.assignedTo?.name || 'Unknown',
          assignedBy: auth.userId,
          assignedByName: assigner?.name || 'Unknown',
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error assigning member:', error);
    return NextResponse.json(
      { error: 'Failed to assign member to task' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/tasks/[taskId] - Unassign a task
// Consolidated endpoint - replaces separate assign endpoint DELETE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id: projectId, taskId } = await params;
    const auth = await getAuthUser(request);

    // Check if task exists and belongs to project
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if the user trying to unassign is a team lead or owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        leads: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isOwner = project.ownerId === auth.userId;
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId);

    if (!isOwner && !isLead) {
      return NextResponse.json(
        { error: 'Only project owners and team leads can unassign tasks' },
        { status: 403 }
      );
    }

    // Store assigned user info before unassigning
    const assignedUser = task.assignedToId
      ? await prisma.user.findUnique({
          where: { id: task.assignedToId },
          select: { name: true },
        })
      : null;

    // Update the task to remove the assigned user and set status to UNASSIGNED
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: null,
        assignedById: null,
        status: 'UNASSIGNED', // ✅ Set status to UNASSIGNED
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
      },
    });

    // Log activity - using TASK_UNASSIGNED
    await prisma.activityLog.create({
      data: {
        projectId: projectId,
        userId: auth.userId,
        action: 'TASK_UNASSIGNED',
        details: {
          taskId: taskId,
          taskTitle: task.title,
          previousAssignedToId: task.assignedToId,
          previousAssignedToName: assignedUser?.name || 'Unknown',
          unassignedBy: auth.userId,
          unassignedByName: auth.user.name || 'Unknown',
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error unassigning member:', error);
    return NextResponse.json(
      { error: 'Failed to unassign member from task' },
      { status: 500 }
    );
  }
}