// app/api/projects/[id]/requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'
import { createNotification } from '@/app/lib/notifications/helpers'

// GET /api/projects/[id]/requests - List join requests (owner/lead/admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed from slug to id
) {
  try {
    const auth = await getAuthUser(request)
    const { id: projectId } = await params  // ✅ Renamed id to projectId
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },  // ✅ Changed from slug to id
      select: {
        id: true,
        ownerId: true,
        title: true,
        leads: {
          select: {
            userId: true,
          }
        }
      }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Check if user is owner, lead, or admin
    const isOwner = project.ownerId === auth.userId
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId)
    const isAdmin = auth.isAdmin || auth.isSuperAdmin
    
    if (!isOwner && !isLead && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to view join requests' },
        { status: 403 }
      )
    }
    
    const requests = await prisma.joinRequest.findMany({
      where: {
        projectId: project.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
            skills: true,
            bio: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching join requests:', error)
    return handleAuthError(error)
  }
}

// POST /api/projects/[id]/requests - Request to join project (authenticated)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed from slug to id
) {
  try {
    const auth = await getAuthUser(request)
    const { id: projectId } = await params  // ✅ Renamed id to projectId
    const { message, skills, experience } = await request.json()
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },  // ✅ Changed from slug to id
      select: {
        id: true,
        ownerId: true,
        title: true,
        slug: true,
        status: true,
        maxTeamSize: true,
        currentMembers: true,
        leads: {
          select: {
            userId: true,
          }
        },
        members: {
          select: {
            userId: true,
          }
        }
      }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Check if user is already a member
    const isMember = project.members.some((m: any) => m.userId === auth.userId)
    if (isMember) {
      return NextResponse.json(
        { error: 'You are already a member of this project' },
        { status: 400 }
      )
    }
    
    // Check if user already has a pending request
    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        userId: auth.userId,
        projectId: project.id,
        status: 'PENDING',
      }
    })
    
    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request for this project' },
        { status: 400 }
      )
    }
    
    // Check if project is open for requests (only OPEN or IN_PROGRESS)
    if (project.status !== 'OPEN' && project.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'This project is not currently accepting members' },
        { status: 400 }
      )
    }
    
    // Check if team is full
    if (project.currentMembers >= project.maxTeamSize) {
      return NextResponse.json(
        { error: 'This project team is full' },
        { status: 400 }
      )
    }
    
    const requestData = await prisma.joinRequest.create({
      data: {
        userId: auth.userId,
        projectId: project.id,
        message,
        skills: skills || [],
        experience,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          }
        }
      }
    })
    
    // Get user name for notification
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { name: true }
    })
    
    // Create notification for owner and leads using createNotification helper
    const notificationUsers = [
      project.ownerId,
      ...project.leads.map((l: any) => l.userId)
    ]
    
    // Remove duplicates (in case owner is also a lead)
    const uniqueUserIds = [...new Set(notificationUsers)]
    
    for (const userId of uniqueUserIds) {
      await createNotification({
        userId,
        title: 'New Join Request',
        message: `${user?.name || 'A user'} has requested to join "${project.title}"`,
        type: 'REQUEST',
        link: `/dashboard/projects/${project.id}/join-requests`,
        projectId: project.id,
      })
    }
    
    return NextResponse.json(requestData, { status: 201 })
  } catch (error) {
    console.error('Error creating join request:', error)
    return handleAuthError(error)
  }
}