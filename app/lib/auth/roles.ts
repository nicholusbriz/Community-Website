// app/lib/auth/roles.ts
// Simple role checking - exact role matching only (no hierarchy)

export type UserRole = string  // Dynamic roles from database

// Cache for available roles (will be populated from database)
let roleCache: Set<string> | null = null

/**
 * Initialize role cache from database
 * Call this on server startup or when roles change
 * Throws error if database is not available
 */
export async function initializeRoleCache(prisma: any) {
  const roles = await prisma.role.findMany()
  if (roles.length === 0) {
    throw new Error('No roles found in database. Please run seed script first.')
  }
  roleCache = new Set(roles.map((r: any) => r.name))
  console.log('✅ Role cache initialized with', roles.length, 'roles:', Array.from(roleCache))
}

/**
 * Check if user has specific role (exact match only)
 * @param userRole - User's current role name
 * @param requiredRole - Required role name
 * @returns boolean
 */
export function hasRole(userRole: UserRole | string | undefined | null, requiredRole: string): boolean {
  return userRole === requiredRole
}

/**
 * Check if user has specific role (exact match) - alias for hasRole
 */
export function hasExactRole(userRole: UserRole | string | undefined | null, requiredRole: string): boolean {
  return userRole === requiredRole
}

/**
 * Check if user is admin (exact match)
 */
export function isAdmin(userRole: UserRole | string | undefined | null): boolean {
  return userRole === 'ADMIN'
}

/**
 * Check if user is superadmin (exact match)
 */
export function isSuperAdmin(userRole: UserRole | string | undefined | null): boolean {
  return userRole === 'SUPERADMIN'
}

/**
 * Check if user is mentor (exact match)
 */
export function isMentor(userRole: UserRole | string | undefined | null): boolean {
  return userRole === 'MENTOR'
}

/**
 * Check if user is student (exact match)
 */
export function isStudent(userRole: UserRole | string | undefined | null): boolean {
  return userRole === 'STUDENT'
}

/**
 * Check if user is regular user (exact match)
 */
export function isUser(userRole: UserRole | string | undefined | null): boolean {
  return userRole === 'USER'
}

/**
 * Check if a role exists in the database
 */
export function roleExists(roleName: string): boolean {
  return roleCache ? roleCache.has(roleName) : false
}

/**
 * Get all available roles from cache
 */
export function getAllRoles(): string[] {
  return roleCache ? Array.from(roleCache) : []
}
