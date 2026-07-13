// app/lib/auth/roles.ts
// Centralized role hierarchy and utilities (database-driven - NO FALLBACK)

export type UserRole = string  // Dynamic roles from database

// Cache for role hierarchy (will be populated from database)
let roleCache: Map<string, number> | null = null

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
  roleCache = new Map(roles.map((r: any) => [r.name, r.level]))
  console.log('✅ Role cache initialized with', roles.length, 'roles')
}

/**
 * Get role level from cache
 * Returns 0 if role not found or cache not initialized
 */
function getRoleLevel(roleName: string | undefined | null): number {
  if (!roleName || !roleCache) return 0
  return roleCache.get(roleName) ?? 0
}

/**
 * Check if user has required role or higher (using database hierarchy)
 * @param userRole - User's current role name
 * @param requiredRole - Minimum role name required
 * @returns boolean
 */
export function hasRole(userRole: UserRole | string | undefined | null, requiredRole: string): boolean {
  if (!userRole) return false
  
  const userLevel = getRoleLevel(userRole)
  const requiredLevel = getRoleLevel(requiredRole)
  
  return userLevel >= requiredLevel
}

/**
 * Check if user has specific role (exact match)
 */
export function hasExactRole(userRole: UserRole | string | undefined | null, requiredRole: string): boolean {
  return userRole === requiredRole
}

/**
 * Check if user is admin or higher (ADMIN, SUPERADMIN, or any role with level >= 3)
 */
export function isAdmin(userRole: UserRole | string | undefined | null): boolean {
  return getRoleLevel(userRole) >= 3
}

/**
 * Check if user is superadmin or higher (SUPERADMIN or any role with level >= 4)
 */
export function isSuperAdmin(userRole: UserRole | string | undefined | null): boolean {
  return getRoleLevel(userRole) >= 4
}

/**
 * Check if user has meteor role or higher (level >= 5)
 */
export function isMeteor(userRole: UserRole | string | undefined | null): boolean {
  return getRoleLevel(userRole) >= 5
}

/**
 * Get all roles that can access a given role level
 */
export async function getAllowedRoles(prisma: any, requiredRole: string): Promise<string[]> {
  const role = await prisma.role.findUnique({
    where: { name: requiredRole }
  })
  
  if (!role) return []
  
  const roles = await prisma.role.findMany({
    where: {
      level: {
        gte: role.level
      }
    },
    orderBy: {
      level: 'asc'
    }
  })
  
  return roles.map((r: any) => r.name)
}
