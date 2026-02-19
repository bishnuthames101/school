'use client';

import React, { useState } from 'react';
import { FileText, DollarSign, Calendar, CheckCircle, Send } from 'lucide-react';
import { grades, provinces, districtsByProvince } from '@/lib/nepal-data';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const initialFormData = {
  studentNameEn: '',
  studentNameNp: '',
  dobAD: '',
  dobBS: '',
  gender: '',
  nationality: 'Nepali',
  gradeApplying: '',
  fatherName: '',
  fatherPhone: '',
  fatherOccupation: '',
  motherName: '',
  motherPhone: '',
  motherOccupation: '',
  province: '',
  district: '',
  municipality: '',
  wardNo: '',
  tole: '',
  previousSchool: '',
  previousClass: '',
  email: '',
  phone: '',
  message: '',
};

const Admission = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'province') {
        return { ...prev, province: value, district: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dobAD: formData.dobAD ? new Date(formData.dobAD).toISOString() : undefined,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! We will contact you soon.',
        });
        setFormData(initialFormData);
      } else {
        const error = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.error || 'Failed to submit application. Please try again.',
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
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

  const requiredDocuments = [
    'Completed application form',
    'Previous school transcripts',
    'Birth certificate',
    'Immunization records',
    'Passport-size photographs (2)',
    'Parent/Guardian citizenship copy',
    'Previous school leaving certificate',
    'Medical examination report',
  ];

  const availableDistricts = formData.province ? districtsByProvince[formData.province] || [] : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Begin your child&apos;s journey of excellence with us. We&apos;re committed to nurturing
            young minds and building bright futures through quality education.
          </p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Admission Process</h2>
            <p className="text-xl text-gray-600">Simple steps to join our school</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 hidden lg:block"></div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {admissionSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-school-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
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
                <FileText className="h-6 w-6 mr-2 text-school-primary" />
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
                  <div className="border-l-4 border-school-primary pl-4">
                    <h3 className="font-semibold text-gray-900">Application Period</h3>
                    <p className="text-school-primary">{config.admissionDates.applicationPeriod}</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Assessment Dates</h3>
                    <p className="text-green-600">{config.admissionDates.assessmentDates}</p>
                  </div>
                  <div className="border-l-4 border-yellow-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Admission Results</h3>
                    <p className="text-yellow-600">{config.admissionDates.results}</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="font-semibold text-gray-900">Enrollment Deadline</h3>
                    <p className="text-purple-600">{config.admissionDates.enrollmentDeadline}</p>
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
            {config.scholarships.map((scholarship, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{scholarship.name}</h3>
                <div className="text-2xl font-bold text-green-600 mb-4">{scholarship.discount}</div>
                <p className="text-gray-600">{scholarship.criteria}</p>
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
              <div
                className={`mb-6 p-4 rounded-md ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Student Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="studentNameEn" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentNameEn"
                      name="studentNameEn"
                      required
                      value={formData.studentNameEn}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="studentNameNp" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name (Nepali)
                    </label>
                    <input
                      type="text"
                      id="studentNameNp"
                      name="studentNameNp"
                      value={formData.studentNameNp}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                      placeholder="नाम लेख्नुहोस्"
                    />
                  </div>
                  <div>
                    <label htmlFor="dobAD" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth (AD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dobAD"
                      name="dobAD"
                      required
                      value={formData.dobAD}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="dobBS" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth (BS)
                    </label>
                    <input
                      type="text"
                      id="dobBS"
                      name="dobBS"
                      value={formData.dobBS}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                      placeholder="e.g. 2065-01-15"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="gradeApplying" className="block text-sm font-medium text-gray-700 mb-1">
                      Grade Applying For <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gradeApplying"
                      name="gradeApplying"
                      required
                      value={formData.gradeApplying}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      required
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Parent/Guardian Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Parent / Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
                      Father&apos;s Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      required
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="fatherPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Father&apos;s Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="fatherPhone"
                      name="fatherPhone"
                      required
                      value={formData.fatherPhone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
                      Father&apos;s Occupation
                    </label>
                    <input
                      type="text"
                      id="fatherOccupation"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
                      Mother&apos;s Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="motherName"
                      name="motherName"
                      required
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="motherPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Mother&apos;s Phone
                    </label>
                    <input
                      type="tel"
                      id="motherPhone"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
                      Mother&apos;s Occupation
                    </label>
                    <input
                      type="text"
                      id="motherOccupation"
                      name="motherOccupation"
                      value={formData.motherOccupation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="province"
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    >
                      <option value="">Select Province</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.province}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary disabled:bg-gray-100"
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
                      Municipality / Rural Municipality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="municipality"
                      name="municipality"
                      required
                      value={formData.municipality}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="wardNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Ward No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="wardNo"
                      name="wardNo"
                      required
                      value={formData.wardNo}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="tole" className="block text-sm font-medium text-gray-700 mb-1">
                      Tole / Street
                    </label>
                    <input
                      type="text"
                      id="tole"
                      name="tole"
                      value={formData.tole}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Previous Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Previous Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="previousSchool" className="block text-sm font-medium text-gray-700 mb-1">
                      Previous School Name
                    </label>
                    <input
                      type="text"
                      id="previousSchool"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="previousClass" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Class Attended
                    </label>
                    <input
                      type="text"
                      id="previousClass"
                      name="previousClass"
                      value={formData.previousClass}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (Primary) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Additional */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Additional Information</h3>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message / Additional Info
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    placeholder="Any additional information you'd like to share..."
                  ></textarea>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-school-primary hover:bg-school-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-school-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
