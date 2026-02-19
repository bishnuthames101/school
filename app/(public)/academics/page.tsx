import React from 'react';
import { BookOpen, Calendar, Award, FileText, Clock, Users } from 'lucide-react';
import CalendarCarousel from '@/components/CalendarCarousel';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const Academics = () => {
  const examSchedule = [
    { exam: 'Mid-Term Examinations', date: 'October 15-25, 2024', grade: 'All Grades' },
    { exam: 'Final Examinations', date: 'March 10-20, 2025', grade: 'All Grades' },
    { exam: 'AP Examinations', date: 'May 5-15, 2025', grade: 'Grades 9-12' },
    { exam: 'State Assessments', date: 'April 20-30, 2025', grade: 'Grades 3-8' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Academic Excellence</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Comprehensive educational programs designed to challenge, inspire, and prepare students
            for success in higher education and beyond.
          </p>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Programs</h2>
            <p className="text-xl text-gray-600">Structured learning pathways for every grade level</p>
          </div>

          <div className="space-y-8">
            {config.academics.programs.map((program, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.level}</h3>
                    <p className="text-gray-600 mb-4">{program.grades}</p>
                    <div className="flex items-center text-sm text-school-primary">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comprehensive Curriculum
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Subjects</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {program.subjects.map((subject, subIndex) => (
                        <div key={subIndex} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Features</h2>
            <p className="text-xl text-gray-600">What makes our academic program exceptional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.academics.features.map((feature, index) => {
              const icons = [Users, Award, Clock];
              const bgColors = ['bg-school-primary-100', 'bg-green-100', 'bg-yellow-100'];
              const textColors = ['text-school-primary', 'text-green-600', 'text-yellow-600'];
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className={`w-12 h-12 ${bgColors[index % bgColors.length]} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${textColors[index % textColors.length]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Examination & Evaluation */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Examination Schedule */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-school-primary" />
                Examination Schedule
              </h2>
              <div className="space-y-4">
                {examSchedule.map((exam, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-school-primary">
                    <h3 className="font-semibold text-gray-900">{exam.exam}</h3>
                    <p className="text-school-primary text-sm">{exam.date}</p>
                    <p className="text-gray-600 text-sm">{exam.grade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation System */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluation System</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Scale</h3>
                <div className="space-y-3">
                  {config.academics.gradingScale.map((item, index) => {
                    const colors = ['text-green-600', 'text-school-primary', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
                    const labels = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Unsatisfactory'];
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700">{item.grade} ({item.range})</span>
                        <span className={`${colors[index % colors.length]} font-semibold`}>{labels[index % labels.length]}</span>
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Assessment Methods</h3>
                <p className="text-gray-600">{config.academics.assessmentWeights}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 mr-3 text-school-primary" />
              Academic Calendar
            </h2>
            <p className="text-xl text-gray-600">Important dates and events for the academic year</p>
          </div>

          <CalendarCarousel />
        </div>
      </section>

      {/* Results & Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Results & Achievements</h2>
            <p className="text-xl text-gray-600">Our students&apos; outstanding performance record</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-school-primary mb-2">98%</div>
              <div className="text-gray-900 font-semibold">Graduation Rate</div>
              <div className="text-gray-600 text-sm">Class of 2024</div>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-900 font-semibold">College Acceptance</div>
              <div className="text-gray-600 text-sm">4-year institutions</div>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">4.2</div>
              <div className="text-gray-900 font-semibold">Average GPA</div>
              <div className="text-gray-600 text-sm">Graduating class</div>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-900 font-semibold">AP Pass Rate</div>
              <div className="text-gray-600 text-sm">Score 3 or higher</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
