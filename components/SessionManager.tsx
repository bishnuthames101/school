'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds
const CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds
const SESSION_KEY = 'admin_session_active';
const LAST_ACTIVITY_KEY = 'admin_last_activity';

export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOutRef = useRef(false);

  // Update last activity time
  const updateActivity = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  };

  // Logout function
  const logout = async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(LAST_ACTIVITY_KEY);
      }

      // Call logout API to clear cookie
      await fetch('/api/auth/logout', { method: 'POST' });

      // Redirect to login
      router.push('/admin/login?session=expired');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if API call fails
      router.push('/admin/login?session=expired');
    }
  };

  // Check session validity
  const checkSession = () => {
    if (typeof window === 'undefined') return;

    // Check if session marker exists (clears on page reload)
    const sessionActive = sessionStorage.getItem(SESSION_KEY);
    if (!sessionActive) {
      console.log('[SessionManager] Session not found - page was reloaded or session expired');
      logout();
      return;
    }

    // Check last activity time
    const lastActivityStr = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) {
      console.log('[SessionManager] No activity timestamp found');
      logout();
      return;
    }

    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    const timeSinceActivity = now - lastActivity;

    if (timeSinceActivity > SESSION_TIMEOUT) {
      console.log(`[SessionManager] Session timeout: ${timeSinceActivity}ms since last activity`);
      logout();
      return;
    }

    // Log remaining time for debugging
    const remainingTime = Math.ceil((SESSION_TIMEOUT - timeSinceActivity) / 1000);
    console.log(`[SessionManager] Session valid. ${remainingTime}s remaining`);
  };

  useEffect(() => {
    // Only run in admin routes
    if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
      return;
    }

    // Check if session exists on mount
    const sessionActive = sessionStorage.getItem(SESSION_KEY);
    if (!sessionActive) {
      console.log('[SessionManager] No active session on mount - redirecting to login');
      logout();
      return;
    }

    // Initialize last activity time
    updateActivity();

    // Activity event listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Start periodic session check
    checkIntervalRef.current = setInterval(checkSession, CHECK_INTERVAL);

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [pathname, router]);

  return null; // This component doesn't render anything
}

// Export function to initialize session (call after successful login)
export function initializeSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, 'true');
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    console.log('[SessionManager] Session initialized');
  }
}

// Export function to clear session
export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    console.log('[SessionManager] Session cleared');
  }
}
