'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const error = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.error || 'Failed to send message. Please try again.'
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Education Street', 'Knowledge City, KC 12345', 'United States'],
      color: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['Main Office: +1 (555) 123-4567', 'Admissions: +1 (555) 123-4568', 'Emergency: +1 (555) 123-4569'],
      color: 'text-green-600',
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['info@kopess.edu', 'admissions@kopess.edu', 'principal@kopess.edu'],
      color: 'text-purple-600',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed'],
      color: 'text-yellow-600',
    },
  ];

  const departments = [
    { name: 'Principal\'s Office', phone: '+1 (555) 123-4567', email: 'principal@kopess.edu' },
    { name: 'Admissions Office', phone: '+1 (555) 123-4568', email: 'admissions@kopess.edu' },
    { name: 'Academic Office', phone: '+1 (555) 123-4570', email: 'academics@kopess.edu' },
    { name: 'Student Affairs', phone: '+1 (555) 123-4571', email: 'students@kopess.edu' },
    { name: 'Finance Department', phone: '+1 (555) 123-4572', email: 'finance@kopess.edu' },
    { name: 'IT Support', phone: '+1 (555) 123-4573', email: 'support@kopess.edu' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            We're here to help! Get in touch with us for any questions, concerns, or information
            about KOPESS. We look forward to hearing from you.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Multiple ways to reach us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
                <div className={`w-16 h-16 ${info.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className={`h-8 w-8 ${info.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                Send us a Message
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-md ${
                    submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Subject</option>
                        <option value="admission">Admission Inquiry</option>
                        <option value="academic">Academic Information</option>
                        <option value="facilities">Facilities</option>
                        <option value="events">Events & Activities</option>
                        <option value="general">General Inquiry</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Map & Quick Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us Here</h2>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.471852291576!2d85.34655857525254!3d27.671807676202977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f0a50c9419%3A0xb91aba5ece08fc44!2sKotdevi%20Public%20English%20Sec.%20School!5e0!3m2!1sen!2snp!4v1770864556743!5m2!1sen!2snp"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Transportation Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transportation</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">By Car:</span>
                    <p className="text-gray-600">Free parking available on campus</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">By Bus:</span>
                    <p className="text-gray-600">Bus routes 15, 22, and 45 stop nearby</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">By Metro:</span>
                    <p className="text-gray-600">Knowledge Station - 5 minutes walk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Department Contacts</h2>
            <p className="text-xl text-gray-600">Direct contact information for specific departments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{dept.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{dept.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{dept.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">What are your school hours?</h3>
              <p className="text-gray-600">School hours are Monday-Friday from 8:00 AM to 3:30 PM. The office is open from 8:00 AM to 5:00 PM.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">How can I schedule a school tour?</h3>
              <p className="text-gray-600">You can schedule a tour by calling our admissions office at +1 (555) 123-4568 or using our online contact form.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">What is your response time for inquiries?</h3>
              <p className="text-gray-600">We typically respond to all inquiries within 24-48 hours during business days.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
