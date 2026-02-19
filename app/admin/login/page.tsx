import { getSchoolConfig } from '@/lib/school-config';
import { LoginForm } from './LoginForm';

export default function AdminLogin() {
  const config = getSchoolConfig();
  return <LoginForm schoolName={config.name} />;
}
