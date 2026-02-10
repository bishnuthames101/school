import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  GraduationCap,
  Lock
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">Excellence Academy</h3>
                <p className="text-sm text-gray-400">Nurturing Future Leaders</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Committed to providing quality education and fostering holistic development
              of students through innovative teaching methods and comprehensive learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="text-gray-300 hover:text-blue-400 transition-colors">Academics</Link></li>
              <li><Link href="/admission" className="text-gray-300 hover:text-blue-400 transition-colors">Admission</Link></li>
              <li><Link href="/facilities" className="text-gray-300 hover:text-blue-400 transition-colors">Facilities</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-blue-400 transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  123 Education Street<br />
                  Knowledge City, KC 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@excellenceacademy.edu</p>
              </div>
            </div>
          </div>

          {/* Social Media & Admin Login */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-2">School Hours</h5>
              <p className="text-gray-300 text-sm">
                Monday - Friday: 8:00 AM - 3:30 PM<br />
                Office Hours: 8:00 AM - 5:00 PM
              </p>
            </div>
            {/* Admin Login Button */}
            <div>
              <Link
                href="/admin/login"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <Lock className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Excellence Academy. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
