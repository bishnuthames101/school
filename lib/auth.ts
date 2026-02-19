import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { getSchoolId } from '@/lib/school';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Convert string secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const schoolId = await getSchoolId();

  // Find admin for this school
  const admin = await prisma.admin.findFirst({
    where: { schoolId },
  });

  if (!admin) {
    console.warn('[Auth] No admin user found for school');
    return false;
  }

  return bcrypt.compare(password, admin.password);
}

// Edge-compatible token generation using jose
export async function generateTokenEdge(payload: object): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey());
  return token;
}

// Edge-compatible token verification using jose
export async function verifyTokenEdge(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    console.error('[verifyTokenEdge] Verification failed:', error);
    return null;
  }
}

// Node.js token generation (for API routes)
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Node.js token verification (for API routes)
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const payload = verifyToken(token);
  if (!payload) return false;

  // Require schoolId in token — old tokens without it are rejected
  if (!payload.schoolId) return false;

  // Verify the token's schoolId matches this deployment
  const schoolId = await getSchoolId();
  if (payload.schoolId !== schoolId) return false;

  return true;
}

export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }
}

export async function getAdminUser() {
  const schoolId = await getSchoolId();
  return prisma.admin.findFirst({
    where: { schoolId },
  });
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const schoolId = await getSchoolId();
  const hashedPassword = await hashPassword(newPassword);

  const admin = await prisma.admin.findFirst({
    where: { schoolId },
  });

  if (!admin) throw new Error('Admin user not found');

  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
  });
}
