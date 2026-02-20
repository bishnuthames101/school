'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Users, Camera, GraduationCap, Palette, BookOpen, Award } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  Blue:  { bg: 'bg-blue-500',   text: 'text-blue-600',   light: 'bg-blue-50'   },
  Green: { bg: 'bg-green-500',  text: 'text-green-600',  light: 'bg-green-50'  },
  Red:   { bg: 'bg-red-500',    text: 'text-red-600',    light: 'bg-red-50'    },
  Gold:  { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
};

const ecaCategories = [
  { category: 'Sports',    key: 'sports'    as const, icon: Trophy,   color: 'text-green-600'  },
  { category: 'Arts',      key: 'arts'      as const, icon: Palette,  color: 'text-purple-600' },
  { category: 'Academic',  key: 'academic'  as const, icon: BookOpen, color: 'text-blue-600'   },
  { category: 'Community', key: 'community' as const, icon: Users,    color: 'text-orange-600' },
];

const Others = () => {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const result = await response.json();
          setGalleryImages(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setGalleryImages([]);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Beyond Academics</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover the vibrant community life at {config.name} through our house system,
            clubs, extracurricular activities, and the inspiring achievements of our alumni.
          </p>
        </div>
      </section>

      {/* House System */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">House System</h2>
            <p className="text-xl text-gray-600">Building character through healthy competition and teamwork</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.houses.map((house, index) => {
              const colors = colorMap[house.color] ?? { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50' };
              return (
                <div key={index} className={`${colors.light} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200`}>
                  <div className={`${colors.bg} h-2`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{house.name}</h3>
                    <p className={`${colors.text} font-semibold mb-4`}>&ldquo;{house.motto}&rdquo;</p>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Achievements:</h4>
                      <ul className="space-y-1">
                        {house.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="text-sm text-gray-600 flex items-center">
                            <Award className="h-3 w-3 mr-2 text-yellow-500" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clubs & Societies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Clubs & Societies</h2>
            <p className="text-xl text-gray-600">Join communities that share your interests and passions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.clubs.map((club, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{club.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{club.members} members</span>
                  <button className="text-school-primary hover:text-school-primary-dark font-medium text-sm">
                    Join Club →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECA/CCA Activities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Extracurricular Activities</h2>
            <p className="text-xl text-gray-600">Comprehensive programs for holistic development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ecaCategories.map(({ category, key, icon: Icon, color }) => {
              const activities = config.extracurriculars[key];
              return (
                <div key={category} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${color} mr-3`} />
                    <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {activities.map((activity, actIndex) => (
                      <div key={actIndex} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Camera className="h-8 w-8 mr-3 text-school-primary" />
              School Gallery
            </h2>
            <p className="text-xl text-gray-600">Capturing moments of learning, growth, and achievement</p>
          </div>

          {loadingGallery ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading gallery...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-end">
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-sm font-medium">{image.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-school-primary hover:bg-school-primary-dark transition-colors duration-200">
                  <Camera className="h-5 w-5 mr-2" />
                  View Full Gallery
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Alumni */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 mr-3 text-purple-600" />
              Distinguished Alumni
            </h2>
            <p className="text-xl text-gray-600">Celebrating the success of our graduates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.alumni.map((alum, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{alum.name}</h3>
                    <p className="text-purple-600 font-semibold">Class of {alum.classOf}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{alum.achievement}</h4>
                <p className="text-gray-600">{alum.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Alumni Network</h3>
              <p className="text-gray-600 mb-6">
                Stay connected with your alma mater and fellow graduates. Share your achievements,
                mentor current students, and be part of our growing success story.
              </p>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
                <Users className="h-5 w-5 mr-2" />
                Connect with Alumni
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Others;
