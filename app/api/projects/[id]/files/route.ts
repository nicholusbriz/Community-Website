// app/api/projects/[id]/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// GET /api/projects/[id]/files - Get all files for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;

    // Verify user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    const project = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!membership && project?.ownerId !== auth.userId) {
      return NextResponse.json(
        { error: 'You must be a project member to view files' },
        { status: 403 }
      );
    }

    // TODO: Implement file listing from your storage solution
    // This depends on where you store files (Supabase, S3, etc.)
    // For now, return an empty array with a message

    return NextResponse.json({
      files: [],
      message: 'File management coming soon',
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return handleAuthError(error);
  }
}

// POST /api/projects/[id]/files - Upload a file to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id } = await params;
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Verify user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: auth.userId,
          projectId: id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'You must be a project member to upload files' },
        { status: 403 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, PDF, TXT' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Generate unique file name
    const fileName = `projects/${id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-files')
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    // TODO: Store file metadata in database if you have a File model
    // For now, return the file info

    // Log activity
    await prisma.activityLog.create({
      data: {
        projectId: id,
        userId: auth.userId,
        action: 'PROJECT_UPDATED',
        details: {
          action: 'FILE_UPLOADED',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          folder: folder,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
        folder: folder,
        uploadedAt: new Date().toISOString(),
        uploadedBy: {
          id: auth.userId,
          name: auth.user.name,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return handleAuthError(error);
  }
}