// app/api/profile/delete-avatar/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function DELETE(request: Request) {
  try {
    const auth = await getAuthUser(request)

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user || !user.image) {
      return NextResponse.json({ error: 'No avatar to delete' }, { status: 400 })
    }

    const urlParts = user.image.split('/')
    const fileName = urlParts.slice(urlParts.indexOf('avatars') + 1).join('/')

    if (fileName) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName])

      if (error) {
        console.error('Supabase delete error:', error)
      }
    }

    await prisma.user.update({
      where: { id: auth.userId },
      data: { image: null },
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar deleted successfully',
    })
  } catch (error) {
    return handleAuthError(error)
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