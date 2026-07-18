// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ============================================================
// 📋 ROUTE CONFIGURATION - DevCollab Hub
// ============================================================

// ============================================================
// 1️⃣ PUBLIC ROUTES (No authentication required)
// ============================================================
const publicRoutes = [
  '/',                    // Home page
  '/about',               // About page
  '/contact',             // Contact page
  '/faq',                 // FAQ page
  
  // Project Routes (Public viewing)
  '/projects',            // Projects listing
  '/projects/explore',    // Explore projects
  '/projects/search',     // Search projects
  '/projects/:path*',     // ✅ MOVED HERE: Individual project pages (public view)
  
  // Developer Routes (Public viewing)
  '/developers',          // Developers listing
  '/developers/:path*',   // Individual developer pages (public view)
  
  // Community Routes
  '/events',              // Events listing
  '/mentors',             // Mentors listing
  '/community',           // Community hub
]

// ============================================================
// 2️⃣ PUBLIC API ROUTES (No authentication required)
// ============================================================
const publicApiRoutes = [
  // Users API (Public)
  '/api/users',           // GET /api/users - List all users
  '/api/users/:path*',    // GET /api/users/[id] - Get user by ID
  
  // Projects API (Public)
  '/api/projects',        // GET /api/projects - List all projects
  '/api/projects/:path*', // GET /api/projects/[slug] - Get project by slug
  
  // Other public APIs
  '/api/roles',           // GET /api/roles - List all roles
]

// ============================================================
// 3️⃣ AUTH ROUTES (Redirect to dashboard if already logged in)
// ============================================================
const authRoutes = [
  '/join',                // Join/Signup page
  '/login',               // Login page
]

// ============================================================
// 4️⃣ API AUTH ROUTES (Always public - NextAuth handles auth)
// ============================================================
const apiAuthRoutes = [
  '/api/auth',
  '/api/auth/:path*',
]

// ============================================================
// 5️⃣ PROTECTED ROUTES (Any authenticated user - any role)
// ============================================================
const protectedRoutes = [
  // Dashboard
  '/dashboard',           // Dashboard home
  '/dashboard/:path*',    // All dashboard subpages
  
  // Project Creation & Management (Authenticated users)
  '/projects/create',     // Create project
  '/projects/manage',     // Manage my projects
  
  // ✅ REMOVED: '/projects/:path*' - Now in publicRoutes
  
  // Project Collaboration (Authenticated users - membership checked)
  '/projects/:path*/dashboard',  // Project dashboard (members only)
  '/projects/:path*/tasks',      // Project tasks (members only)
  '/projects/:path*/team',       // Project team (members only)
  '/projects/:path*/chat',       // Project chat (members only)
  '/projects/:path*/files',      // Project files (members only)
  '/projects/:path*/settings',   // Project settings (owner/lead/admin)
  
  // Protected API Routes
  '/api/dashboard',       // Dashboard API
  '/api/dashboard/:path*',// Dashboard API endpoints
  '/api/profile',         // Profile API
  '/api/profile/:path*',  // Profile API endpoints
]

// ============================================================
// 6️⃣ ADMIN ROUTES (Requires ADMIN role - SUPERADMIN also has access)
// ============================================================
const adminRoutes = [
  '/admin',               // Admin dashboard
  '/admin/:path*',        // All admin subpages
]

// ============================================================
// 7️⃣ SUPERADMIN ROUTES (Requires SUPERADMIN role - only SUPERADMIN)
// ============================================================
const superAdminRoutes = [
  '/super',               // Super admin dashboard
  '/super/:path*',        // All super admin subpages
]

// ============================================================
// 8️⃣ ADMIN API ROUTES (Requires ADMIN or SUPERADMIN)
// ============================================================
const adminApiRoutes = [
  '/api/admin',
  '/api/admin/:path*',
]

// ============================================================
// 🔧 HELPER FUNCTIONS
// ============================================================

// Helper to check if path matches any route pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Handle dynamic routes with :path* wildcard
    if (route.includes(':path*')) {
      const baseRoute = route.replace(':path*', '')
      return pathname === baseRoute || pathname.startsWith(baseRoute)
    }
    return pathname === route
  })
}

// Helper to extract project slug from pathname
function getProjectSlug(pathname: string): string | null {
  const match = pathname.match(/\/projects\/([^\/]+)/)
  return match ? match[1] : null
}

// Helper to check if path is a project management route
function isProjectManagementRoute(pathname: string): boolean {
  return pathname.includes('/settings') || 
         pathname.includes('/manage') ||
         pathname.includes('/admin/projects')
}

// Helper to check if path is a project member route
function isProjectMemberRoute(pathname: string): boolean {
  return pathname.includes('/dashboard') || 
         pathname.includes('/tasks') || 
         pathname.includes('/team') || 
         pathname.includes('/chat') || 
         pathname.includes('/files')
}

// Helper to check if user is project member (simplified - would need DB query)
async function isProjectMember(userId: string, projectSlug: string): Promise<boolean> {
  // TODO: Implement actual database check
  console.log(`📌 Checking if user ${userId} is member of project: ${projectSlug}`)
  return true // Placeholder - implement with actual DB query
}

// Helper to check if user is project owner or lead (simplified)
async function isProjectOwnerOrLead(userId: string, projectSlug: string): Promise<boolean> {
  // TODO: Implement actual database check
  console.log(`📌 Checking if user ${userId} is owner/lead of project: ${projectSlug}`)
  return true // Placeholder - implement with actual DB query
}

// Redirect helper with error messages
function redirectWithError(
  request: NextRequest,
  url: string,
  error: string,
  pathname: string
): NextResponse {
  const redirectUrl = new URL(url, request.url)
  redirectUrl.searchParams.set('error', error)
  redirectUrl.searchParams.set('redirected_from', pathname)
  return NextResponse.redirect(redirectUrl)
}

// ============================================================
// 🚀 MAIN PROXY HANDLER
// ============================================================

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get authentication data from JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const userRole = token?.role as string || 'USER'
  const userId = token?.id as string || ''

  // ============================================================
  // 🔐 ROUTE AUTHORIZATION LOGIC - Check in order of specificity
  // ============================================================

  // --------------------------------------------
  // 1️⃣ PUBLIC API ROUTES - Allow access to everyone
  // --------------------------------------------
  if (matchesRoute(pathname, publicApiRoutes)) {
    return NextResponse.next()
  }

  // --------------------------------------------
  // 2️⃣ API AUTH ROUTES - Always public (NextAuth handles auth)
  // --------------------------------------------
  if (matchesRoute(pathname, apiAuthRoutes)) {
    return NextResponse.next()
  }

  // --------------------------------------------
  // 3️⃣ AUTH ROUTES - Allow unauthenticated, redirect authenticated
  // --------------------------------------------
  if (matchesRoute(pathname, authRoutes)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 4️⃣ SUPERADMIN ROUTES - Require SUPERADMIN only
  // --------------------------------------------
  if (matchesRoute(pathname, superAdminRoutes)) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (userRole !== 'SUPERADMIN') {
      return redirectWithError(
        request,
        '/dashboard',
        'Super Admin access required for this page',
        pathname
      )
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 5️⃣ ADMIN ROUTES - Require ADMIN or SUPERADMIN
  // --------------------------------------------
  if (matchesRoute(pathname, adminRoutes) || matchesRoute(pathname, adminApiRoutes)) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return redirectWithError(
        request,
        '/dashboard',
        'Admin access required for this page',
        pathname
      )
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 6️⃣ PUBLIC ROUTES - Allow access to everyone (CHECKED BEFORE PROTECTED)
  // --------------------------------------------
  if (matchesRoute(pathname, publicRoutes)) {
    return NextResponse.next()
  }

  // --------------------------------------------
  // 7️⃣ PROTECTED ROUTES - Require any authenticated user
  // --------------------------------------------
  if (matchesRoute(pathname, protectedRoutes)) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // --------------------------------------------
    // 🎯 PROJECT-SPECIFIC PERMISSION CHECKS
    // --------------------------------------------
    
    // Check if this is a project route
    const projectSlug = getProjectSlug(pathname)
    
    if (projectSlug) {
      const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'
      
      // Check if this is a project management route (settings, etc.)
      if (isProjectManagementRoute(pathname)) {
        const isOwnerOrLead = await isProjectOwnerOrLead(userId, projectSlug)
        
        if (!isOwnerOrLead && !isAdmin) {
          return redirectWithError(
            request,
            `/projects/${projectSlug}`,
            'You do not have permission to manage this project',
            pathname
          )
        }
      }
      
      // Check if this is a project member route (dashboard, tasks, team, chat, files)
      if (isProjectMemberRoute(pathname)) {
        const isMember = await isProjectMember(userId, projectSlug)
        
        if (!isMember && !isAdmin) {
          return redirectWithError(
            request,
            `/projects/${projectSlug}`,
            'You must be a project member to access this page',
            pathname
          )
        }
      }
    }

    return NextResponse.next()
  }

  // --------------------------------------------
  // 8️⃣ DEFAULT - Allow the request
  // --------------------------------------------
  return NextResponse.next()
}

// ============================================================
// ⚙️ PROXY CONFIGURATION
// ============================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes - handled by NextAuth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, fonts, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}