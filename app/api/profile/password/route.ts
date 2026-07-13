// app/api/profile/delete-avatar/route.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@supabase/supabase-js'

// Use service role key for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Avatar deletion may fail due to RLS policies.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function DELETE(request: Request) {
  try {
    // ✅ Use getToken directly instead of requireAuth
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = token.id as string

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.image) {
      return NextResponse.json(
        { error: 'No avatar to delete' },
        { status: 400 }
      )
    }

    // Extract file path from URL
    const urlParts = user.image.split('/')
    const fileName = urlParts.slice(urlParts.indexOf('avatars') + 1).join('/')

    // Delete from Supabase Storage
    if (fileName) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName])

      if (error) {
        console.error('Supabase delete error:', error)
        // Continue anyway, update the user record
      }
    }

    // Update user to remove avatar URL
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar deleted successfully',
    })
  } catch (error) {
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}