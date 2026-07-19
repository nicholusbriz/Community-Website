// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/projects - List all projects (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const status = searchParams.get('status') || ''
    const groupId = searchParams.get('groupId') || ''
    const search = searchParams.get('search') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const language = searchParams.get('language') || ''
    
    const skip = (page - 1) * limit
    
    // ✅ Only show OPEN, IN_PROGRESS, COMPLETED projects
    const where: any = {
      isArchived: false,
      status: {
        in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
      }
    }
    
    if (status) where.status = status
    if (groupId) where.groupId = groupId
    if (difficulty) where.difficulty = difficulty
    
    // Language filter (techStack)
    if (language && language !== 'All Languages') {
      where.techStack = { has: language }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    const projects = await prisma.project.findMany({
      where,
      skip,
      take: limit,
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
        _count: {
          select: {
            members: true,
            tasks: true,
            joinRequests: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const total = await prisma.project.count({ where })
    
    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project (authenticated)
export async function POST(request: NextRequest) {
  try {
    // ✅ Keep authentication for POST (create project)
    const { getAuthUser, handleAuthError } = await import('@/app/lib/auth/api-utils')
    const auth = await getAuthUser(request)
    const body = await request.json()
    
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
      requirements,
      learningOutcomes,
      groupId,
    } = body
    
    // Validation
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: 'Title must be at least 3 characters' },
        { status: 400 }
      )
    }
    
    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }
    
    if (!techStack || techStack.length === 0) {
      return NextResponse.json(
        { error: 'At least one technology is required' },
        { status: 400 }
      )
    }
    
    if (!goals || goals.length === 0) {
      return NextResponse.json(
        { error: 'At least one goal is required' },
        { status: 400 }
      )
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Check if slug already exists
    const existing = await prisma.project.findUnique({
      where: { slug }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'A project with a similar title already exists' },
        { status: 400 }
      )
    }
    
    // Check if group exists
    if (groupId) {
      const group = await prisma.projectGroup.findUnique({
        where: { id: groupId }
      })
      if (!group) {
        return NextResponse.json(
          { error: 'Selected group not found' },
          { status: 400 }
        )
      }
    }
    
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        techStack,
        maxTeamSize: maxTeamSize || 1,
        difficulty: difficulty || 'INTERMEDIATE',
        goals,
        duration,
        repositoryUrl,
        demoUrl,
        requirements,
        learningOutcomes: learningOutcomes || [],
        groupId,
        createdById: auth.userId,
        ownerId: auth.userId,
        status: 'OPEN',
        currentMembers: 1,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            slug: true,
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
        }
      }
    })
    
    // Add creator as a member
    await prisma.projectMember.create({
      data: {
        userId: auth.userId,
        projectId: project.id,
        status: 'ACTIVE',
      }
    })
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: auth.userId,
        action: 'PROJECT_CREATED',
        details: { title: project.title },
      }
    })
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    // Re-import for error handling
    const { handleAuthError } = await import('@/app/lib/auth/api-utils')
    return handleAuthError(error)
  }
}