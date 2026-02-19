'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { initializeSession } from '@/components/SessionManager';

interface LoginFormProps {
  schoolName: string;
}

function LoginFormInner({ schoolName }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';

  useEffect(() => {
    if (sessionExpired) {
      setError('Your session has expired. Please login again.');
    }
  }, [sessionExpired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        initializeSession();
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-school-primary-50 to-school-primary-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-school-primary-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-school-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">{schoolName} Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-school-primary focus:border-transparent pr-12"
                  placeholder="Enter admin password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-school-primary hover:opacity-90 text-white font-medium py-3 px-4 rounded-md transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-school-primary hover:opacity-70 transition-opacity duration-200"
            >
              &larr; Back to Website
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-school-primary-50 border border-school-primary-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-school-primary-dark mb-2">Admin Panel Features:</h3>
          <ul className="text-sm text-school-primary space-y-1">
            <li>Manage Events &amp; Notices</li>
            <li>Update Gallery Images</li>
            <li>View Application Forms</li>
            <li>View Contact Submissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function LoginForm({ schoolName }: LoginFormProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-school-primary-50 to-school-primary-100">
        <div className="text-school-primary">Loading...</div>
      </div>
    }>
      <LoginFormInner schoolName={schoolName} />
    </Suspense>
  );
}
