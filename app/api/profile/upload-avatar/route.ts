// app/api/profile/upload-avatar/route.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/app/lib/prisma'
import { createClient } from '@supabase/supabase-js'

// Use service role key for server-side uploads (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Avatar uploads may fail due to RLS policies.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, WEBP, or GIF' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename with user ID folder (required by storage policy)
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${userId}.${fileExt}`

    console.log('📤 Uploading avatar:', {
      userId,
      fileName,
      fileSize: file.size,
      bucket: 'avatars',
      mimeType: file.type
    })

    // Upload to Supabase Storage with folder structure required by policy
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })

    if (error) {
      console.error('❌ Supabase upload error:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        status: (error as any).status,
        statusCode: (error as any).statusCode,
      })

      if (error.message?.includes('bucket not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "avatars" not found. Please create it in Supabase dashboard.' },
          { status: 400 }
        )
      }

      if (error.message?.includes('Invalid path')) {
        return NextResponse.json(
          { error: 'Invalid storage path. Please check your Supabase bucket configuration.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = urlData.publicUrl

    console.log('✅ Avatar uploaded successfully:', avatarUrl)

    // Update user with new avatar URL
    await prisma.user.update({
      where: { id: userId },
      data: { image: avatarUrl },
    })

    return NextResponse.json({
      success: true,
      url: avatarUrl,
    })
  } catch (error) {
    console.error('❌ Avatar upload error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'