// app/api/projects/[id]/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// GET /api/projects/[id]/analytics - Get project analytics
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
      select: { ownerId: true },
    });

    if (!membership && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to view analytics' },
        { status: 403 }
      );
    }

    // Get task statistics
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: id },
      _count: true,
    });

    // Get member statistics
    const memberStats = await prisma.projectMember.aggregate({
      where: { projectId: id },
      _count: true,
      _avg: {
        contributionScore: true,
        tasksCompleted: true,
      },
    });

    // Get join request statistics
    const joinRequestStats = await prisma.joinRequest.groupBy({
      by: ['status'],
      where: { projectId: id },
      _count: true,
    });

    // Get recent activity
    const recentActivity = await prisma.activityLog.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      taskStats,
      memberStats: {
        total: memberStats._count,
        averageContribution: memberStats._avg.contributionScore || 0,
        averageTasksCompleted: memberStats._avg.tasksCompleted || 0,
      },
      joinRequestStats,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return handleAuthError(error);
  }
}
