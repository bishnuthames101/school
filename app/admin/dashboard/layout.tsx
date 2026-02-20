'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSchoolConfig } from '@/lib/school-config';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  MonitorPlay,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { clearSession } from '@/components/SessionManager';

const config = getSchoolConfig();

const mainNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
];

const contentNav = [
  { name: 'Events', href: '/admin/dashboard/events', icon: Calendar },
  { name: 'Notices', href: '/admin/dashboard/notices', icon: Bell },
  { name: 'Gallery', href: '/admin/dashboard/gallery', icon: ImageIcon },
  { name: 'Popups', href: '/admin/dashboard/popups', icon: MonitorPlay },
];

const inboxNav = [
  { name: 'Applications', href: '/admin/dashboard/applications', icon: FileText },
  { name: 'Contacts', href: '/admin/dashboard/contacts', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();

      if (!data.authenticated) {
        window.location.href = '/admin/login';
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      clearSession();
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderNavSection = (label: string, items: typeof mainNav) => (
    <div className="mb-2">
      {!sidebarCollapsed && (
        <p className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </p>
      )}
      {sidebarCollapsed && <div className="pt-3" />}
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? item.name : undefined}
            className={`flex items-center transition-colors duration-200 mx-2 rounded-lg mb-0.5 ${
              sidebarCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-2.5'
            } ${
              isActive
                ? 'border-l-[3px] border-school-primary bg-white/10 text-white'
                : 'border-l-[3px] border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
          </Link>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-6">
            <Image src={config.logo} alt={config.name} width={64} height={64} className="object-contain mx-auto" />
          </div>
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-school-primary rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src={config.logo} alt={config.name} width={32} height={32} className="object-contain" />
          <span className="font-semibold text-gray-900">{config.name}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay - BEFORE sidebar in DOM, z-40 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - z-50 on mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-900 text-white ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
              <Image src={config.logo} alt={config.name} width={36} height={36} className="object-contain flex-shrink-0" />
              <div>
                <h1 className="text-sm font-bold leading-tight">{config.name}</h1>
                <p className="text-[11px] text-gray-400">Admin Panel</p>
              </div>
            </div>
            {/* Collapsed: just icon */}
            <div className={`hidden ${sidebarCollapsed ? 'lg:flex' : ''} items-center justify-center w-full`}>
              <Image src={config.logo} alt={config.name} width={36} height={36} className="object-contain" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
            {renderNavSection('Main', mainNav)}
            {renderNavSection('Content', contentNav)}
            {renderNavSection('Inbox', inboxNav)}

            {/* Settings, Logout, Back to Website — inside scroll area so mobile browser bars don't hide them */}
            <div className="border-t border-gray-800 mx-2 mt-4 pt-3 space-y-1 pb-4">
              <Link
                href="/admin/dashboard/settings"
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? 'Settings' : undefined}
                className={`flex items-center transition-colors duration-200 rounded-lg ${
                  sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'space-x-3 px-3 py-2.5'
                } ${
                  pathname === '/admin/dashboard/settings'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">Settings</span>}
              </Link>

              <button
                onClick={handleLogout}
                title={sidebarCollapsed ? 'Logout' : undefined}
                className={`w-full flex items-center transition-colors duration-200 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white ${
                  sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'space-x-3 px-3 py-2.5'
                }`}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">Logout</span>}
              </button>

              <Link
                href="/"
                title={sidebarCollapsed ? 'Back to Website' : undefined}
                className={`flex items-center transition-colors duration-200 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white ${
                  sidebarCollapsed ? 'justify-center px-2 py-2' : 'space-x-3 px-3 py-2'
                }`}
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm">Back to Website</span>}
              </Link>
            </div>
          </nav>

          {/* Desktop-only collapse toggle */}
          <div className="hidden lg:block border-t border-gray-800 p-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen pt-16 lg:pt-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
