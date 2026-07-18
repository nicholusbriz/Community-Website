// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/groups - List all project groups
export async function GET(request: NextRequest) {
  try {
    const groups = await prisma.projectGroup.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        color: true,
        _count: {
          select: {
            projects: {
              where: {
                isArchived: false,
                status: {
                  in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
                }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    // ✅ Added explicit type for the group parameter
    const transformedGroups = groups.map((group: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      icon: string | null;
      color: string | null;
      _count: {
        projects: number;
      };
    }) => ({
      ...group,
      projectCount: group._count.projects,
    }));
    
    return NextResponse.json({ groups: transformedGroups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}