// app/api/projects/[id]/requests/[requestId]/reject/route.ts
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
    const { reason } = await request.json()

    // Get project with select for better performance
    const project = await prisma.project.findUnique({
      where: { id: projectId },  // ✅ Changed from slug to id
      select: {
        id: true,
        ownerId: true,
        title: true,
        slug: true,
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

    // Check permissions - Owner, Lead, or Admin
    const isOwner = project.ownerId === auth.userId
    const isLead = project.leads.some((lead: any) => lead.userId === auth.userId)
    const isAdmin = auth.isAdmin || auth.isSuperAdmin

    if (!isOwner && !isLead && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to reject join requests' },
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

    // Update request status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedById: auth.userId,
        reviewedAt: new Date(),
        rejectionReason: reason || null,
      }
    })

    // Notify the user with reason if provided
    const rejectionMessage = reason 
      ? `Your request to join "${project.title}" was rejected: ${reason}`
      : `Your request to join "${project.title}" was not approved.`

    await createNotification({
      userId: joinRequest.userId,
      title: 'Join Request Rejected',
      message: rejectionMessage,
      type: 'REQUEST',
      link: `/projects`,
      projectId: project.id,
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: auth.userId,
        action: 'REQUEST_REJECTED',
        details: {
          requestId: requestId,
          userId: joinRequest.userId,
          userName: joinRequest.user?.name || 'Unknown user',
          userEmail: joinRequest.user?.email || 'Unknown',
          reason: reason || null,
          rejectedBy: auth.userId,
          rejectedByName: auth.user.name || 'Unknown',
          projectTitle: project.title,
        },
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Join request rejected successfully',
      request: updatedRequest
    })
  } catch (error) {
    console.error('Error rejecting join request:', error)
    return handleAuthError(error)
  }
}