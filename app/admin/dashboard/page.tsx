'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Bell,
  Image,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  ArrowRight,
  Megaphone,
} from 'lucide-react';

interface Stats {
  events: number;
  notices: number;
  gallery: number;
  applications: number;
  contacts: number;
  popups: number;
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
      // Fetch real data from all APIs in parallel
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
      // Set to 0 if there's an error
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
      color: 'bg-blue-500',
      href: '/admin/dashboard/events',
    },
    {
      name: 'Total Notices',
      value: stats.notices,
      icon: Bell,
      color: 'bg-green-500',
      href: '/admin/dashboard/notices',
    },
    {
      name: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      color: 'bg-purple-500',
      href: '/admin/dashboard/gallery',
    },
    {
      name: 'Applications',
      value: stats.applications,
      icon: FileText,
      color: 'bg-yellow-500',
      href: '/admin/dashboard/applications',
    },
    {
      name: 'Contact Messages',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'bg-red-500',
      href: '/admin/dashboard/contacts',
    },
    {
      name: 'Total Popups',
      value: stats.popups,
      icon: Megaphone,
      color: 'bg-orange-500',
      href: '/admin/dashboard/popups',
    },
  ];

  const quickActions = [
    { name: 'Add New Event', href: '/admin/dashboard/events', icon: Calendar, color: 'bg-blue-600' },
    { name: 'Post Notice', href: '/admin/dashboard/notices', icon: Bell, color: 'bg-green-600' },
    { name: 'Upload to Gallery', href: '/admin/dashboard/gallery', icon: Image, color: 'bg-purple-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Excellence Academy Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-lg p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`${action.color} hover:opacity-90 text-white rounded-lg p-4 flex items-center space-x-3 transition-opacity duration-200`}
            >
              <action.icon className="h-6 w-6" />
              <span className="font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>System is running smoothly</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Ready to manage your website content</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Use the sidebar to navigate between different sections</li>
          <li>• Manage events, notices, and gallery images from their respective pages</li>
          <li>• View admission applications and contact form submissions</li>
          <li>• All changes are saved to the database automatically</li>
        </ul>
      </div>
    </div>
  );
}
