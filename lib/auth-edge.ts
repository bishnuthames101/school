import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_SECRET = process.env.JWT_SECRET;

const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

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
    console.error('[verifyTokenEdge] Token verification failed');
    return null;
  }
}
