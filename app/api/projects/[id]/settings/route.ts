// app/api/projects/[id]/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// PUT /api/projects/[id]/settings - Update project settings
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      description,
      techStack,
      goals,
      maxTeamSize,
      difficulty,
      duration,
      repositoryUrl,
      demoUrl,
      requirements,
      learningOutcomes,
      groupId,
      status,
      // ✅ REMOVED: visibility - all projects are public
    } = body;

    // Verify user is owner of the project
    const project = await prisma.project.findUnique({
      where: { id },
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

    // ✅ Check if user is project owner or admin
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true }
    });

    const isAdmin = user?.role?.name === 'ADMIN' || user?.role?.name === 'SUPERADMIN';
    const isOwner = project.ownerId === auth.userId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the project owner or admin can update settings' },
        { status: 403 }
      );
    }

    // ✅ Validate status (only OPEN, IN_PROGRESS, COMPLETED)
    if (status && !['OPEN', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be OPEN, IN_PROGRESS, or COMPLETED' },
        { status: 400 }
      );
    }

    // ✅ Validate maxTeamSize (must be at least 1)
    if (maxTeamSize !== undefined && (maxTeamSize < 1 || maxTeamSize > 20)) {
      return NextResponse.json(
        { error: 'Team size must be between 1 and 20' },
        { status: 400 }
      );
    }

    // ✅ Build update data without visibility
    const updateData: any = {
      title: title || undefined,
      description: description || undefined,
      techStack: techStack || undefined,
      goals: goals || undefined,
      maxTeamSize: maxTeamSize || undefined,
      difficulty: difficulty || undefined,
      duration: duration || undefined,
      repositoryUrl: repositoryUrl || undefined,
      demoUrl: demoUrl || undefined,
      requirements: requirements || undefined,
      learningOutcomes: learningOutcomes || undefined,
      groupId: groupId || undefined,
      status: status || undefined,
      // ✅ REMOVED: visibility
    };

    // ✅ Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        createdBy: {
          select: { id: true, name: true, image: true },
        },
        owner: {
          select: { id: true, name: true, image: true },
        },
        leads: {
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

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'PROJECT_UPDATED',
        details: { 
          title: updatedProject.title,
          updatedFields: Object.keys(updateData),
          updatedBy: auth.userId,
          updatedByName: auth.user.name,
        },
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project settings:', error);
    return handleAuthError(error);
  }
}