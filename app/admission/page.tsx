'use client';

import React, { useState } from 'react';
import { FileText, DollarSign, Calendar, CheckCircle, Send } from 'lucide-react';

const Admission = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    dob: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    previousSchool: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! We will contact you soon.'
        });
        // Clear form
        setFormData({
          studentName: '',
          grade: '',
          dob: '',
          parentName: '',
          email: '',
          phone: '',
          address: '',
          previousSchool: '',
          message: ''
        });
      } else {
        const error = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.error || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const admissionSteps = [
    { step: 1, title: 'Submit Application', description: 'Complete and submit the online application form' },
    { step: 2, title: 'Document Review', description: 'We review your application and supporting documents' },
    { step: 3, title: 'Assessment', description: 'Student assessment and parent interview' },
    { step: 4, title: 'Decision', description: 'Receive admission decision within 5-7 business days' },
    { step: 5, title: 'Enrollment', description: 'Complete enrollment process and pay fees' },
  ];

  const scholarships = [
    {
      name: 'Academic Excellence Scholarship',
      amount: 'Up to 50% tuition',
      criteria: 'Outstanding academic record and entrance test performance',
    },
    {
      name: 'Need-Based Scholarship',
      amount: 'Up to 30% tuition',
      criteria: 'Demonstrated financial need and good academic standing',
    },
    {
      name: 'Talent Scholarship',
      amount: 'Up to 25% tuition',
      criteria: 'Exceptional talent in arts, sports, or other special abilities',
    },
    {
      name: 'Sibling Scholarship',
      amount: '10% tuition',
      criteria: 'Second child and subsequent children from the same family',
    },
  ];

  const requiredDocuments = [
    'Completed application form',
    'Previous school transcripts',
    'Birth certificate',
    'Immunization records',
    'Passport-size photographs (2)',
    'Parent/Guardian ID proof',
    'Previous school leaving certificate',
    'Medical examination report',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Begin your child's journey of excellence with us. We're committed to nurturing
            young minds and building bright futures through quality education.
          </p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Admission Process</h2>
            <p className="text-xl text-gray-600">Simple steps to join Excellence Academy</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 hidden lg:block"></div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {admissionSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Required Documents
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
                <ul className="space-y-3">
                  {requiredDocuments.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-green-600" />
                Important Dates
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Application Period</h3>
                    <p className="text-blue-600">January 1 - March 31, 2024</p>
                    <p className="text-gray-600 text-sm">For 2024-25 academic year</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Assessment Dates</h3>
                    <p className="text-green-600">April 5-15, 2024</p>
                    <p className="text-gray-600 text-sm">Individual appointments scheduled</p>
                  </div>
                  <div className="border-l-4 border-yellow-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Admission Results</h3>
                    <p className="text-yellow-600">April 25, 2024</p>
                    <p className="text-gray-600 text-sm">Results announced via email</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Enrollment Deadline</h3>
                    <p className="text-purple-600">May 15, 2024</p>
                    <p className="text-gray-600 text-sm">Final enrollment and fee payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 mr-3 text-green-600" />
              Scholarship Opportunities
            </h2>
            <p className="text-xl text-gray-600">Financial assistance for deserving students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scholarships.map((scholarship, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{scholarship.name}</h3>
                <div className="text-2xl font-bold text-green-600 mb-4">{scholarship.amount}</div>
                <p className="text-gray-600">{scholarship.criteria}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Online Application Form</h2>
            <p className="text-xl text-gray-600">Start your admission process today</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-md ${
                submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    required
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Applying For *
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="kindergarten">Kindergarten</option>
                    <option value="grade1">Grade 1</option>
                    <option value="grade2">Grade 2</option>
                    <option value="grade3">Grade 3</option>
                    <option value="grade4">Grade 4</option>
                    <option value="grade5">Grade 5</option>
                    <option value="grade6">Grade 6</option>
                    <option value="grade7">Grade 7</option>
                    <option value="grade8">Grade 8</option>
                    <option value="grade9">Grade 9</option>
                    <option value="grade10">Grade 10</option>
                    <option value="grade11">Grade 11</option>
                    <option value="grade12">Grade 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    required
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="previousSchool" className="block text-sm font-medium text-gray-700 mb-2">
                  Previous School
                </label>
                <input
                  type="text"
                  id="previousSchool"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information you'd like to share..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admission;
