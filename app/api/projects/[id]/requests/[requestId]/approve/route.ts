// app/api/projects/[id]/requests/[requestId]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'
import { createNotification } from '@/app/lib/notifications/helpers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }  // ✅ Changed from slug to id
) {
  try {
    const auth = await getAuthUser(request)
    const { id: projectId, requestId } = await params  // ✅ Renamed id to projectId

    // Get project with select for better performance
    const project = await prisma.project.findUnique({
      where: { id: projectId },  // ✅ Changed from slug to id
      select: {
        id: true,
        ownerId: true,
        title: true,
        slug: true,
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

    // Check permissions - Owner, Lead, or Admin
    const isOwner = project.ownerId === auth.userId
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId)
    const isAdmin = auth.isAdmin || auth.isSuperAdmin

    if (!isOwner && !isLead && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to approve join requests' },
        { status: 403 }
      )
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    if (!joinRequest || joinRequest.projectId !== project.id) {
      return NextResponse.json(
        { error: 'Join request not found' },
        { status: 404 }
      )
    }

    // Check if request is still pending
    if (joinRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: `This request has already been ${joinRequest.status.toLowerCase()}` },
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

    // Check if user is already a member
    const isAlreadyMember = project.members.some((m: any) => m.userId === joinRequest.userId)
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    // Update request status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedById: auth.userId,
        reviewedAt: new Date(),
      }
    })

    // Add user as a project member
    await prisma.projectMember.create({
      data: {
        userId: joinRequest.userId,
        projectId: project.id,
        status: 'ACTIVE',
        joinedAt: new Date(),
      }
    })

    // Update project member count
    await prisma.project.update({
      where: { id: project.id },
      data: {
        currentMembers: { increment: 1 }
      }
    })

    // Notify the user that they were approved
    await createNotification({
      userId: joinRequest.userId,
      title: 'Join Request Approved 🎉',
      message: `Your request to join "${project.title}" has been approved! Welcome to the team.`,
      type: 'REQUEST',
      link: `/dashboard/projects/${project.id}`,
      projectId: project.id,
    })

    // Notify project leads and owner about new member (except the person who approved)
    const notificationUsers = [
      project.ownerId,
      ...project.leads.map((l: any) => l.userId)
    ]
    const uniqueUserIds = [...new Set(notificationUsers)]

    for (const userId of uniqueUserIds) {
      // Skip the person who approved the request
      if (userId === auth.userId) continue

      await createNotification({
        userId,
        title: 'New Member Joined',
        message: `${joinRequest.user?.name || 'A user'} has joined "${project.title}"`,
        type: 'PROJECT',
        link: `/dashboard/projects/${project.id}/members`,
        projectId: project.id,
      })
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: auth.userId,
        action: 'REQUEST_APPROVED',
        details: {
          requestId: requestId,
          userId: joinRequest.userId,
          userName: joinRequest.user?.name || 'Unknown user',
          userEmail: joinRequest.user?.email || 'Unknown',
          approvedBy: auth.userId,
          approvedByName: auth.user.name || 'Unknown',
          projectTitle: project.title,
        },
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Join request approved successfully',
      request: updatedRequest
    })
  } catch (error) {
    console.error('Error approving join request:', error)
    return handleAuthError(error)
  }
}