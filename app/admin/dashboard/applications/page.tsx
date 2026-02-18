'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Calendar, User, Mail, Phone, GraduationCap, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface Application {
  id: string;
  studentNameEn: string;
  studentNameNp?: string;
  dobAD: string;
  dobBS?: string;
  gender: string;
  nationality: string;
  gradeApplying: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation?: string;
  motherName: string;
  motherPhone?: string;
  motherOccupation?: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: string;
  tole?: string;
  previousSchool?: string;
  previousClass?: string;
  email: string;
  phone: string;
  message?: string;
  status: string;
  createdAt: string;
}

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const result = await response.json();
      setApplications(result.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      reviewed: 'bg-blue-100 text-blue-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const grades = ['All', ...Array.from(new Set(applications.map((app) => app.gradeApplying)))];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = filterGrade === 'All' || app.gradeApplying === filterGrade;

    return matchesSearch && matchesGrade;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Applications</span>
        </p>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage student admission applications</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      {applications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-blue-500 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-yellow-500 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {applications.filter((app) => app.status.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-green-500 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter((app) => app.status.toLowerCase() === 'accepted').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-red-500 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter((app) => app.status.toLowerCase() === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, father's name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === 'All' ? 'All Grades' : grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 && (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Summary Row */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{app.studentNameEn}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center">
                        <GraduationCap className="h-3.5 w-3.5 mr-1" />
                        {app.gradeApplying}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        {app.phone}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {app.district}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {expandedId === app.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === app.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Student Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Student Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Name (EN)</dt>
                          <dd className="text-gray-900">{app.studentNameEn}</dd>
                        </div>
                        {app.studentNameNp && (
                          <div>
                            <dt className="text-gray-500">Name (NP)</dt>
                            <dd className="text-gray-900">{app.studentNameNp}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-gray-500">DOB (AD)</dt>
                          <dd className="text-gray-900">{new Date(app.dobAD).toLocaleDateString()}</dd>
                        </div>
                        {app.dobBS && (
                          <div>
                            <dt className="text-gray-500">DOB (BS)</dt>
                            <dd className="text-gray-900">{app.dobBS}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-gray-500">Gender</dt>
                          <dd className="text-gray-900">{app.gender}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Nationality</dt>
                          <dd className="text-gray-900">{app.nationality}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Grade Applying</dt>
                          <dd className="text-gray-900">{app.gradeApplying}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Parent Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Parent / Guardian</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Father</dt>
                          <dd className="text-gray-900">{app.fatherName}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Father&apos;s Phone</dt>
                          <dd className="text-gray-900">{app.fatherPhone}</dd>
                        </div>
                        {app.fatherOccupation && (
                          <div>
                            <dt className="text-gray-500">Father&apos;s Occupation</dt>
                            <dd className="text-gray-900">{app.fatherOccupation}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-gray-500">Mother</dt>
                          <dd className="text-gray-900">{app.motherName}</dd>
                        </div>
                        {app.motherPhone && (
                          <div>
                            <dt className="text-gray-500">Mother&apos;s Phone</dt>
                            <dd className="text-gray-900">{app.motherPhone}</dd>
                          </div>
                        )}
                        {app.motherOccupation && (
                          <div>
                            <dt className="text-gray-500">Mother&apos;s Occupation</dt>
                            <dd className="text-gray-900">{app.motherOccupation}</dd>
                          </div>
                        )}
                      </dl>

                      <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-3">Contact</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <dd className="text-gray-900">{app.email}</dd>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <dd className="text-gray-900">{app.phone}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Address & Previous Education */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Address</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">Province</dt>
                          <dd className="text-gray-900">{app.province}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">District</dt>
                          <dd className="text-gray-900">{app.district}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Municipality, Ward</dt>
                          <dd className="text-gray-900">
                            {app.municipality}, Ward {app.wardNo}
                          </dd>
                        </div>
                        {app.tole && (
                          <div>
                            <dt className="text-gray-500">Tole</dt>
                            <dd className="text-gray-900">{app.tole}</dd>
                          </div>
                        )}
                      </dl>

                      {(app.previousSchool || app.previousClass) && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-3">Previous Education</h4>
                          <dl className="space-y-2 text-sm">
                            {app.previousSchool && (
                              <div>
                                <dt className="text-gray-500">School</dt>
                                <dd className="text-gray-900">{app.previousSchool}</dd>
                              </div>
                            )}
                            {app.previousClass && (
                              <div>
                                <dt className="text-gray-500">Last Class</dt>
                                <dd className="text-gray-900">{app.previousClass}</dd>
                              </div>
                            )}
                          </dl>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  {app.message && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Additional Message</h4>
                      <p className="text-sm text-gray-700">{app.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredApplications.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {applications.length === 0 ? 'No applications found' : 'No matching applications'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {applications.length === 0
              ? 'Applications will appear here when students submit their admission forms.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      )}

      {/* Results Count */}
      {filteredApplications.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredApplications.length} of {applications.length} application
          {applications.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
