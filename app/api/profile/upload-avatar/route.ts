// app/api/profile/upload-avatar/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, WEBP, or GIF' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExt = file.name.split('.').pop()
    const fileName = `${auth.userId}/${Date.now()}-${auth.userId}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })

    if (error) {
      console.error('❌ Supabase upload error:', error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = urlData.publicUrl

    await prisma.user.update({
      where: { id: auth.userId },
      data: { image: avatarUrl },
    })

    return NextResponse.json({
      success: true,
      url: avatarUrl,
    })
  } catch (error) {
    return handleAuthError(error)
  }
}

export const dynamic = 'force-dynamic'