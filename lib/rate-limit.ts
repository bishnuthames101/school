import { NextRequest } from 'next/server';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * Creates an in-memory rate limiter with its own isolated store.
 * Each call to createRateLimiter returns a separate limiter instance,
 * so different endpoints don't share counts.
 *
 * Suitable for single-instance Vercel deployments (one school per project).
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string): RateLimitResult {
    const now = Date.now();
    const record = store.get(key);

    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
      };
    }

    record.count++;
    return { allowed: true };
  };
}

/**
 * Extracts the real client IP from a Next.js request.
 * Respects x-forwarded-for (Vercel/proxies) and x-real-ip.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
