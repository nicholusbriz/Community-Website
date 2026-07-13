// middleware/routes/public.ts
export const publicRoutes = [
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

export const authRoutes = [
  '/join',
  '/login',
]

export const apiAuthRoutes = [
  '/api/auth',
  '/api/auth/:path*',
]