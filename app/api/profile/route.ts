// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { 
  getAuthUser, 
  handleAuthError, 
  createUserResponse 
} from '@/app/lib/auth/api-utils'

export async function GET(request: Request) {
  try {
    // ✅ Get authenticated user with role from database
    const auth = await getAuthUser(request)

    // ✅ User and role are verified from database
    // No fallbacks - if role doesn't exist, it throws an error

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(createUserResponse(user))
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getAuthUser(request)

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

    // Check if username is taken
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: auth.userId },
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
      where: { id: auth.userId },
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

    return NextResponse.json(createUserResponse(updatedUser))
  } catch (error) {
    return handleAuthError(error)
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