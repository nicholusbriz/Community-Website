// app/api/profile/route.ts
import { NextResponse } from 'next/server'

// Try to import with fallback
let getAuth: any, requireAuth: any, prisma: any

try {
  const authServer = await import('@/app/lib/auth/server')
  getAuth = authServer.getAuth
  requireAuth = authServer.requireAuth
  console.log('✅ Auth server imported successfully')
} catch (error) {
  console.error('❌ Failed to import auth server:', error)
}

try {
  const prismaModule = await import('@/app/lib/prisma')
  prisma = prismaModule.prisma
  console.log('✅ Prisma imported successfully')
} catch (error) {
  console.error('❌ Failed to import prisma:', error)
}

export async function GET(request: Request) {
  console.log('🔍 Profile GET called')
  
  try {
    // If imports failed, return mock data
    if (!getAuth || !prisma) {
      console.log('⚠️ Imports not available, returning mock data')
      return NextResponse.json({
        id: 'mock-user-id',
        name: 'User (Mock)',
        username: '@user',
        image: null,
        bio: 'Mock profile data',
        location: 'Mock Location',
        skills: ['React', 'Next.js'],
        github: '',
        linkedin: '',
        portfolio: '',
        role: 'USER',
        createdAt: new Date().toISOString(),
      })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let user

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      })
    } else {
      const session = await getAuth()
      if (session?.user) {
        user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { role: true },
        })
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
      github: user.github,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      role: user.role?.name || 'USER',
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('❌ Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Check if imports are available
    if (!requireAuth || !prisma) {
      return NextResponse.json(
        { error: 'Server not fully initialized' },
        { status: 500 }
      )
    }

    const session = await requireAuth()
    const userId = session.user.id

    const body = await request.json()
    const {
      name,
      username,
      bio,
      location,
      skills,
      github,
      linkedin,
      portfolio,
    } = body

    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
        location,
        skills: skills || [],
        github,
        linkedin,
        portfolio,
      },
      include: { role: true },
    })

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      image: updatedUser.image,
      bio: updatedUser.bio,
      location: updatedUser.location,
      skills: updatedUser.skills,
      github: updatedUser.github,
      linkedin: updatedUser.linkedin,
      portfolio: updatedUser.portfolio,
      role: updatedUser.role?.name || 'USER',
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}