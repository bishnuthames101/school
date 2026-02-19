import Link from 'next/link';
import { Bell, ChevronRight } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

export default function NewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-school-primary" />
            Latest News &amp; Notices
          </h2>
          <Link
            href="/notices"
            className="text-school-primary hover:text-school-primary-dark flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {config.newsItems.map((news, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.date}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    news.category === 'Sports' || news.category === 'Event'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-school-primary-100 text-school-primary-dark'
                  }`}
                >
                  {news.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
