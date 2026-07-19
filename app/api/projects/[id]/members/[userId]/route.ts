// app/api/projects/[id]/members/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { createNotification } from '@/app/lib/notifications/helpers';

// PATCH /api/projects/[id]/members/[userId] - Make a member a project lead
// Consolidated endpoint - replaces separate make-lead endpoint
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id: projectId, userId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        ownerId: true,
        title: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only project owner can assign leads
    if (project.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the project owner can assign leads' },
        { status: 403 }
      );
    }

    // Can't make the project owner a lead
    if (userId === project.ownerId) {
      return NextResponse.json(
        { error: 'Project owner cannot be assigned as a lead' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a lead
    const existingLead = await prisma.projectLead.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'User is already a project lead' },
        { status: 400 }
      );
    }

    // Check if user is a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'User must be a member of the project' },
        { status: 400 }
      );
    }

    // Create the project lead with assignedById
    const lead = await prisma.projectLead.create({
      data: {
        userId: userId,
        projectId: projectId,
        assignedById: auth.userId,
      },
      include: {
        user: {
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

    // Create notification for the user being promoted to lead
    await createNotification({
      userId: userId,
      title: 'Promoted to Project Lead',
      message: `You have been promoted to Project Lead for "${project.title}" by ${auth.user.name || 'the project owner'}.`,
      type: 'PROJECT',
      link: `/dashboard/projects/${projectId}`,
      projectId: projectId,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: projectId,
        userId: auth.userId,
        action: 'LEAD_ASSIGNED',
        details: {
          userId: userId,
          userName: user.name,
          assignedBy: auth.userId,
          assignedByName: auth.user.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User assigned as project lead',
      lead
    }, { status: 200 });
  } catch (error) {
    console.error('Error making user a project lead:', error);
    return handleAuthError(error);
  }
}

// DELETE /api/projects/[id]/members/[userId] - Remove a project lead
// Consolidated endpoint - replaces separate make-lead DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id: projectId, userId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        ownerId: true,
        title: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only project owner can remove leads
    if (project.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the project owner can remove leads' },
        { status: 403 }
      );
    }

    // Check if user is a lead
    const lead = await prisma.projectLead.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'User is not a project lead' },
        { status: 404 }
      );
    }

    // Remove the lead
    await prisma.projectLead.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    // Create notification for the user being demoted from lead
    await createNotification({
      userId: userId,
      title: 'Removed as Project Lead',
      message: `You have been removed as a Project Lead for "${project.title}" by ${auth.user.name || 'the project owner'}.`,
      type: 'PROJECT',
      link: `/dashboard/projects/${projectId}`,
      projectId: projectId,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: projectId,
        userId: auth.userId,
        action: 'LEAD_REMOVED',
        details: {
          userId: userId,
          userName: lead.user?.name || 'Unknown user',
          removedBy: auth.userId,
          removedByName: auth.user.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead removed successfully',
      userId: userId,
    });
  } catch (error) {
    console.error('Error removing project lead:', error);
    return handleAuthError(error);
  }
}
