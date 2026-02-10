'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Users, Camera, GraduationCap, Music, Palette, BookOpen, Award } from 'lucide-react';

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
  const houses = [
    {
      name: 'Phoenix House',
      color: 'Red',
      motto: 'Rise with Courage',
      achievements: ['Sports Championship 2023', 'Academic Excellence Award'],
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    {
      name: 'Eagle House',
      color: 'Blue',
      motto: 'Soar to Heights',
      achievements: ['Cultural Fest Winner', 'Community Service Award'],
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      name: 'Lion House',
      color: 'Gold',
      motto: 'Lead with Pride',
      achievements: ['Debate Championship', 'Leadership Excellence'],
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
    },
    {
      name: 'Tiger House',
      color: 'Green',
      motto: 'Strength in Unity',
      achievements: ['Environmental Club Award', 'Science Olympiad'],
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
  ];

  const clubs = [
    {
      name: 'Drama Club',
      description: 'Develop acting skills and stage performances',
      icon: Music,
      members: 45,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Art & Craft Club',
      description: 'Express creativity through various art forms',
      icon: Palette,
      members: 38,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      name: 'Science Club',
      description: 'Explore scientific concepts through experiments',
      icon: BookOpen,
      members: 52,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Sports Club',
      description: 'Promote physical fitness and sportsmanship',
      icon: Trophy,
      members: 68,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Music Club',
      description: 'Learn and perform various musical instruments',
      icon: Music,
      members: 41,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      name: 'Debate Society',
      description: 'Develop public speaking and critical thinking',
      icon: Users,
      members: 29,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  const ecaActivities = [
    {
      category: 'Sports',
      activities: ['Basketball', 'Soccer', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball'],
      icon: Trophy,
      color: 'text-green-600',
    },
    {
      category: 'Arts',
      activities: ['Painting', 'Music', 'Dance', 'Photography', 'Sculpture', 'Drama'],
      icon: Palette,
      color: 'text-purple-600',
    },
    {
      category: 'Academic',
      activities: ['Math Olympiad', 'Science Fair', 'Spelling Bee', 'Quiz Bowl', 'Model UN', 'Robotics'],
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      category: 'Community',
      activities: ['Environmental Club', 'Volunteer Service', 'Student Council', 'Peer Tutoring', 'Charity Drives'],
      icon: Users,
      color: 'text-orange-600',
    },
  ];


  const alumni = [
    {
      name: 'Dr. Sarah Mitchell',
      year: '2010',
      achievement: 'Leading Pediatric Surgeon',
      description: 'Harvard Medical School graduate, now practicing at Children\'s Hospital',
    },
    {
      name: 'James Rodriguez',
      year: '2015',
      achievement: 'Tech Entrepreneur',
      description: 'Founded successful AI startup, featured in Forbes 30 Under 30',
    },
    {
      name: 'Maria Chen',
      year: '2012',
      achievement: 'Environmental Scientist',
      description: 'Leading climate research at NASA, published 15+ research papers',
    },
    {
      name: 'David Thompson',
      year: '2008',
      achievement: 'Olympic Athlete',
      description: 'Swimming champion, 2x Olympic medalist, now coaching future athletes',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Beyond Academics</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover the vibrant community life at KOPESS through our house system,
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
            {houses.map((house, index) => (
              <div key={index} className={`${house.bgLight} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200`}>
                <div className={`${house.bgColor} h-2`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{house.name}</h3>
                  <p className={`${house.textColor} font-semibold mb-4`}>"{house.motto}"</p>
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
            ))}
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
            {clubs.map((club, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className={`w-12 h-12 ${club.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <club.icon className={`h-6 w-6 ${club.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 mb-4">{club.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{club.members} members</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
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
            {ecaActivities.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <category.icon className={`h-8 w-8 ${category.color} mr-3`} />
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {category.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Camera className="h-8 w-8 mr-3 text-blue-600" />
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
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
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
            {alumni.map((alum, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{alum.name}</h3>
                    <p className="text-purple-600 font-semibold">Class of {alum.year}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{alum.achievement}</h4>
                <p className="text-gray-600">{alum.description}</p>
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
