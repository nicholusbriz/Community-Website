// app/api/admin/users/role/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminOrSuperAdmin, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'

export async function PUT(
  request: NextRequest
) {
  try {
    const auth = await requireAdminOrSuperAdmin(request)
    const body = await request.json()
    const { userId, roleId } = body
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }
    
    // Get the role being assigned
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    })
    
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }
    
    // Get the user being updated
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // ✅ PERMISSION CHECKS
    
    // 1️⃣ Prevent assigning PROJECT_LEAD globally
    if (role.name === 'PROJECT_LEAD') {
      return NextResponse.json(
        { 
          error: 'PROJECT_LEAD role cannot be assigned globally. It is managed at the project level by project owners.',
          code: 'PROJECT_LEAD_NOT_ALLOWED'
        },
        { status: 400 }
      )
    }
    
    // 2️⃣ Only SUPERADMIN can modify SUPERADMIN users
    if (user.role?.name === 'SUPERADMIN' && !auth.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can modify SUPERADMIN users' },
        { status: 403 }
      )
    }
    
    // 3️⃣ Only SUPERADMIN can assign SUPERADMIN role
    if (role.name === 'SUPERADMIN' && !auth.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can assign SUPERADMIN role' },
        { status: 403 }
      )
    }
    
    // 4️⃣ Prevent ADMIN from demoting themselves
    if (userId === auth.userId && user.role?.name === 'ADMIN' && role.name !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ADMIN cannot demote themselves. Please ask a SUPERADMIN to do this.' },
        { status: 403 }
      )
    }
    
    // 5️⃣ Prevent SUPERADMIN from demoting themselves
    if (userId === auth.userId && user.role?.name === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'SUPERADMIN cannot change their own role. This would lock you out of the system.' },
        { status: 403 }
      )
    }
    
    // 6️⃣ Only SUPERADMIN can delete ADMIN roles
    if (user.role?.name === 'ADMIN' && role.name !== 'ADMIN' && !auth.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can demote ADMIN users' },
        { status: 403 }
      )
    }
    
    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true }
    })
    
    // Get the current user's info for logging
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { email: true, name: true }
    })
    
    // ✅ Log the role change activity with projectId: null
    // Since this is a system-level action, projectId is null
    await prisma.activityLog.create({
      data: {
        userId: auth.userId,
        projectId: null as any, // ✅ Add this - set to null for system-level actions
        action: 'USER_ROLE_UPDATED',
        details: {
          targetUserId: userId,
          targetUserEmail: user.email,
          targetUserName: user.name,
          oldRole: user.role?.name || 'USER',
          newRole: role.name,
          updatedBy: auth.userId,
          updatedByEmail: currentUser?.email || 'unknown',
          updatedByName: currentUser?.name || 'Unknown',
        }
      }
    })
    
    return NextResponse.json({
      message: 'User role updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('❌ Error updating user role:', error)
    return handleAuthError(error)
  }
}