import React from 'react';
import { Target, Eye, Heart, Award, Users, BookOpen } from 'lucide-react';

const About = () => {
  const managementTeam = [
    { name: 'Dr. Sarah Johnson', position: 'Principal', qualification: 'Ph.D. in Education' },
    { name: 'Mr. Robert Davis', position: 'Vice Principal', qualification: 'M.Ed. Mathematics' },
    { name: 'Ms. Emily Chen', position: 'Academic Director', qualification: 'M.A. Curriculum Design' },
    { name: 'Dr. Michael Brown', position: 'Dean of Students', qualification: 'Ph.D. Psychology' },
  ];

  const achievements = [
    { year: '2023', achievement: 'Best School in Academic Excellence Award' },
    { year: '2022', achievement: 'National Recognition for Innovation in Teaching' },
    { year: '2021', achievement: 'Excellence in Extracurricular Activities' },
    { year: '2020', achievement: 'Outstanding Community Service Award' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About KOPESS</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
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
                  Founded in 1999, KOPESS began as a small institution with a big dream –
                  to provide world-class education that nurtures both academic excellence and character development.
                </p>
                <p>
                  Over the past 25 years, we have grown from a humble beginning of 50 students to a
                  thriving educational community of over 1,200 students. Our journey has been marked by
                  continuous innovation, unwavering commitment to quality, and a deep understanding of
                  each student's unique potential.
                </p>
                <p>
                  Today, we stand proud as one of the region's leading educational institutions,
                  known for our holistic approach to education that balances rigorous academics with
                  comprehensive personal development programs.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>1999:</strong> School established with 50 students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>2005:</strong> First graduation ceremony</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>2010:</strong> New campus expansion</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>2015:</strong> Technology integration program</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700"><strong>2020:</strong> Digital learning platform launch</span>
                </div>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide exceptional education that empowers students to achieve academic excellence,
                develop strong character, and become responsible global citizens who contribute positively to society.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading educational institution that inspires lifelong learning, fosters innovation,
                and prepares students to thrive in an ever-changing world while maintaining strong moral values.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Excellence in all endeavors</li>
                <li>• Integrity and honesty</li>
                <li>• Respect for diversity</li>
                <li>• Innovation and creativity</li>
                <li>• Community service</li>
                <li>• Lifelong learning</li>
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
            {managementTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.position}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Principal's Message</h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                    "At KOPESS, we believe that every child has the potential to achieve greatness.
                    Our role is to provide the nurturing environment, exceptional resources, and inspiring guidance
                    that allows each student to discover and develop their unique talents."
                  </blockquote>
                  <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                    "We are committed to fostering not just academic excellence, but also the development of
                    character, creativity, and critical thinking skills that will serve our students throughout
                    their lives. Together, we are building tomorrow's leaders today."
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-bold text-gray-900">Dr. Sarah Johnson</p>
                    <p className="text-blue-600">Principal, KOPESS</p>
                    <p className="text-sm text-gray-600">Ph.D. in Education, 20+ years of experience</p>
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
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-blue-600 font-bold text-lg">{achievement.year}</div>
                    <div className="text-gray-900 font-semibold">{achievement.achievement}</div>
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
