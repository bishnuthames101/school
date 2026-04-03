'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';
import { getImageUrl, IMAGE_PRESETS } from '@/lib/image-utils';

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const result = await response.json();
          setUpcomingEvents(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">School Events</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Celebrating achievements, fostering community, and creating lasting memories
            through our diverse range of school events and activities.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Don't miss these exciting upcoming activities</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl(event.image || 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800', IMAGE_PRESETS.card)})` }}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        event.category === 'Academic' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'Sports' ? 'bg-green-100 text-green-800' :
                        event.category === 'Arts' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Registration CTA */}
      <section className="py-16 bg-school-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Participate?</h2>
          <p className="text-xl text-school-primary-100 mb-8 max-w-2xl mx-auto">
            Join us in our upcoming events and be part of our vibrant school community.
            Registration is open for students and parents.
          </p>
          <Link
            href="/contact?subject=events#contact-form"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-school-primary bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Users className="h-5 w-5 mr-2" />
            Register for Events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Events;
