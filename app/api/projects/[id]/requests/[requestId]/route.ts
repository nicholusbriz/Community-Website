// app/api/projects/[id]/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { createNotification } from '@/app/lib/notifications/helpers';

// GET /api/projects/[id]/requests/[requestId] - Get a specific join request
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string; requestId: string }> }  // ✅ Fixed: id and requestId
) {
  try {
    const auth = await getAuthUser(request);
    const { id: projectId, requestId } = await params;  // ✅ Fixed: use id as projectId

    // Get project to verify permissions
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        leads: {
          select: {
            userId: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is owner, lead, or admin
    const isOwner = project.ownerId === auth.userId;
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId);
    const isAdmin = auth.isAdmin || auth.isSuperAdmin;

    if (!isOwner && !isLead && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to view this join request' },
        { status: 403 }
      );
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
        projectId: project.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
            skills: true,
            bio: true,
          }
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: 'Join request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: joinRequest });
  } catch (error) {
    console.error('Error fetching join request:', error);
    return handleAuthError(error);
  }
}

// PUT /api/projects/[id]/requests/[requestId] - Update a join request (approve/reject)
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string; requestId: string }> }  // ✅ Fixed: id and requestId
) {
  try {
    const auth = await getAuthUser(request);
    const { id: projectId, requestId } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        title: true,
        maxTeamSize: true,
        currentMembers: true,
        leads: {
          select: {
            userId: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check permissions - Owner, Lead, or Admin
    const isOwner = project.ownerId === auth.userId;
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId);
    const isAdmin = auth.isAdmin || auth.isSuperAdmin;

    if (!isOwner && !isLead && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to update this join request' },
        { status: 403 }
      );
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
        projectId: project.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: 'Join request not found' },
        { status: 404 }
      );
    }

    // Check if request is already processed
    if (joinRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: `This request is already ${joinRequest.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // If approving, check if team is full
    if (status === 'APPROVED') {
      if (project.currentMembers >= project.maxTeamSize) {
        return NextResponse.json(
          { error: 'This project team is full' },
          { status: 400 }
        );
      }

      // Check if user is already a member
      const existingMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: joinRequest.userId,
            projectId: project.id,
          },
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member of this project' },
          { status: 400 }
        );
      }
    }

    // Update the join request
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: status,
        reviewedById: auth.userId,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // If approved, add user as member
    if (status === 'APPROVED') {
      await prisma.projectMember.create({
        data: {
          userId: joinRequest.userId,
          projectId: project.id,
          status: 'ACTIVE',
          joinedAt: new Date(),
        },
      });

      // Update project member count
      await prisma.project.update({
        where: { id: project.id },
        data: { 
          currentMembers: { increment: 1 },
        },
      });

      // Notify the user
      await createNotification({
        userId: joinRequest.userId,
        title: 'Join Request Approved 🎉',
        message: `Your request to join "${project.title}" has been approved! Welcome to the team.`,
        type: 'REQUEST',
        link: `/dashboard/projects/${project.id}`,
        projectId: project.id,
      });

      // Notify project leads and owner about new member
      const notificationUsers = [
        project.ownerId,
        ...project.leads.map((l: any) => l.userId)
      ];
      const uniqueUserIds = [...new Set(notificationUsers)];

      for (const userId of uniqueUserIds) {
        if (userId === auth.userId) continue;
        
        await createNotification({
          userId,
          title: 'New Member Joined',
          message: `${joinRequest.user?.name || 'A user'} has joined "${project.title}"`,
          type: 'PROJECT',
          link: `/dashboard/projects/${project.id}/members`,
          projectId: project.id,
        });
      }
    } else {
      // REJECTED - Notify the user
      const rejectionMsg = rejectionReason 
        ? `Your request to join "${project.title}" was rejected: ${rejectionReason}`
        : `Your request to join "${project.title}" was rejected.`;
      
      await createNotification({
        userId: joinRequest.userId,
        title: 'Join Request Rejected',
        message: rejectionMsg,
        type: 'REQUEST',
        link: `/projects`,
        projectId: project.id,
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: auth.userId,
        action: status === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED',
        details: {
          requestId: requestId,
          userId: joinRequest.userId,
          userName: joinRequest.user?.name || 'Unknown user',
          reviewedBy: auth.userId,
          reviewedByName: auth.user.name,
          rejectionReason: rejectionReason || null,
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      message: `Join request ${status.toLowerCase()} successfully`,
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Error updating join request:', error);
    return handleAuthError(error);
  }
}

// DELETE /api/projects/[id]/requests/[requestId] - Delete/cancel a join request
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string; requestId: string }> }  // ✅ Fixed: id and requestId
) {
  try {
    const auth = await getAuthUser(request);
    const { id: projectId, requestId } = await params;

    // Get project to check permissions
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        title: true,
        leads: {
          select: {
            userId: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
        projectId: project.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!joinRequest) {
      return NextResponse.json(
        { error: 'Join request not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this request
    const isOwner = project.ownerId === auth.userId;
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId);
    const isAdmin = auth.isAdmin || auth.isSuperAdmin;
    const isRequester = joinRequest.userId === auth.userId;

    if (!isOwner && !isLead && !isAdmin && !isRequester) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this join request' },
        { status: 403 }
      );
    }

    // Prevent deleting approved or rejected requests
    if (joinRequest.status !== 'PENDING' && joinRequest.status !== 'CANCELLED') {
      return NextResponse.json(
        { error: `Cannot delete a ${joinRequest.status.toLowerCase()} request` },
        { status: 400 }
      );
    }

    // If requester is deleting, set status to CANCELLED instead of hard delete
    if (isRequester && joinRequest.status === 'PENDING') {
      const cancelledRequest = await prisma.joinRequest.update({
        where: { id: requestId },
        data: {
          status: 'CANCELLED',
        },
      });

      return NextResponse.json({ 
        success: true,
        message: 'Join request cancelled successfully',
        request: cancelledRequest 
      });
    }

    // Hard delete for admin/owner/lead
    await prisma.joinRequest.delete({
      where: { id: requestId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: auth.userId,
        action: 'REQUEST_REJECTED',
        details: {
          requestId: requestId,
          userId: joinRequest.userId,
          userName: joinRequest.user?.name || 'Unknown user',
          deletedBy: auth.userId,
          deletedByName: auth.user.name,
          reason: 'Request deleted by ' + (isRequester ? 'requester' : 'admin/owner/lead'),
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Join request deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting join request:', error);
    return handleAuthError(error);
  }
}