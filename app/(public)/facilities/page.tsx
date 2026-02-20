import React from 'react';
import { BookOpen, FlaskConical, Monitor, Trophy, UtensilsCrossed, Theater, Bus, Shield, Heart, Music, Users } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, FlaskConical, Monitor, Trophy, UtensilsCrossed, Theater, Bus, Shield, Heart, Music,
};

const facilityColors = [
  { color: 'text-school-primary', bgColor: 'bg-blue-100'   },
  { color: 'text-green-600',      bgColor: 'bg-green-100'  },
  { color: 'text-purple-600',     bgColor: 'bg-purple-100' },
  { color: 'text-orange-600',     bgColor: 'bg-orange-100' },
  { color: 'text-red-600',        bgColor: 'bg-red-100'    },
  { color: 'text-pink-600',       bgColor: 'bg-pink-100'   },
];

const facilityImages = [
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1321909/pexels-photo-1321909.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const Facilities = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">World-Class Facilities</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {config.name} provides state-of-the-art facilities designed to enhance learning,
            promote creativity, and ensure the safety and well-being of our students.
          </p>
        </div>
      </section>

      {/* Main Facilities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Facilities</h2>
            <p className="text-xl text-gray-600">Essential spaces that support comprehensive education</p>
          </div>

          <div className="space-y-16">
            {config.facilities.main.map((facility, index) => {
              const Icon = iconMap[facility.icon] ?? BookOpen;
              const { color, bgColor } = facilityColors[index % facilityColors.length];
              const image = facilityImages[index % facilityImages.length];
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mr-4`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{facility.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">{facility.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {facility.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-school-primary rounded-full mr-3"></div>
                          <span className="text-gray-700 text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={image}
                        alt={facility.name}
                        className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Amenities</h2>
            <p className="text-xl text-gray-600">Supporting services that enhance the school experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.facilities.additional.map((facility, index) => {
              const Icon = iconMap[facility.icon] ?? Shield;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <Icon className="h-8 w-8 text-school-primary mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                  </div>
                  <ul className="space-y-2">
                    {facility.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-school-primary rounded-full mr-2"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Security */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 mr-3 text-green-600" />
              Safety & Security
            </h2>
            <p className="text-xl text-gray-600">Your child&apos;s safety is our top priority</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.facilities.safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facility Stats */}
      <section className="py-16 bg-school-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Facility Highlights</h2>
            <p className="text-xl text-school-primary-100">Numbers that showcase our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{config.facilities.stats.books}</div>
              <div className="text-school-primary-100">Books in Library</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{config.facilities.stats.labs}</div>
              <div className="text-school-primary-100">Labs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{config.facilities.stats.computers}</div>
              <div className="text-school-primary-100">Computers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{config.facilities.stats.security}</div>
              <div className="text-school-primary-100">Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience Our Campus</h2>
          <p className="text-xl text-gray-600 mb-8">
            See our world-class facilities in person. Schedule a campus tour or take our virtual tour
            to explore everything {config.name} has to offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-school-primary hover:bg-school-primary-dark transition-colors duration-200">
              <Users className="h-5 w-5 mr-2" />
              Schedule Campus Tour
            </button>
            <button className="inline-flex items-center px-8 py-3 border-2 border-school-primary text-base font-medium rounded-md text-school-primary hover:bg-school-primary-50 transition-colors duration-200">
              <Monitor className="h-5 w-5 mr-2" />
              Take Virtual Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
