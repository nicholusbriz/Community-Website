// app/lib/auth/api-utils.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { hasRole, isAdmin, isSuperAdmin, UserRole } from './roles'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
  roleId: string
  image: string | null
  username: string | null
  roleLevel: number
}

export interface AuthContext {
  user: AuthUser
  userId: string
  role: string
  roleId: string
  roleLevel: number
  token: any
  isAdmin: boolean
  isSuperAdmin: boolean
  hasRole: (role: UserRole) => boolean
}

/**
 * Get the authenticated user from the request
 * @throws {Error} If not authenticated or user not found
 */
export async function getAuthUser(request: Request): Promise<AuthContext> {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.id) {
    throw new Error('Unauthorized')
  }

  // ✅ Get user with role from database - NO FALLBACKS
  const user = await prisma.user.findUnique({
    where: { id: token.id as string },
    include: { 
      role: true 
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // ✅ Role must exist in database - NO FALLBACKS
  if (!user.role) {
    throw new Error('User role not found in database')
  }

  const userRole = user.role.name
  const roleLevel = user.role.level

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
      roleId: user.roleId,
      image: user.image,
      username: user.username,
      roleLevel: roleLevel,
    },
    userId: user.id,
    role: userRole,
    roleId: user.roleId,
    roleLevel: roleLevel,
    token,
    isAdmin: isAdmin(userRole),
    isSuperAdmin: isSuperAdmin(userRole),
    hasRole: (requiredRole: UserRole) => hasRole(userRole, requiredRole),
  }
}

/**
 * Get the authenticated user without throwing an error
 * Returns null if not authenticated or user not found
 */
export async function getAuthUserSafe(request: Request): Promise<AuthContext | null> {
  try {
    return await getAuthUser(request)
  } catch {
    return null
  }
}

/**
 * Require a specific role
 * @throws {Error} If user doesn't have the required role
 */
export async function requireRole(request: Request, requiredRole: UserRole): Promise<AuthContext> {
  const auth = await getAuthUser(request)
  
  if (!auth.hasRole(requiredRole)) {
    throw new Error(`Forbidden: ${requiredRole} role required`)
  }
  
  return auth
}

/**
 * Require SUPERADMIN role
 * @throws {Error} If user is not SUPERADMIN
 */
export async function requireSuperAdmin(request: Request): Promise<AuthContext> {
  const auth = await getAuthUser(request)
  
  if (!auth.isSuperAdmin) {
    throw new Error('Forbidden: SUPERADMIN role required')
  }
  
  return auth
}

/**
 * Require ADMIN or SUPERADMIN role
 * @throws {Error} If user is not ADMIN or SUPERADMIN
 */
export async function requireAdmin(request: Request): Promise<AuthContext> {
  const auth = await getAuthUser(request)
  
  if (!auth.isAdmin) {
    throw new Error('Forbidden: ADMIN role required')
  }
  
  return auth
}

/**
 * Handle authentication errors in API routes
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (error.message === 'User role not found in database') {
      return NextResponse.json({ error: 'User role not found in database' }, { status: 500 })
    }
    if (error.message.includes('role required')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
  }
  
  console.error('Auth error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

/**
 * Create a standard JSON response with user data
 */
export function createUserResponse(user: any) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    github: user.github,
    linkedin: user.linkedin,
    portfolio: user.portfolio,
    role: user.role?.name,
    roleId: user.roleId,
    createdAt: user.createdAt,
  }
}