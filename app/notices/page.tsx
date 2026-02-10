'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, FileText, AlertCircle, Info, CheckCircle } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices');
        if (response.ok) {
          const result = await response.json();
          setNotices(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Sports':
        return 'bg-green-100 text-green-800';
      case 'Health':
        return 'bg-red-100 text-red-800';
      case 'Arts':
        return 'bg-purple-100 text-purple-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['All', 'Academic', 'Sports', 'Health', 'Arts', 'General'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter(notice => notice.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">School Notices</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto">
            Stay informed with the latest announcements, updates, and important information
            from KOPESS administration.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{notices.filter(n => n.priority === 'high').length}</div>
              <div className="text-gray-600 text-sm">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{notices.filter(n => n.priority === 'medium').length}</div>
              <div className="text-gray-600 text-sm">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notices.filter(n => n.priority === 'low').length}</div>
              <div className="text-gray-600 text-sm">Low Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notices.length}</div>
              <div className="text-gray-600 text-sm">Total Notices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading notices...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNotices.map((notice) => (
                <div key={notice.id} className={`border-l-4 ${getPriorityColor(notice.priority)} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getPriorityIcon(notice.priority)}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{notice.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(notice.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                              {notice.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{notice.content}</p>

                    {notice.attachments && notice.attachments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Attachments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {notice.attachments.map((attachment: string, index: number) => (
                            <a
                              key={index}
                              href="#"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {attachment}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notice Subscription */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our notice notifications to receive important updates directly to your email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200">
              <Bell className="h-5 w-5 mr-2" />
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notices;
