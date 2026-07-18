// app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireSuperAdmin(request)
    const { userId } = await params
    
    // Get the user being deleted
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Prevent deleting yourself
    if (userId === auth.userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Prevent deleting other SUPERADMINs
    if (user.role?.name === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete another SUPERADMIN user' },
        { status: 400 }
      )
    }
    
    // Get current user info for logging
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { email: true, name: true }
    })
    
    // Log the deletion before actually deleting
    await prisma.activityLog.create({
      data: {
        userId: auth.userId,
        action: 'USER_DELETED',
        details: {
          deletedUserId: userId,
          deletedUserEmail: user.email,
          deletedUserName: user.name,
          deletedUserRole: user.role?.name || 'USER',
          deletedBy: auth.userId,
          deletedByEmail: currentUser?.email || 'unknown',
          deletedByName: currentUser?.name || 'Unknown',
        }
      }
    })
    
    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    })
    
    return NextResponse.json({
      message: 'User deleted successfully',
      userId: userId
    })
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    return handleAuthError(error)
  }
}