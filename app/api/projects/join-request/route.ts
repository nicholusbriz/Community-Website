// app/api/projects/join-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: projectId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this project' },
        { status: 400 }
      );
    }

    // Check for pending request
    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        projectId: projectId,
        userId: auth.userId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending join request' },
        { status: 400 }
      );
    }

    // Check if project is accepting members
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { 
        status: true,
        maxTeamSize: true,
        _count: {
          select: { members: true }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This project is not accepting new members' },
        { status: 400 }
      );
    }

    if (project._count.members >= project.maxTeamSize) {
      return NextResponse.json(
        { error: 'This project has reached its maximum team size' },
        { status: 400 }
      );
    }

    // Create join request
    await prisma.joinRequest.create({
      data: {
        projectId: projectId,
        userId: auth.userId,
        status: 'PENDING',
        message: 'I would like to join this project!',
      },
    });

    // Increment join count
    await prisma.project.update({
      where: { id: projectId },
      data: { joinCount: { increment: 1 } },
    });

    return NextResponse.json(
      { message: 'Join request sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating join request:', error);
    return handleAuthError(error);
  }
}