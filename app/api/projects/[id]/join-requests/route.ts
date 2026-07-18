// app/api/projects/[id]/join-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { 
  notifyJoinRequest,
  notifyJoinRequestApproved, 
  notifyJoinRequestRejected 
} from '@/app/lib/notifications/helpers';

// GET /api/projects/[id]/join-requests - Get all join requests for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'PENDING';

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
        { error: 'You must be a project member to view join requests' },
        { status: 403 }
      );
    }

    // Build the where clause
    const where: any = {
      projectId: id,
    };

    // Only add status filter if it's not "ALL" and is a valid enum value
    if (statusParam !== 'ALL') {
      // Validate that the status is a valid RequestStatus enum value
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
      if (validStatuses.includes(statusParam)) {
        where.status = statusParam as any;
      }
    }
    // If status is "ALL", we don't add the status filter at all

    const joinRequests = await prisma.joinRequest.findMany({
      where,
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
        reviewedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ joinRequests });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return handleAuthError(error);
  }
}

// PUT /api/projects/[id]/join-requests - Approve or reject a join request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (APPROVED or REJECTED) is required' },
        { status: 400 }
      );
    }

    // Verify user is owner or lead of the project
    const project = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true, maxTeamSize: true },
    });

    if (!project || project.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Only the project owner can approve/reject join requests' },
        { status: 403 }
      );
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { 
        project: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!joinRequest || joinRequest.projectId !== id) {
      return NextResponse.json(
        { error: 'Join request not found' },
        { status: 404 }
      );
    }

    if (joinRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      );
    }

    // If approving, check team size
    if (status === 'APPROVED') {
      const memberCount = await prisma.projectMember.count({
        where: { projectId: id },
      });

      if (memberCount >= project.maxTeamSize) {
        return NextResponse.json(
          { error: 'Project has reached maximum team size' },
          { status: 400 }
        );
      }

      // Add user as a member
      await prisma.projectMember.create({
        data: {
          userId: joinRequest.userId,
          projectId: id,
          status: 'ACTIVE',
        },
      });
    }

    // Update join request
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: status as any,
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
            image: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Send notifications based on the decision
    const requesterName = joinRequest.user.name || 'A user';
    const projectTitle = joinRequest.project?.title || 'the project';

    if (status === 'APPROVED') {
      // Notify the requester that they were approved
      await notifyJoinRequestApproved(
        id,
        joinRequest.userId,
        projectTitle
      );
    } else if (status === 'REJECTED') {
      // Notify the requester that they were rejected
      await notifyJoinRequestRejected(
        id,
        joinRequest.userId,
        projectTitle,
        rejectionReason || undefined
      );
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: status === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED',
        details: { userId: joinRequest.userId, requestId: requestId },
      },
    });

    return NextResponse.json({ joinRequest: updatedRequest });
  } catch (error) {
    console.error('Error updating join request:', error);
    return handleAuthError(error);
  }
}