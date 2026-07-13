// app/api/profile/route.ts (simplified)
import { NextResponse } from 'next/server'

// Temporarily comment out complex imports
// import { getAuth, requireAuth } from '@/app/lib/auth/server'
// import { prisma } from '@/app/lib/prisma'

export async function GET() {
  return NextResponse.json({ 
    message: 'Profile API is loading!',
    // For now, return mock data
    user: {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    }
  })
}