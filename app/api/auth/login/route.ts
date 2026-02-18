import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateToken } from '@/lib/auth';
import { getSchoolId } from '@/lib/school';

export async function POST(request: NextRequest) {
  try {
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

    // Include schoolId in the JWT payload
    const schoolId = await getSchoolId();
    const token = generateToken({
      role: 'admin',
      schoolId,
      loginTime: new Date().toISOString(),
    });

    // Create response with cookie
    const response = NextResponse.json(
      { message: 'Login successful', success: true },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
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
