// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getAuthUser } from '@/app/lib/auth/api-utils';

// GET /api/projects/[id] - Get a single project by ID (authenticated users)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
      where: { 
        id: id,
        isArchived: false,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          },
          take: 10 // Limit members for performance
        },
        leads: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          }
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            joinRequests: true,
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

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project by ID
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
      maxTeamSize,
      difficulty,
      goals,
      duration,
      repositoryUrl,
      demoUrl,
      screenshots,
      requirements,
      learningOutcomes,
      groupId,
      status,
      isFeatured,  // ✅ Admin can update this
    } = body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!existingProject) {
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
    const isOwner = existingProject.ownerId === auth.userId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only project owner or admin can update this project' },
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

    // ✅ Build update data (removed projectType and visibility)
    const updateData: any = {
      title,
      description,
      techStack,
      maxTeamSize,
      difficulty,
      goals,
      duration,
      repositoryUrl,
      demoUrl,
      screenshots,
      requirements,
      learningOutcomes,
      groupId,
      status,
    };

    // ✅ Only admin can update isFeatured
    if (isAdmin && isFeatured !== undefined) {
      updateData.isFeatured = isFeatured;
    }

    // ✅ Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update project
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
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        leads: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });

    // ✅ Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'PROJECT_UPDATED',
        details: {
          updatedBy: auth.userId,
          updatedFields: Object.keys(updateData),
        },
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Archive a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true, title: true }
    });

    if (!existingProject) {
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
    const isOwner = existingProject.ownerId === auth.userId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only project owner or admin can archive this project' },
        { status: 403 }
      );
    }

    // Archive project
    await prisma.project.update({
      where: { id },
      data: { isArchived: true }
    });

    // ✅ Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'PROJECT_UPDATED',
        details: {
          action: 'ARCHIVED',
          projectTitle: existingProject.title,
          archivedBy: auth.userId,
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Project archived successfully' 
    });
  } catch (error) {
    console.error('Error archiving project:', error);
    return NextResponse.json(
      { error: 'Failed to archive project' },
      { status: 500 }
    );
  }
}