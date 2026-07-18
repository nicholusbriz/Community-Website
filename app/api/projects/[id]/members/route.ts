// app/api/projects/[id]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { notifyMemberLeft } from '@/app/lib/notifications/helpers';

// GET /api/projects/[id]/members - Get all members including owner and leads
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;

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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            skills: true,
          },
        },
        leads: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                skills: true,
              },
            },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                skills: true,
              },
            },
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

    if (!membership && project.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to view members' },
        { status: 403 }
      );
    }

    // Build the members list including owner, leads, and members
    const allMembers = [];

    // 1. Add Owner
    if (project.owner) {
      allMembers.push({
        userId: project.owner.id,
        role: 'OWNER',
        user: project.owner,
        tasksCompleted: 0,
      });
    }

    // 2. Add Leads (excluding owner if they are also a lead)
    project.leads.forEach((lead: any) => {
      if (lead.userId === project.ownerId) return;
      allMembers.push({
        userId: lead.userId,
        role: 'LEAD',
        user: lead.user,
        tasksCompleted: 0,
      });
    });

    // 3. Add Members (excluding owner and leads)
    project.members.forEach((member: any) => {
      if (member.userId === project.ownerId) return;
      if (project.leads.some((lead: any) => lead.userId === member.userId)) return;
      allMembers.push({
        userId: member.userId,
        role: 'MEMBER',
        user: member.user,
        tasksCompleted: 0,
      });
    });

    return NextResponse.json({ 
      members: allMembers,
      owner: project.owner,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return handleAuthError(error);
  }
}

// DELETE /api/projects/[id]/members - Remove a member from the project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id },
      select: { 
        ownerId: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only project owner can remove members
    if (project.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the project owner can remove members' },
        { status: 403 }
      );
    }

    // Don't allow removing the owner
    if (userId === project.ownerId) {
      return NextResponse.json(
        { error: 'Cannot remove the project owner' },
        { status: 400 }
      );
    }

    // Get member info before removing
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: id,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'User is not a member of this project' },
        { status: 404 }
      );
    }

    const memberName = member.user?.name || 'A user';

    // Check if user is a lead and remove lead status first
    const isLead = await prisma.projectLead.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: id,
        },
      },
    });

    if (isLead) {
      await prisma.projectLead.delete({
        where: {
          userId_projectId: {
            userId: userId,
            projectId: id,
          },
        },
      });

      // Log lead removal activity
      await prisma.activityLog.create({
        data: {
          projectId: id,
          userId: auth.userId,
          action: 'LEAD_REMOVED',
          details: { 
            userId: userId, 
            userName: memberName,
            removedBy: auth.userId,
          },
        },
      });
    }

    // Remove the member
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: id,
        },
      },
    });

    // Update project member count
    await prisma.project.update({
      where: { id },
      data: { currentMembers: { decrement: 1 } },
    });

    // Send notification
    await notifyMemberLeft(id, memberName);

    // Get the removing user's info for activity log
    const removingUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Log activity using MEMBER_LEFT with removedBy info
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'MEMBER_LEFT',
        details: { 
          userId: userId, 
          userName: memberName,
          userEmail: member.user?.email,
          removedBy: auth.userId,
          removedByName: removingUser?.name || 'Unknown',
          removedByEmail: removingUser?.email || 'Unknown',
          reason: 'Removed by project owner',
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Member removed successfully',
      userId: userId,
      userName: memberName,
    });
  } catch (error) {
    console.error('Error removing member:', error);
    return handleAuthError(error);
  }
}