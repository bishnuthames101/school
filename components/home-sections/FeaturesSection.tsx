import { Award, BookOpen, Users } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

export default function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose {config.name}?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive education that goes beyond academics to nurture well-rounded individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-school-primary-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-school-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Excellence</h3>
            <p className="text-gray-600">
              Rigorous curriculum designed to challenge and inspire students to reach their full potential.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-school-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Faculty</h3>
            <p className="text-gray-600">
              Dedicated and experienced teachers committed to student success and personal growth.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-school-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Extracurricular Activities</h3>
            <p className="text-gray-600">
              Wide range of sports, arts, and cultural activities to develop well-rounded personalities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
