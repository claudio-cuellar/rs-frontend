'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  className?: string;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 15,
  className,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    // Create object URLs for preview
    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
    const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos);
    onPhotosChange(updatedPhotos);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Property Photos</h3>
        <span className="text-sm text-blue-400">
          Max {maxPhotos} photos
        </span>
      </div>

      {/* Photo Grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Photo Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-28 w-28 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/50 text-gray-400 hover:border-blue-500 hover:text-blue-400"
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">ADD PHOTO</span>
          </button>
        )}

        {/* Photo Thumbnails */}
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl"
          >
            <Image
              src={photo}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
