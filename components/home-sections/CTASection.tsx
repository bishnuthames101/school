import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

export default function CTASection() {
  return (
    <section className="py-16 bg-school-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Join Our Community?
        </h2>
        <p className="text-xl text-school-primary-100 mb-8 max-w-2xl mx-auto">
          Take the first step towards your child&apos;s bright future. Apply now and become
          part of our excellence tradition.
        </p>
        <Link
          href="/admission"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-school-primary bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Start Your Application
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
