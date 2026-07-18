// app/api/users/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

// GET /api/users/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    
    // Get projects where user is the owner
    const projects = await prisma.project.findMany({
      where: {
        ownerId: auth.userId,
        isArchived: false,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            joinRequests: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return handleAuthError(error);
  }
}