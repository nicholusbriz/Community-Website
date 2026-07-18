// app/lib/auth/roles.ts
import { PrismaClient } from '@prisma/client'

let roleCache: Map<string, string> | null = null
let isInitializedFlag = false
let initializationError: Error | null = null

// ============================================================
// ROLE CHECK FUNCTIONS
// ============================================================

// Role names as constants
export const ROLES = {
  USER: 'USER',
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  PROJECT_LEAD: 'PROJECT_LEAD',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

/**
 * Check if user has a specific role (checks if user role matches any in list)
 */
export function hasRole(userRole: string | undefined | null, requiredRole: string): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

/**
 * Check if user has exact role match
 */
export function hasExactRole(userRole: string | undefined | null, requiredRole: string): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

/**
 * Check if user is ADMIN (exact match)
 */
export function isAdmin(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  // ✅ Make sure we're checking for 'ADMIN' exactly
  return userRole === 'ADMIN'
}

/**
 * Check if user is SUPERADMIN (exact match)
 */
export function isSuperAdmin(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  // ✅ Make sure we're checking for 'SUPERADMIN' exactly
  return userRole === 'SUPERADMIN'
}

/**
 * Check if user is MENTOR (exact match)
 */
export function isMentor(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  return userRole === 'MENTOR'
}

/**
 * Check if user is STUDENT (exact match)
 */
export function isStudent(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  return userRole === 'STUDENT'
}

/**
 * Check if user is regular USER (exact match)
 */
export function isUser(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  return userRole === 'USER'
}

/**
 * Check if user is ADMIN or SUPERADMIN
 */
export function isAdminOrSuperAdmin(userRole: string | undefined | null): boolean {
  if (!userRole) return false
  return userRole === 'ADMIN' || userRole === 'SUPERADMIN'
}

// ============================================================
// ROLE CACHE FUNCTIONS
// ============================================================

export async function initializeRoleCache(prisma: PrismaClient) {
  if (isInitializedFlag) return
  
  try {
    console.log('🔍 Initializing role cache...')
    
    let retries = 5
    let lastError: Error | null = null
    
    while (retries > 0) {
      try {
        const roles = await prisma.role.findMany({
          select: { id: true, name: true },
        })
        
        if (roles.length === 0) {
          initializationError = new Error('No roles found in database. Please seed the database.')
          throw initializationError
        }
        
        roleCache = new Map()
        for (const role of roles) {
          roleCache.set(role.id, role.name)
        }
        
        console.log(`✅ Role cache initialized successfully (${roles.length} roles)`)
        isInitializedFlag = true
        return
        
      } catch (error) {
        lastError = error as Error
        retries--
        console.log(`⚠️ Role cache initialization failed (${retries} retries left):`, error)
        
        if (retries > 0) {
          const delay = Math.pow(2, 5 - retries) * 2000
          console.log(`⏳ Waiting ${delay/1000}s before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    initializationError = lastError || new Error('Failed to initialize role cache after 5 retries')
    throw initializationError
    
  } catch (error) {
    console.error('❌ Failed to initialize role cache:', error)
    initializationError = error as Error
    isInitializedFlag = false
    throw error
  }
}

export function getRoleName(roleId: string): string | undefined {
  if (!roleCache) {
    throw new Error('Role cache not initialized. Call initializeRoleCache first.')
  }
  return roleCache.get(roleId)
}

export function getRoleId(roleName: string): string | undefined {
  if (!roleCache) {
    throw new Error('Role cache not initialized. Call initializeRoleCache first.')
  }
  for (const [id, name] of roleCache) {
    if (name === roleName) return id
  }
  return undefined
}

export function isInitialized(): boolean {
  return isInitializedFlag
}

export function getInitializationError(): Error | null {
  return initializationError
}