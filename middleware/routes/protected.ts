// middleware/routes/protected.ts
export const protectedRoutes = [
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