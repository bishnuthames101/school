'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, MonitorPlay, Upload, Link } from 'lucide-react';
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

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      setUploadedImageUrl('');
      setUploadStatus(null);
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadStatus(null);
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
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setUploadStatus({ type: 'success', message: 'Image uploaded successfully' });
      } else {
        setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageTab === 'upload' && selectedFile && !uploadedImageUrl) {
      setUploadStatus({ type: 'error', message: 'Please upload the selected image first.' });
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
      await fetch(`/api/popups/${id}`, { method: 'DELETE' });
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
    setImageTab('url'); // existing popup always has a URL
    setSelectedFile(null);
    setUploadedImageUrl('');
    setUploadStatus(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPopup(null);
    setFormData({ title: '', imageUrl: '', linkUrl: '', startDate: '', endDate: '', isActive: true });
    setSelectedFile(null);
    setUploadedImageUrl('');
    setUploadStatus(null);
    setImageTab('upload');
  };

  const handleSwitchTab = (tab: 'upload' | 'url') => {
    setImageTab(tab);
    setUploadStatus(null);
    if (tab === 'url') {
      setSelectedFile(null);
      setUploadedImageUrl('');
    } else {
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const toggleActive = async (popup: Popup) => {
    try {
      await fetch(`/api/popups/${popup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...popup, isActive: !popup.isActive }),
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
                <Image src={popup.imageUrl} alt={popup.title} fill className="object-contain bg-gray-100" />
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
                      popup.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {popup.isActive ? <><Eye className="h-4 w-4" />Active</> : <><EyeOff className="h-4 w-4" />Inactive</>}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(popup)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(popup.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Form Modal — bottom sheet on mobile, centered dialog on sm+ */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-xl shadow-xl max-h-[92vh] sm:max-h-[calc(100vh-2rem)] flex flex-col">

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Sticky header */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPopup ? 'Edit Popup' : 'Add New Popup'}
              </h2>
              <button
                onClick={closeForm}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Admission Open 2082"
                    required
                  />
                </div>

                {/* Image — tabbed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Popup Image *</label>

                  {/* Tab switcher */}
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-3">
                    <button
                      type="button"
                      onClick={() => handleSwitchTab('upload')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                        imageTab === 'upload'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchTab('url')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                        imageTab === 'url'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Link className="h-4 w-4" />
                      Enter URL
                    </button>
                  </div>

                  {/* Upload panel */}
                  {imageTab === 'upload' && (
                    <div className="space-y-2.5">
                      <input
                        type="file"
                        id="popupFileInput"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="popupFileInput"
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className={`truncate ${selectedFile ? 'text-gray-800' : 'text-gray-400'}`}>
                          {selectedFile ? selectedFile.name : 'Choose image file…'}
                        </span>
                      </label>

                      {selectedFile && !uploadedImageUrl && (
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={uploading}
                          className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {uploading ? 'Uploading…' : 'Upload Image'}
                        </button>
                      )}

                      {uploadStatus && (
                        <p className={`text-sm ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {uploadStatus.type === 'success' ? '✓' : '✗'} {uploadStatus.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* URL panel */}
                  {imageTab === 'url' && (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-gray-400">Paste any public image URL</p>
                    </div>
                  )}
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Link URL <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/admission"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active <span className="text-gray-400 font-normal">(visible on website)</span>
                  </label>
                </div>
              </div>

              {/* Sticky footer actions */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
