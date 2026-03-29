import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateToken } from '@/lib/auth';
import { getSchoolId } from '@/lib/school';
import { logAction } from '@/lib/audit';

// ---------------------------------------------------------------------------
// In-memory rate limiter — 5 failed attempts per IP per 15 minutes
// Sufficient for single-instance Vercel deployment (per-region isolation is OK)
// ---------------------------------------------------------------------------
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count++;
  return { allowed: true };
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Check rate limit before doing anything else
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds ?? 900) / 60);
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds ?? 900),
          },
        }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify admin password (scoped to this school)
    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Successful login — clear failed attempts for this IP
    resetRateLimit(ip);

    // Include schoolId + schoolSlug in the JWT payload
    const schoolId = await getSchoolId();
    const schoolSlug = process.env.SCHOOL_ID || '';
    const token = generateToken({
      role: 'admin',
      schoolId,
      schoolSlug,
      loginTime: new Date().toISOString(),
    });

    logAction('LOGIN', 'Admin', undefined, `IP: ${ip}`);

    const response = NextResponse.json(
      { message: 'Login successful', success: true },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
