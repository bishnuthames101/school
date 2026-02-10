'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Bell,
  Image,
  FileText,
  MessageSquare,
  ArrowRight,
  Megaphone,
  Plus,
  CheckCircle,
} from 'lucide-react';

interface Stats {
  events: number;
  notices: number;
  gallery: number;
  applications: number;
  contacts: number;
  popups: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    notices: 0,
    gallery: 0,
    applications: 0,
    contacts: 0,
    popups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, noticesRes, galleryRes, applicationsRes, contactsRes, popupsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/notices'),
        fetch('/api/gallery'),
        fetch('/api/applications'),
        fetch('/api/contacts'),
        fetch('/api/popups'),
      ]);

      const [eventsData, noticesData, galleryData, applicationsData, contactsData, popupsData] = await Promise.all([
        eventsRes.json(),
        noticesRes.json(),
        galleryRes.json(),
        applicationsRes.json(),
        contactsRes.json(),
        popupsRes.json(),
      ]);

      setStats({
        events: eventsData.success ? eventsData.data.length : 0,
        notices: noticesData.success ? noticesData.data.length : 0,
        gallery: galleryData.success ? galleryData.data.length : 0,
        applications: applicationsData.success ? applicationsData.data.length : 0,
        contacts: contactsData.success ? contactsData.data.length : 0,
        popups: popupsData.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        events: 0,
        notices: 0,
        gallery: 0,
        applications: 0,
        contacts: 0,
        popups: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Total Events',
      value: stats.events,
      icon: Calendar,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: '/admin/dashboard/events',
    },
    {
      name: 'Total Notices',
      value: stats.notices,
      icon: Bell,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
      href: '/admin/dashboard/notices',
    },
    {
      name: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: '/admin/dashboard/gallery',
    },
    {
      name: 'Applications',
      value: stats.applications,
      icon: FileText,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      href: '/admin/dashboard/applications',
    },
    {
      name: 'Contact Messages',
      value: stats.contacts,
      icon: MessageSquare,
      bg: 'bg-red-50',
      iconColor: 'text-red-600',
      href: '/admin/dashboard/contacts',
    },
    {
      name: 'Total Popups',
      value: stats.popups,
      icon: Megaphone,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      href: '/admin/dashboard/popups',
    },
  ];

  const quickActions = [
    { name: 'Add New Event', href: '/admin/dashboard/events', icon: Calendar },
    { name: 'Post Notice', href: '/admin/dashboard/notices', icon: Bell },
    { name: 'Upload to Gallery', href: '/admin/dashboard/gallery', icon: Image },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton header */}
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded mt-3 animate-pulse" />
        </div>
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-xl animate-pulse" />
              </div>
              <div className="mt-4 h-4 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, Admin
        </h1>
        <p className="mt-1 text-gray-500">Here&apos;s an overview of your school management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bg} rounded-xl p-3`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-blue-600 transition-colors">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group flex items-center space-x-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md p-4 transition-all duration-200"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">All systems operational</p>
            <p className="text-xs text-gray-500">
              Last checked: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
