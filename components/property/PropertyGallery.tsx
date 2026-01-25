'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Grid, Maximize2 } from 'lucide-react';
import type { PropertyMedia } from '@/types/database';

interface PropertyGalleryProps {
  media: PropertyMedia[];
  propertyTitle: string;
}

export function PropertyGallery({ media, propertyTitle }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images = media.filter((m) => m.media_type === 'image' && m.public_url);
  const primaryImage = images[selectedIndex] || images[0];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-100">
        <div className="container py-8">
          <div className="flex h-96 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
            No images available
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100">
        <div className="container py-4">
          <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
            {/* Main Image */}
            <div 
              className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg md:col-span-2 md:row-span-2"
              onClick={() => setShowFullscreen(true)}
            >
              {primaryImage?.public_url && (
                <Image
                  src={primaryImage.public_url}
                  alt={primaryImage.title || propertyTitle}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  priority
                />
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullscreen(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <Maximize2 className="h-4 w-4" />
                  View all {images.length} photos
                </button>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={image.id}
                className="relative hidden aspect-[4/3] cursor-pointer overflow-hidden rounded-lg md:block"
                onClick={() => {
                  setSelectedIndex(index + 1);
                  setShowFullscreen(true);
                }}
              >
                {image.public_url && (
                  <Image
                    src={image.public_url}
                    alt={image.title || `${propertyTitle} - Image ${index + 2}`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                )}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                    +{images.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
            <span className="text-white">
              {selectedIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setShowFullscreen(false)}
              className="rounded-full p-2 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex h-full items-center justify-center p-16">
            {images[selectedIndex]?.public_url && (
              <div className="relative h-full w-full">
                <Image
                  src={images[selectedIndex].public_url}
                  alt={images[selectedIndex].title || propertyTitle}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex justify-center gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded ${
                    index === selectedIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {image.public_url && (
                    <Image
                      src={image.public_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
