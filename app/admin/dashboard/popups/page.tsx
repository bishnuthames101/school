'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, MonitorPlay } from 'lucide-react';
import Image from 'next/image';

interface Popup {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

const PopupsPage = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const response = await fetch('/api/popups?all=true');
      const data = await response.json();

      if (Array.isArray(data)) {
        setPopups(data);
      } else {
        console.error('Invalid data format:', data);
        setPopups([]);
      }
    } catch (error) {
      console.error('Error fetching popups:', error);
      setPopups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, imageUrl: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setUploadedImageUrl(data.url);
        setFormData({ ...formData, imageUrl: data.url });
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile && !uploadedImageUrl) {
      alert('Please click "Upload" button first');
      return;
    }

    try {
      if (editingPopup) {
        await fetch(`/api/popups/${editingPopup.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/popups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      fetchPopups();
      closeForm();
    } catch (error) {
      console.error('Error saving popup:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this popup?')) return;

    try {
      await fetch(`/api/popups/${id}`, {
        method: 'DELETE',
      });
      fetchPopups();
    } catch (error) {
      console.error('Error deleting popup:', error);
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      imageUrl: popup.imageUrl,
      linkUrl: popup.linkUrl || '',
      startDate: popup.startDate.split('T')[0],
      endDate: popup.endDate.split('T')[0],
      isActive: popup.isActive,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPopup(null);
    setFormData({
      title: '',
      imageUrl: '',
      linkUrl: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setSelectedFile(null);
    setUploadedImageUrl('');
  };

  const toggleActive = async (popup: Popup) => {
    try {
      await fetch(`/api/popups/${popup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...popup,
          isActive: !popup.isActive,
        }),
      });
      fetchPopups();
    } catch (error) {
      console.error('Error toggling popup status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading popups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Popups</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Popups Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage website popup banners and announcements</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors self-start"
          >
            <Plus className="h-5 w-5" />
            <span>Add Popup</span>
          </button>
        </div>
      </div>

      {/* Popups Grid */}
      {popups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map((popup) => (
            <div key={popup.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all">
              <div className="relative h-48">
                <Image
                  src={popup.imageUrl}
                  alt={popup.title}
                  fill
                  className="object-contain bg-gray-100"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{popup.title}</h3>
                <div className="text-sm text-gray-500 mb-3 space-y-0.5">
                  <p>Start: {new Date(popup.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(popup.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(popup)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      popup.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {popup.isActive ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Inactive
                      </>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(popup)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(popup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {popups.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MonitorPlay className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No popups found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create a popup to display announcements on your website.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Popup</span>
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-4 max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingPopup ? 'Edit Popup' : 'Add New Popup'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image Upload or URL Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Popup Image
                </label>

                {/* File Upload Option */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Option 1: Upload Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  {uploadedImageUrl && (
                    <p className="text-sm text-green-600 mt-1 break-all">
                      Image uploaded successfully
                    </p>
                  )}
                </div>

                <div className="text-center text-gray-400 text-sm">OR</div>

                {/* URL Input Option */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Option 2: Enter Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setSelectedFile(null);
                      setUploadedImageUrl('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg or /popup-image.jpg"
                    disabled={!!uploadedImageUrl}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste any image URL from the internet or local path
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/admission"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingPopup ? 'Update Popup' : 'Create Popup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupsPage;
