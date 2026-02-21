'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'Campus' | 'Events' | 'Sports' | 'Cultural' | 'Academic' | 'Other';
}

interface GalleryFormData {
  image: File | null;
  caption: string;
  category: 'Campus' | 'Events' | 'Sports' | 'Cultural' | 'Academic' | 'Other';
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formStatus, setFormStatus] = useState<{ type: 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    image: null,
    caption: '',
    category: 'Campus',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      const result = await response.json();
      setImages(result.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load gallery images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      image: null,
      caption: '',
      category: 'Campus',
    });
    setImagePreview('');
    setFormStatus(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      image: null,
      caption: '',
      category: 'Campus',
    });
    setImagePreview('');
    setFormStatus(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setFormStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }

    setSubmitting(true);
    setFormStatus(null);

    try {
      const submitData = new FormData();
      submitData.append('image', formData.image);
      submitData.append('caption', formData.caption);
      submitData.append('category', formData.category);

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add image');
      }

      await fetchImages();
      handleCloseModal();
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to add image. Please try again.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      await fetchImages();
    } catch (err) {
      alert('Failed to delete image. Please try again.');
      console.error(err);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Campus: 'bg-blue-100 text-blue-800',
      Events: 'bg-purple-100 text-purple-800',
      Sports: 'bg-green-100 text-green-800',
      Cultural: 'bg-pink-100 text-pink-800',
      Academic: 'bg-yellow-100 text-yellow-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  const categories = ['All', 'Campus', 'Events', 'Sports', 'Cultural', 'Academic', 'Other'];

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Gallery</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage school photo gallery</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors self-start"
          >
            <Plus className="h-5 w-5" />
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      {filteredImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all group">
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm text-gray-900 font-medium line-clamp-2 flex-1">{image.caption}</p>
                </div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(image.category)}`}>
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredImages.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedCategory === 'All' ? 'No images found' : `No ${selectedCategory} images found`}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {selectedCategory === 'All'
              ? 'Get started by adding your first image.'
              : 'Try selecting a different category or add a new image.'}
          </p>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Image</span>
          </button>
        </div>
      )}

      {/* Stats */}
      {images.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{images.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            {['Campus', 'Events', 'Sports', 'Cultural', 'Academic', 'Other'].map((cat) => (
              <div key={cat} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {images.filter((img) => img.category === cat).length}
                </div>
                <div className="text-xs text-gray-500">{cat}</div>
              </div>
            ))}
          </div>
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
              <h2 className="text-lg font-bold text-gray-900">Add New Image</h2>
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image File *
                  </label>
                  <input
                    type="file"
                    id="galleryImageInput"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="galleryImageInput"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className={`truncate ${formData.image ? 'text-gray-800' : 'text-gray-400'}`}>
                      {formData.image ? formData.image.name : 'Choose image file…'}
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-400">
                    JPEG, PNG, GIF, WebP · Max 5MB
                  </p>
                  {imagePreview && (
                    <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Caption *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image caption"
                  />
                </div>

                {/* Category */}
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
                    <option value="Campus">Campus</option>
                    <option value="Events">Events</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Academic">Academic</option>
                    <option value="Other">Other</option>
                  </select>
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
                  {submitting ? 'Adding...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
