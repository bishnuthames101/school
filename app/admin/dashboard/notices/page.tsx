'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Bell, Calendar, Paperclip, Upload } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Holiday' | 'Fee' | 'Important';
  description: string;
  priority: 'normal' | 'important' | 'urgent';
  attachment?: string;
}

interface NoticeFormData {
  title: string;
  date: string;
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Holiday' | 'Fee' | 'Important';
  description: string;
  priority: 'normal' | 'important' | 'urgent';
  attachment: string;
  attachmentFile?: File | null;
}

export default function NoticesManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    date: '',
    category: 'General',
    description: '',
    priority: 'normal',
    attachment: '',
    attachmentFile: null,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notices?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const result = await response.json();
      const data = result.data || [];
      setNotices(data);
      setError('');
    } catch (err) {
      setError('Failed to load notices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        date: notice.date.split('T')[0],
        category: notice.category,
        description: notice.description,
        priority: notice.priority,
        attachment: notice.attachment || '',
        attachmentFile: null,
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        date: '',
        category: 'General',
        description: '',
        priority: 'normal',
        attachment: '',
        attachmentFile: null,
      });
    }
    setFormStatus(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      date: '',
      category: 'General',
      description: '',
      priority: 'normal',
      attachment: '',
      attachmentFile: null,
    });
    setFormStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus(null);

    try {
      const url = editingNotice ? `/api/notices?id=${editingNotice.id}` : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('date', formData.date);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('priority', formData.priority);

      if (formData.attachmentFile) {
        submitData.append('attachment', formData.attachmentFile);
      } else if (editingNotice && formData.attachment) {
        submitData.append('existingAttachment', formData.attachment);
      }

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) throw new Error('Failed to save notice');

      await fetchNotices();
      handleCloseModal();
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to save notice. Please try again.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/notices?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');

      await fetchNotices();
    } catch (err) {
      alert('Failed to delete notice. Please try again.');
      console.error(err);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      General: 'bg-gray-100 text-gray-800',
      Academic: 'bg-blue-100 text-blue-800',
      Exam: 'bg-purple-100 text-purple-800',
      Event: 'bg-green-100 text-green-800',
      Holiday: 'bg-yellow-100 text-yellow-800',
      Fee: 'bg-orange-100 text-orange-800',
      Important: 'bg-red-100 text-red-800',
    };
    return colors[category] || colors.General;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-green-100 text-green-800',
      important: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.normal;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Notices</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage school notices and announcements</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors self-start"
          >
            <Plus className="h-5 w-5" />
            <span>Add Notice</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Notices Table */}
      {notices.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1">{notice.description}</div>
                          {notice.attachment && (
                            <a
                              href={notice.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              <Paperclip className="h-3 w-3 mr-1" />
                              Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(notice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(notice.category)}`}>
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                        {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(notice)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {notices.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first notice.</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Notice</span>
          </button>
        </div>
      )}

      {/* Modal — bottom sheet on mobile, centered dialog on sm+ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-xl shadow-xl max-h-[92vh] sm:max-h-[calc(100vh-2rem)] flex flex-col">

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Sticky header */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1 px-5 py-5 space-y-5">

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notice title"
                  />
                </div>

                {/* Date, Category, Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notice Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Exam">Exam</option>
                      <option value="Event">Event</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Fee">Fee</option>
                      <option value="Important">Important</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Priority *
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Attachment <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    id="noticeAttachmentInput"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, attachmentFile: file });
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="noticeAttachmentInput"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className={`truncate ${formData.attachmentFile ? 'text-gray-800' : 'text-gray-400'}`}>
                      {formData.attachmentFile ? formData.attachmentFile.name : 'Choose file…'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG · Max 10MB
                  </p>
                  {editingNotice && formData.attachment && !formData.attachmentFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      Current: <a href={formData.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View attachment</a>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notice description"
                  />
                </div>

                {/* Inline status */}
                {formStatus && (
                  <p className="text-sm text-red-600">✗ {formStatus.message}</p>
                )}
              </div>

              {/* Sticky footer actions */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
