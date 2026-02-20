import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Lock
} from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const FooterFull: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src={config.logo} alt={config.name} width={36} height={36} className="object-contain" />
              <div>
                <h3 className="text-xl font-bold">{config.name}</h3>
                <p className="text-sm text-gray-400">{config.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-school-primary-light transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="text-gray-300 hover:text-school-primary-light transition-colors">Academics</Link></li>
              <li><Link href="/admission" className="text-gray-300 hover:text-school-primary-light transition-colors">Admission</Link></li>
              <li><Link href="/facilities" className="text-gray-300 hover:text-school-primary-light transition-colors">Facilities</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-school-primary-light transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-school-primary-light mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {config.contact.address}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-school-primary-light flex-shrink-0" />
                <p className="text-gray-300 text-sm">{config.contact.phones.main}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-school-primary-light flex-shrink-0" />
                <p className="text-gray-300 text-sm">{config.contact.emails.info}</p>
              </div>
            </div>
          </div>

          {/* Social Media & Admin Login */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              {config.social.facebook && (
                <a href={config.social.facebook} className="text-gray-300 hover:text-school-primary-light transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {config.social.twitter && (
                <a href={config.social.twitter} className="text-gray-300 hover:text-school-primary-light transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {config.social.instagram && (
                <a href={config.social.instagram} className="text-gray-300 hover:text-school-primary-light transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {config.social.youtube && (
                <a href={config.social.youtube} className="text-gray-300 hover:text-school-primary-light transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              )}
            </div>
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-2">School Hours</h5>
              <p className="text-gray-300 text-sm">
                {config.contact.officeHours.weekdays}
                {config.contact.officeHours.saturday && <><br />{config.contact.officeHours.saturday}</>}
              </p>
            </div>
            {/* Admin Login Button */}
            <div>
              <Link
                href="/admin/login"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-school-primary hover:bg-school-primary-dark text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <Lock className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {config.name}. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterFull;
