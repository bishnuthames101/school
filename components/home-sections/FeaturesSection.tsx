import { Award, BookOpen, Users, type LucideIcon } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const iconMap: Record<string, LucideIcon> = { BookOpen, Users, Award };

const cardStyles = [
  { bg: 'bg-school-primary-100', text: 'text-school-primary'   },
  { bg: 'bg-green-100',          text: 'text-school-secondary' },
  { bg: 'bg-yellow-100',         text: 'text-school-accent'    },
];

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
          {config.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? BookOpen;
            const { bg, text } = cardStyles[index % cardStyles.length];
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${text}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
