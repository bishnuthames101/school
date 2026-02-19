import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const borderColors = [
  'border-school-primary',
  'border-green-500',
  'border-yellow-500',
  'border-school-accent',
];

export default function EventsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-school-primary" />
            Upcoming Events
          </h2>
          <Link
            href="/events"
            className="text-school-primary hover:text-school-primary-dark flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <div className="space-y-4">
            {config.upcomingHighlights.map((event, index) => (
              <div
                key={index}
                className={`border-l-4 ${borderColors[index % borderColors.length]} pl-4`}
              >
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
