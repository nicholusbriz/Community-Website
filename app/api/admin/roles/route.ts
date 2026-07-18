// app/api/admin/roles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminOrSuperAdmin, handleAuthError } from '@/app/lib/auth/api-utils'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminOrSuperAdmin(request)
    
    // Get all roles
    const roles = await prisma.role.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    // Filter roles based on user permissions
    const filteredRoles = roles.filter(role => {
      // Exclude PROJECT_LEAD from global role management
      if (role.name === 'PROJECT_LEAD') return false
      
      // If not superadmin, exclude SUPERADMIN
      if (!auth.isSuperAdmin && role.name === 'SUPERADMIN') return false
      
      return true
    })
    
    return NextResponse.json(filteredRoles)
  } catch (error) {
    console.error('❌ Error fetching roles:', error)
    return handleAuthError(error)
  }
}