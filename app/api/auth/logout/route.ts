import { NextResponse } from 'next/server';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST() {
  logAction('LOGOUT', 'Admin');
  const response = NextResponse.json(
    { message: 'Logout successful', success: true },
    { status: 200 }
  );

  // Clear the auth token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
