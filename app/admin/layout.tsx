'use client';

import SessionManager from '@/components/SessionManager';
import { usePathname } from 'next/navigation';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      {/* Only include SessionManager if not on login page */}
      {!isLoginPage && <SessionManager />}
      {children}
    </>
  );
}
