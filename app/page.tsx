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

const Home = () => {
  const stats = [
    { number: '1,200+', label: 'Students', icon: Users },
    { number: '85+', label: 'Faculty Members', icon: Award },
    { number: '50+', label: 'Programs', icon: BookOpen },
    { number: '25+', label: 'Years of Excellence', icon: Star },
  ];

  const recentNews = [
    { title: 'Annual Science Fair 2024', date: 'March 15, 2024', type: 'Event' },
    { title: 'Admission Open for 2024-25', date: 'March 10, 2024', type: 'Notice' },
    { title: 'Sports Day Celebration', date: 'March 8, 2024', type: 'Event' },
    { title: 'Parent-Teacher Meeting', date: 'March 5, 2024', type: 'Notice' },
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
                  <stat.icon className="h-12 w-12 text-blue-600" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose KOPESS?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive education that goes beyond academics to nurture well-rounded individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
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
                  <Bell className="h-6 w-6 mr-2 text-blue-600" />
                  Latest News & Notices
                </h2>
                <Link href="/notices" className="text-blue-600 hover:text-blue-800 flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentNews.map((news, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
                        <p className="text-sm text-gray-600">{news.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        news.type === 'Event' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {news.type}
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
                <Link href="/events" className="text-blue-600 hover:text-blue-800 flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Annual Cultural Festival</h3>
                    <p className="text-sm text-gray-600">March 25-27, 2024</p>
                    <p className="text-sm text-gray-500 mt-1">Join us for three days of cultural celebrations</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Parent-Teacher Conference</h3>
                    <p className="text-sm text-gray-600">April 2, 2024</p>
                    <p className="text-sm text-gray-500 mt-1">Discuss your child's progress with teachers</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Science Exhibition</h3>
                    <p className="text-sm text-gray-600">April 10, 2024</p>
                    <p className="text-sm text-gray-500 mt-1">Student showcase of innovative projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards your child's bright future. Apply now and become part of our excellence tradition.
          </p>
          <Link
            href="/admission"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
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
