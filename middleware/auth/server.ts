// middleware/auth/server.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { hasRole, isAdmin, isSuperAdmin, UserRole } from '@/app/lib/auth/roles'

export async function serverAuthMiddleware(request: NextRequest) {
  // Get the session token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  const pathname = request.nextUrl.pathname

  // Check if user is authenticated
  const isAuthenticated = !!token
  const userRole = token?.role as UserRole | undefined

  return {
    token,
    isAuthenticated,
    user: token ? {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: userRole,
    } : null,
    hasRole: (requiredRole: UserRole) => hasRole(userRole, requiredRole),
    isAdmin: () => isAdmin(userRole),
    isSuperAdmin: () => isSuperAdmin(userRole),
  }
}