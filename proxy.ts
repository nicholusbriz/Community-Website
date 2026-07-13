// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ============================================================
// 📋 ROUTE CONFIGURATION - All routes in one place
// ============================================================

// Public routes (no authentication required)
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/projects',
  '/project/:path*',
  '/developers',
  '/developer/:path*',
  '/events',
  '/blog',
  '/resources',
  '/programs',
  '/gallery',
  '/testimonials',
  '/mentors',
  '/community',
]

// Auth routes (redirect to dashboard if already logged in)
const authRoutes = [
  '/join',
  '/login',
]

// API auth routes (always public)
const apiAuthRoutes = [
  '/api/auth',
  '/api/auth/:path*',
]

// Protected routes (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/dashboard/:path*',
  '/profile',
  '/profile/:path*',
  '/settings',
  '/settings/:path*',
  '/messages',
  '/messages/:path*',
  '/projects/new',
  '/projects/:path*/edit',
]

// Admin routes (require ADMIN or SUPERADMIN role)
const adminRoutes = [
  '/admin',
  '/admin/:path*',
]

// SUPERADMIN only routes
const superAdminRoutes = [
  '/admin/super',
  '/admin/super/:path*',
  '/admin/users',
  '/admin/users/:path*',
  '/admin/system',
  '/admin/system/:path*',
]

// ============================================================
// 🔧 HELPER FUNCTIONS
// ============================================================

// Helper to check if path matches any route pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route.includes(':path*')) {
      const baseRoute = route.replace(':path*', '')
      return pathname === baseRoute || pathname.startsWith(baseRoute)
    }
    return pathname === route
  })
}

// ============================================================
// 🚀 MAIN PROXY
// ============================================================

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check route types
  const isAuthRoute = matchesRoute(pathname, authRoutes)
  const isPublicRoute = matchesRoute(pathname, publicRoutes)
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes)
  const isAdminRoute = matchesRoute(pathname, adminRoutes)
  const isSuperAdminRoute = matchesRoute(pathname, superAdminRoutes)
  const isApiAuthRoute = matchesRoute(pathname, apiAuthRoutes)

  // Get authentication data
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const userRole = token?.role as string || 'USER'

  // ============================================================
  // 🔐 ROUTE AUTHORIZATION LOGIC
  // ============================================================

  // 1. Public routes - allow access
  if (isPublicRoute || isApiAuthRoute) {
    // Redirect authenticated users away from auth pages (join, login)
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 2. Protected routes - require authentication
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 3. SUPERADMIN routes - only SUPERADMIN
  if (isSuperAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (userRole !== 'SUPERADMIN') {
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'Insufficient permissions')
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 4. Admin routes - ADMIN or SUPERADMIN
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'Insufficient permissions')
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 5. Allow the request
  return NextResponse.next()
}

// ============================================================
// ⚙️ PROXY CONFIGURATION
// ============================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (API auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}