import React from 'react';
import {
  BookOpen,
  Microscope,
  Monitor,
  Utensils,
  Car,
  Shield,
  Wifi,
  Heart,
  Trophy,
  Music,
  Palette,
  Users
} from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      name: 'Modern Library',
      description: 'Extensive collection of books, digital resources, and quiet study spaces',
      icon: BookOpen,
      features: ['50,000+ books', 'Digital catalog system', 'Study rooms', 'Research assistance'],
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Science Laboratories',
      description: 'State-of-the-art labs for physics, chemistry, and biology experiments',
      icon: Microscope,
      features: ['Advanced equipment', 'Safety protocols', 'Interactive experiments', 'Research facilities'],
      image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Computer Labs',
      description: 'High-tech computer labs with latest software and internet connectivity',
      icon: Monitor,
      features: ['Latest computers', 'High-speed internet', 'Programming software', 'Multimedia tools'],
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Sports Complex',
      description: 'Comprehensive sports facilities for various indoor and outdoor activities',
      icon: Trophy,
      features: ['Basketball court', 'Swimming pool', 'Football field', 'Gymnasium'],
      image: 'https://images.pexels.com/photos/1321909/pexels-photo-1321909.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Cafeteria',
      description: 'Nutritious meals and snacks in a clean, comfortable dining environment',
      icon: Utensils,
      features: ['Healthy menu', 'Dietary options', 'Clean environment', 'Affordable prices'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Art Studios',
      description: 'Creative spaces equipped with art supplies and natural lighting',
      icon: Palette,
      features: ['Art supplies', 'Natural lighting', 'Exhibition space', 'Pottery wheel'],
      image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  const additionalFacilities = [
    {
      name: 'Transportation',
      description: 'Safe and reliable bus service covering major routes',
      icon: Car,
      details: ['GPS tracking', 'Trained drivers', 'Multiple routes', 'Safety protocols'],
    },
    {
      name: 'Security',
      description: '24/7 security with CCTV monitoring and access control',
      icon: Shield,
      details: ['CCTV surveillance', 'Access control', 'Security guards', 'Emergency protocols'],
    },
    {
      name: 'Wi-Fi Campus',
      description: 'High-speed internet connectivity throughout the campus',
      icon: Wifi,
      details: ['Campus-wide coverage', 'High-speed connection', 'Student access', 'Educational content'],
    },
    {
      name: 'Health Center',
      description: 'On-campus medical facility with qualified nursing staff',
      icon: Heart,
      details: ['Qualified nurse', 'First aid', 'Health monitoring', 'Emergency care'],
    },
    {
      name: 'Music Room',
      description: 'Soundproof rooms with various musical instruments',
      icon: Music,
      details: ['Piano', 'Guitars', 'Drums', 'Sound system'],
    },
    {
      name: 'Auditorium',
      description: 'Large venue for assemblies, performances, and events',
      icon: Users,
      details: ['500 seating capacity', 'Sound system', 'Stage lighting', 'Air conditioning'],
    },
  ];

  const safetyFeatures = [
    'Fire safety systems with smoke detectors and sprinklers',
    'Emergency evacuation procedures and regular drills',
    'First aid stations throughout the campus',
    'Trained security personnel on duty 24/7',
    'CCTV monitoring in all common areas',
    'Secure entry and exit points with access control',
    'Emergency communication systems',
    'Regular safety inspections and maintenance',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">World-Class Facilities</h1>
          <p className="text-xl text-violet-100 max-w-3xl mx-auto">
            Excellence Academy provides state-of-the-art facilities designed to enhance learning,
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
            {facilities.map((facility, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${facility.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                      <facility.icon className={`h-6 w-6 ${facility.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{facility.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">{facility.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {facility.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            {additionalFacilities.map((facility, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <facility.icon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{facility.description}</p>
                <ul className="space-y-2">
                  {facility.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            <p className="text-xl text-gray-600">Your child's safety is our top priority</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyFeatures.map((feature, index) => (
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
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Facility Highlights</h2>
            <p className="text-xl text-blue-100">Numbers that showcase our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">Books in Library</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15</div>
              <div className="text-blue-100">Science Labs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-blue-100">Computers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Security</div>
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
            to explore everything Excellence Academy has to offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
              <Users className="h-5 w-5 mr-2" />
              Schedule Campus Tour
            </button>
            <button className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-200">
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
