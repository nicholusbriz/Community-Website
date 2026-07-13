// app/lib/auth/server.ts
import { cache } from "react"
import { getToken } from "next-auth/jwt"
import { cookies } from "next/headers"
import { hasRole, isAdmin, isSuperAdmin, UserRole } from "./roles"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || ""

if (!JWT_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set in environment variables")
}

// Centralized server-side auth getter (cached)
export const getAuth = cache(async () => {
  try {
    // Get cookies from the request
    const cookieStore = await cookies()
    
    // Get the session token cookie name (varies by NextAuth config)
    const sessionToken = cookieStore.get('next-auth.session-token')?.value
    
    if (!sessionToken) {
      return null
    }
    
    // Use NextAuth's getToken to properly decode the session token
    // This handles the encryption that NextAuth applies
    const token = await getToken({
      req: {
        cookies: {
          'next-auth.session-token': sessionToken,
        },
      } as any,
      secret: JWT_SECRET,
      // raw: true // Don't use raw - let getToken decode it
    })
    
    if (!token) {
      return null
    }
    
    // Return session-like object
    return {
      user: {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string || 'USER',
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Error verifying auth token:', error)
    return null
  }
})

// Server-side role checking
export async function requireAuth() {
  const session = await getAuth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  return session
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole
  
  if (!hasRole(userRole, requiredRole)) {
    throw new Error(`Role ${userRole} not allowed. Required: ${requiredRole}`)
  }
  
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole
  
  if (!isAdmin(userRole)) {
    throw new Error(`Role ${userRole} not allowed. Required: ADMIN or SUPERADMIN`)
  }
  
  return session
}

export async function requireSuperAdmin() {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole
  
  if (!isSuperAdmin(userRole)) {
    throw new Error(`Role ${userRole} not allowed. Required: SUPERADMIN`)
  }
  
  return session
}

// Helper to check if user has a role (doesn't throw)
export async function hasRoleCheck(roles: UserRole | UserRole[]) {
  try {
    const session = await getAuth()
    if (!session?.user) return false
    
    const userRole = session.user.role as UserRole
    const roleList = Array.isArray(roles) ? roles : [roles]
    return roleList.some(role => hasRole(userRole, role))
  } catch {
    return false
  }
}

// Get the current user without throwing
export async function getCurrentUser() {
  const session = await getAuth()
  return session?.user || null
}