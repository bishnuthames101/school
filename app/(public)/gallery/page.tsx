'use client';

import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { getImageUrl, IMAGE_PRESETS } from '@/lib/storage';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const categories = ['All', 'Campus', 'Events', 'Sports', 'Cultural', 'Academic', 'Other'];

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/gallery?limit=1000')
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((result) => setImages(result.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div>
      {/* Hero */}
      <section className="bg-school-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Photo Gallery</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A visual journey through life at {config.name} — campus moments, events, sports, and more.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-school-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
                {cat !== 'All' && images.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({images.filter((i) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No images in this category yet.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6 text-right">
                {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="relative group overflow-hidden rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setLightboxImage(image)}
                  >
                    <img
                      src={getImageUrl(image.imageUrl, IMAGE_PRESETS.card)}
                      alt={image.caption}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-end">
                      <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full">
                        <p className="text-sm font-medium truncate">{image.caption}</p>
                        <span className="text-xs opacity-75">{image.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageUrl(lightboxImage.imageUrl, IMAGE_PRESETS.full)}
              alt={lightboxImage.caption}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{lightboxImage.caption}</p>
                <span className="text-white/60 text-sm">{lightboxImage.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
