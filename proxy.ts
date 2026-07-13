// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { serverAuthMiddleware } from './middleware/auth/server'
import { publicRoutes, authRoutes, apiAuthRoutes } from './middleware/routes/public'
import { protectedRoutes } from './middleware/routes/protected'
import { adminRoutes, superAdminRoutes } from './middleware/routes/admin'

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

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Check if it's an auth route (join, login)
  const isAuthRoute = matchesRoute(pathname, authRoutes)

  // 2. Check if it's a public route
  const isPublicRoute = matchesRoute(pathname, publicRoutes)

  // 3. Check if it's a protected route
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes)

  // 4. Check if it's an admin route
  const isAdminRoute = matchesRoute(pathname, adminRoutes)

  // 5. Check if it's a SUPERADMIN only route
  const isSuperAdminRoute = matchesRoute(pathname, superAdminRoutes)

  // 6. Check if it's an API auth route (always public)
  const isApiAuthRoute = matchesRoute(pathname, apiAuthRoutes)

  // Get server-side auth data
  const { token, isAuthenticated, user, hasRole, isAdmin, isSuperAdmin } = await serverAuthMiddleware(request)

  // 🔐 Public routes - allow access
  if (isPublicRoute || isApiAuthRoute) {
    // Redirect authenticated users away from auth pages (join, login)
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 🔒 Protected routes - require authentication
  // This includes: /dashboard, /profile, /settings, /messages, etc.
  if (isProtectedRoute) {
    // If not authenticated, redirect to join page
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // ✅ User is authenticated, allow access
    return NextResponse.next()
  }

  // 👑 SUPERADMIN routes - only SUPERADMIN can access
  if (isSuperAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (!isSuperAdmin()) {
      // Redirect to dashboard with an error message
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'Insufficient permissions')
      return NextResponse.redirect(url)
    }

    // ✅ User is SUPERADMIN, allow access
    return NextResponse.next()
  }

  // 🔑 Admin routes - require ADMIN or SUPERADMIN role
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    if (!isAdmin()) {
      // Redirect to dashboard with an error message
      const url = new URL('/dashboard', request.url)
      url.searchParams.set('error', 'Insufficient permissions')
      return NextResponse.redirect(url)
    }

    // ✅ User has admin or superadmin role, allow access
    return NextResponse.next()
  }

  // ✅ Allow the request
  return NextResponse.next()
}

// Configure which routes the middleware runs on
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