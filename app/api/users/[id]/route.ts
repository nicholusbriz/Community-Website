// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        bio: true,
        location: true,
        skills: true,
        github: true,
        linkedin: true,
        portfolio: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
        // ✅ Updated: Only show OPEN, IN_PROGRESS, COMPLETED projects
        projectsCreated: {
          where: {
            isArchived: false,
            status: {
              in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            status: true,
            difficulty: true,
            techStack: true,
            createdAt: true,
            _count: {
              select: {
                members: true,
                tasks: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        // ✅ Updated: Only show OPEN, IN_PROGRESS, COMPLETED projects in memberships
        memberships: {
          where: {
            status: 'ACTIVE',
            project: {
              isArchived: false,
              status: {
                in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
              },
            },
          },
          select: {
            joinedAt: true,
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                difficulty: true,
                techStack: true,
                createdAt: true,
                _count: {
                  select: {
                    members: true,
                    tasks: true,
                  },
                },
              },
            },
          },
          orderBy: { joinedAt: 'desc' },
        },
        _count: {
          select: {
            projectsCreated: {
              where: {
                isArchived: false,
                status: {
                  in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
                },
              },
            },
            memberships: {
              where: {
                status: 'ACTIVE',
                project: {
                  isArchived: false,
                  status: {
                    in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ Transform the response to match the DeveloperUser interface
    const transformedUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      location: user.location,
      skills: user.skills || [],
      image: user.image,
      email: user.email,
      github: user.github,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
      role: user.role,
      projects: user.projectsCreated || [],
      memberships: user.memberships || [],
      _count: {
        projectsCreated: user._count?.projectsCreated || 0,
        memberships: user._count?.memberships || 0,
      },
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}