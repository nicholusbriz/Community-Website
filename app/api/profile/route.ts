// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: Request) {
  console.log('🔍 Profile GET called')
  
  try {
    // ✅ Use getToken directly in API route
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log('📡 Token found:', !!token)

    if (!token?.id) {
      console.log('❌ No token or user ID found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: { role: true },
    })

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
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
          NOT: { id: token.id as string },
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
      where: { id: token.id as string },
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