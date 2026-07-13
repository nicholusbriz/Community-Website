// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getAuth, requireAuth } from '@/app/lib/auth/server'
import { prisma } from '@/app/lib/prisma'

// ✅ GET - Public (no authentication required)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') // Optional: get specific user

    // If userId is provided, get that user (public)
    // Otherwise, try to get the authenticated user
    let user

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: true,
        },
      })
    } else {
      // Try to get authenticated user
      const session = await getAuth()
      if (session?.user) {
        user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: {
            role: true,
          },
        })
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Public profile data (excludes sensitive info)
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
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// ✅ PUT - Protected (requires authentication)
export async function PUT(request: Request) {
  try {
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

    // Check if username is taken (if changed)
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
      include: {
        role: true,
      },
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