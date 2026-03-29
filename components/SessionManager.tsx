'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

const SESSION_TIMEOUT = 5 * 60 * 1000;   // 5 minutes
const WARNING_BEFORE = 1 * 60 * 1000;   // Warn when 1 minute remains
const CHECK_INTERVAL = 10 * 1000;       // Check every 10 seconds
const SESSION_KEY = 'admin_session_active';
const LAST_ACTIVITY_KEY = 'admin_last_activity';

export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggingOutRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const updateActivity = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  };

  const logout = async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    if (countdownRef.current) clearInterval(countdownRef.current);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(LAST_ACTIVITY_KEY);
      }
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login?session=expired');
    } catch {
      router.push('/admin/login?session=expired');
    }
  };

  const handleStayLoggedIn = () => {
    updateActivity();
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = (secondsRemaining: number) => {
    setSecondsLeft(secondsRemaining);
    setShowWarning(true);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkSession = () => {
    if (typeof window === 'undefined') return;

    const sessionActive = sessionStorage.getItem(SESSION_KEY);
    if (!sessionActive) {
      logout();
      return;
    }

    const lastActivityStr = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) {
      logout();
      return;
    }

    const timeSinceActivity = Date.now() - parseInt(lastActivityStr, 10);

    if (timeSinceActivity >= SESSION_TIMEOUT) {
      logout();
      return;
    }

    const msRemaining = SESSION_TIMEOUT - timeSinceActivity;

    if (msRemaining <= WARNING_BEFORE) {
      const secondsRemaining = Math.ceil(msRemaining / 1000);
      if (!showWarning) {
        startCountdown(secondsRemaining);
      }
    } else {
      // Still plenty of time — hide warning if it was showing
      if (showWarning) {
        setShowWarning(false);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }
  };

  useEffect(() => {
    if (!pathname.startsWith('/admin') || pathname === '/admin/login') return;

    const sessionActive = sessionStorage.getItem(SESSION_KEY);
    if (!sessionActive) {
      logout();
      return;
    }

    updateActivity();

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((e) => window.addEventListener(e, updateActivity));

    const intervalId = setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(intervalId);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [pathname]);

  if (!showWarning) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-50 border-t-2 border-amber-400 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            Your session will expire in{' '}
            <span className="font-bold tabular-nums">
              {minutes}:{seconds}
            </span>
            . Unsaved changes will be lost.
          </span>
        </div>
        <button
          onClick={handleStayLoggedIn}
          className="flex-shrink-0 text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
}

export function initializeSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, 'true');
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  }
}
