import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$DMLsg9lWdSG93f2sZUvO4O0Fh80pznQjmkGdFCYsiTJPvSCNQwQnS';

// Convert string secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // Fetch admin user from database
  const admin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });

  if (!admin) {
    // Fallback to env variable for backward compatibility during migration
    console.warn('[Auth] No admin user in database, falling back to env variable');
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  }

  // Compare password with database hash
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
  return !!payload;
}

export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized');
  }
}

export async function getAdminUser() {
  return prisma.admin.findUnique({
    where: { username: 'admin' }
  });
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { username: 'admin' },
    data: { password: hashedPassword }
  });
}
