// middleware.ts or app/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ============================================================
// 📋 ROUTE CONFIGURATION - Based on your folder structure
// ============================================================

// ============================================================
// 1️⃣ PUBLIC ROUTES (No authentication required)
// ============================================================
const publicRoutes = [
  '/',                    // Home page
  '/about',               // About page
  '/contact',             // Contact page
  '/faq',                 // FAQ page
  '/projects',            // Projects listing
  '/project/:path*',      // Individual project pages (dynamic)
  '/developers',          // Developers listing
  '/developer/:path*',    // Individual developer pages (dynamic)
  '/events',              // Events listing
  '/blog',                // Blog listing
  '/blog/:path*',         // Individual blog posts
  '/resources',           // Resources hub
  '/programs',            // Programs listing
  '/gallery',             // Gallery
  '/testimonials',        // Testimonials
  '/mentors',             // Mentors listing
  '/community',           // Community hub
]

// ============================================================
// 2️⃣ AUTH ROUTES (Redirect to dashboard if already logged in)
// ============================================================
const authRoutes = [
  '/join',                // Join/Signup page
  '/login',               // Login page
]

// ============================================================
// 3️⃣ API AUTH ROUTES (Always public - NextAuth handles auth)
// ============================================================
const apiAuthRoutes = [
  '/api/auth',
  '/api/auth/:path*',
]

// ============================================================
// 4️⃣ PROTECTED ROUTES (Any authenticated user - any role)
// ============================================================
const protectedRoutes = [
  '/dashboard',           // Dashboard home
  '/dashboard/:path*',    // All dashboard subpages
]

// ============================================================
// 5️⃣ ADMIN ROUTES (Requires ADMIN role - exact match)
// ============================================================
const adminRoutes = [
  '/admin',               // Admin dashboard
  '/admin/:path*',        // All admin subpages
]

// ============================================================
// 6️⃣ SUPERADMIN ROUTES (Requires SUPERADMIN role - exact match)
// ============================================================
const superAdminRoutes = [
  '/super',               // Super admin dashboard
  '/super/:path*',        // All super admin subpages
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
    // Handle exact matches
    return pathname === route
  })
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

  // Check route types
  const isAuthRoute = matchesRoute(pathname, authRoutes)
  const isPublicRoute = matchesRoute(pathname, publicRoutes)
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes)
  const isAdminRoute = matchesRoute(pathname, adminRoutes)
  const isSuperAdminRoute = matchesRoute(pathname, superAdminRoutes)
  const isApiAuthRoute = matchesRoute(pathname, apiAuthRoutes)

  // Get authentication data from JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const userRole = token?.role as string || 'USER'

  // ============================================================
  // 🔐 ROUTE AUTHORIZATION LOGIC
  // ============================================================

  // --------------------------------------------
  // 1️⃣ PUBLIC ROUTES - Allow access to everyone
  // --------------------------------------------
  if (isPublicRoute || isApiAuthRoute) {
    // If user is on auth page (join/login) and already authenticated,
    // redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 2️⃣ AUTH ROUTES - Allow access to unauthenticated users only
  // --------------------------------------------
  if (isAuthRoute) {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 3️⃣ PROTECTED ROUTES - Require any authenticated user
  // --------------------------------------------
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 4️⃣ ADMIN ROUTES - Require ADMIN role (exact match only)
  // --------------------------------------------
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // ✅ Exact role check - only ADMIN (not SUPERADMIN)
    if (userRole !== 'ADMIN') {
      return redirectWithError(
        request,
        '/dashboard',
        'ADMIN role required for this page',
        pathname
      )
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 5️⃣ SUPERADMIN ROUTES - Require SUPERADMIN role (exact match only)
  // --------------------------------------------
  if (isSuperAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL('/join', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // ✅ Exact role check - only SUPERADMIN (not ADMIN)
    if (userRole !== 'SUPERADMIN') {
      return redirectWithError(
        request,
        '/dashboard',
        'SUPERADMIN role required for this page',
        pathname
      )
    }
    return NextResponse.next()
  }

  // --------------------------------------------
  // 6️⃣ DEFAULT - Allow the request
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