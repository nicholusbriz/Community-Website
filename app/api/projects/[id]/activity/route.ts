// app/api/projects/[id]/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// GET /api/projects/[id]/activity - Get project activity log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');

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
        { error: 'You must be a project member to view activity' },
        { status: 403 }
      );
    }

    const where: any = { projectId: id };
    if (action) where.action = action;

    const activities = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Get action types for filter
    const actionTypes = await prisma.activityLog.groupBy({
      by: ['action'],
      where: { projectId: id },
    });

    return NextResponse.json({
      activities,
      actionTypes: actionTypes.map(a => a.action),
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return handleAuthError(error);
  }
}
