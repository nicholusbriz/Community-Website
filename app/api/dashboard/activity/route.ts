import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, handleAuthError } from '@/app/lib/auth/api-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    
    // TODO: Implement GET logic
    return NextResponse.json({ 
      message: 'GET endpoint',
      user: auth.user,
      data: null 
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
