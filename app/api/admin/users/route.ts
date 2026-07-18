// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { requireAdminOrSuperAdmin, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // ✅ Log the token to see what role is being passed
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })
    console.log('🔍 Token from request:', token)
    console.log('🔍 User role from token:', token?.role)
    
    // ✅ Now try to get the auth user
    const auth = await requireAdminOrSuperAdmin(request)
    console.log('✅ Auth user:', auth.user.email, 'Role:', auth.role)
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role') || ''
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: Prisma.UserWhereInput = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Filter by role (excluding PROJECT_LEAD from admin panel results)
    if (roleFilter) {
      where.role = { name: roleFilter }
    }
    
    // If no role filter is applied, we still include all users
    // but the frontend will handle filtering out PROJECT_LEAD from the dropdown
    
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        },
        _count: {
          select: {
            projectsCreated: true,
            projectsOwned: true,
            memberships: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const total = await prisma.user.count({ where })
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error in admin/users route:', error)
    return handleAuthError(error)
  }
}