import { Award, BookOpen, Star, Users } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const stats = [
  { label: 'Students',          icon: Users,    key: 'students'         },
  { label: 'Faculty Members',   icon: Award,    key: 'faculty'          },
  { label: 'Programs',          icon: BookOpen, key: 'programs'         },
  { label: 'Years of Excellence', icon: Star,   key: 'yearsOfExcellence'},
] as const;

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ label, icon: Icon, key }) => (
            <div key={key} className="text-center">
              <div className="flex justify-center mb-4">
                <Icon className="h-12 w-12 text-school-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {config.stats[key]}
              </div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
