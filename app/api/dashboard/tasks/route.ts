import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // TODO: Implement user tasks
    // Get tasks assigned to user
    // Filter by status if provided
    
    return NextResponse.json({
      tasks: [],
      pagination: { page: 1, limit: 20, total: 0 },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
