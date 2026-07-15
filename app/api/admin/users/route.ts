// app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils'
import { isSuperAdmin } from '@/app/lib/auth/roles'

// GET - List all users (SUPERADMIN only)
export async function GET(request: Request) {
  try {
    const auth = await getAuthUser(request)
    
    // Verify user is SUPERADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true }
    })

    if (!currentUser || !isSuperAdmin(currentUser.role?.name)) {
      return NextResponse.json({ error: 'Unauthorized - SUPERADMIN only' }, { status: 403 })
    }

    // Get all users with their roles
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })
  } catch (error) {
    return handleAuthError(error)
  }
}

// PUT - Update user role (SUPERADMIN only)
export async function PUT(request: Request) {
  try {
    const auth = await getAuthUser(request)
    
    // Verify user is SUPERADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true }
    })

    if (!currentUser || !isSuperAdmin(currentUser.role?.name)) {
      return NextResponse.json({ error: 'Unauthorized - SUPERADMIN only' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, newRole } = body

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'userId and newRole are required' }, { status: 400 })
    }

    // Verify the new role exists
    const role = await prisma.role.findUnique({
      where: { name: newRole }
    })

    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Prevent superadmin from changing their own role
    if (userId === auth.userId) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
      include: { role: true }
    })

    return NextResponse.json({ 
      message: 'User role updated successfully',
      user: updatedUser
    })
  } catch (error) {
    return handleAuthError(error)
  }
}

// DELETE - Delete user (SUPERADMIN only)
export async function DELETE(request: Request) {
  try {
    const auth = await getAuthUser(request)
    
    // Verify user is SUPERADMIN
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true }
    })

    if (!currentUser || !isSuperAdmin(currentUser.role?.name)) {
      return NextResponse.json({ error: 'Unauthorized - SUPERADMIN only' }, { status: 403 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Prevent superadmin from deleting themselves
    if (userId === auth.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return handleAuthError(error)
  }
}
