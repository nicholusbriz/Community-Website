// app/api/projects/[id]/files/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// GET /api/projects/[id]/files/[fileId] - Get a specific file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, fileId } = await params;

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

    // TODO: Get file metadata from database
    // For now, return a placeholder

    return NextResponse.json({
      file: {
        id: fileId,
        projectId: id,
        name: 'File details coming soon',
        url: null,
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return handleAuthError(error);
  }
}

// DELETE /api/projects/[id]/files/[fileId] - Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    const { id, fileId } = await params;

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
        { error: 'You must be a project member to delete files' },
        { status: 403 }
      );
    }

    // TODO: Check if user has permission (owner or file uploader)
    // TODO: Delete file from storage
    // TODO: Delete file metadata from database

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return handleAuthError(error);
  }
}