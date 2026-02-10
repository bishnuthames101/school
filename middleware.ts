import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth';

// Define paths that require authentication
const protectedPaths = [
  '/admin/dashboard',
  '/admin/events',
  '/admin/notices',
  '/admin/gallery',
  '/admin/applications',
  '/admin/contacts',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token (using Edge-compatible function)
    const payload = await verifyTokenEdge(token);

    // If token is invalid, redirect to login
    if (!payload) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing login page while already authenticated, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      const payload = await verifyTokenEdge(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
