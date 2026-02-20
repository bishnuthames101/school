import React from 'react';
import { Target, Eye, Heart, Award, Users, BookOpen } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {config.name}</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover our rich history, unwavering mission, and commitment to educational excellence
            that has shaped generations of successful leaders.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in {config.foundedYear}, {config.name} began as a small institution with a big dream &ndash;
                  to provide world-class education that nurtures both academic excellence and character development.
                </p>
                <p>
                  Over the past {new Date().getFullYear() - config.foundedYear} years, we have grown from a humble beginning to a
                  thriving educational community of over {config.stats.students} students. Our journey has been marked by
                  continuous innovation, unwavering commitment to quality, and a deep understanding of
                  each student&apos;s unique potential.
                </p>
                <p>
                  Today, we stand proud as one of the region&apos;s leading educational institutions,
                  known for our holistic approach to education that balances rigorous academics with
                  comprehensive personal development programs.
                </p>
              </div>
            </div>
            <div className="bg-school-primary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Milestones</h3>
              <div className="space-y-3">
                {config.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 bg-school-primary rounded-full mr-3"></div>
                    <span className="text-gray-700"><strong>{milestone.year}:</strong> {milestone.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-school-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-school-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">{config.mission}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">{config.vision}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="text-gray-600 text-left space-y-2">
                {config.coreValues.map((value, index) => (
                  <li key={index}>&bull; {value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the dedicated leaders guiding our institution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.leadership.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="h-48 bg-gradient-to-br from-school-primary-light to-school-primary"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-school-primary font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.qualification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Principal&apos;s Message</h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-32 h-32 bg-gradient-to-br from-school-primary-light to-school-primary rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;At {config.name}, we believe that every child has the potential to achieve greatness.
                    Our role is to provide the nurturing environment, exceptional resources, and inspiring guidance
                    that allows each student to discover and develop their unique talents.&rdquo;
                  </blockquote>
                  <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;We are committed to fostering not just academic excellence, but also the development of
                    character, creativity, and critical thinking skills that will serve our students throughout
                    their lives. Together, we are building tomorrow&apos;s leaders today.&rdquo;
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-bold text-gray-900">{config.leadership[0]?.name}</p>
                    <p className="text-school-primary">{config.leadership[0]?.role}, {config.name}</p>
                    <p className="text-sm text-gray-600">{config.leadership[0]?.qualification}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">Recognition of our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.achievements.map((achievement, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-school-primary">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-school-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-school-primary" />
                  </div>
                  <div>
                    <div className="text-school-primary font-bold text-lg">{achievement.year}</div>
                    <div className="text-gray-900 font-semibold">{achievement.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
