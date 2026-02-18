import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Users,
  BookOpen,
  Calendar,
  Bell,
  Star,
  ChevronRight
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import PopupNotice from '@/components/PopupNotice';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const Home = () => {
  const stats = [
    { number: config.stats.students, label: 'Students', icon: Users },
    { number: config.stats.faculty, label: 'Faculty Members', icon: Award },
    { number: config.stats.programs, label: 'Programs', icon: BookOpen },
    { number: config.stats.yearsOfExcellence, label: 'Years of Excellence', icon: Star },
  ];

  return (
    <div>
      {/* Popup Notice */}
      <PopupNotice />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-school-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose {config.name}?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive education that goes beyond academics to nurture well-rounded individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-school-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-school-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Excellence</h3>
              <p className="text-gray-600">
                Rigorous curriculum designed to challenge and inspire students to reach their full potential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Faculty</h3>
              <p className="text-gray-600">
                Dedicated and experienced teachers committed to student success and personal growth.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Extracurricular Activities</h3>
              <p className="text-gray-600">
                Wide range of sports, arts, and cultural activities to develop well-rounded personalities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bell className="h-6 w-6 mr-2 text-school-primary" />
                  Latest News & Notices
                </h2>
                <Link href="/notices" className="text-school-primary hover:text-school-primary-dark flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {config.newsItems.map((news, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
                        <p className="text-sm text-gray-600">{news.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        news.category === 'Sports' || news.category === 'Event' ? 'bg-green-100 text-green-800' : 'bg-school-primary-100 text-school-primary-dark'
                      }`}>
                        {news.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-green-600" />
                  Upcoming Events
                </h2>
                <Link href="/events" className="text-school-primary hover:text-school-primary-dark flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  {config.upcomingHighlights.map((event, index) => {
                    const borderColors = ['border-school-primary', 'border-green-500', 'border-yellow-500'];
                    return (
                      <div key={index} className={`border-l-4 ${borderColors[index % borderColors.length]} pl-4`}>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-school-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-school-primary-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards your child&apos;s bright future. Apply now and become part of our excellence tradition.
          </p>
          <Link
            href="/admission"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-school-primary bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Start Your Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
