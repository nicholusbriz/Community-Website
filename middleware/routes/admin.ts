// middleware/routes/admin.ts
export const adminRoutes = [
  '/admin',
  '/admin/:path*',
]

// Routes that only SUPERADMIN can access
export const superAdminRoutes = [
  '/admin/super',
  '/admin/super/:path*',
  '/admin/users',
  '/admin/users/:path*',
  '/admin/system',
  '/admin/system/:path*',
]