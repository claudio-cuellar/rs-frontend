'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Camera, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PhotoItem {
  file?: File;
  previewUrl: string;
  uploadedUrl?: string;
  isUploading?: boolean;
  error?: string;
}

interface PhotoUploaderProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
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

    // Create PhotoItems with preview URLs
    const newPhotos: PhotoItem[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos);
    onPhotosChange(updatedPhotos);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const photoToRemove = photos[index];
    // Revoke object URL to prevent memory leaks
    if (photoToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.previewUrl);
    }
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className={cn('', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Fotos de la Propiedad</h3>
        <span className="text-sm text-blue-400">
          {photos.length}/{maxPhotos} fotos
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
            <span className="text-xs font-medium">AGREGAR FOTO</span>
          </button>
        )}

        {/* Photo Thumbnails */}
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl"
          >
            <Image
              src={photo.previewUrl}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Upload indicator */}
            {photo.isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {/* Error indicator */}
            {photo.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                <span className="text-xs text-white">Error</span>
              </div>
            )}

            {/* Primary badge for first photo */}
            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Portada
              </span>
            )}

            <button
              type="button"
              onClick={() => removePhoto(index)}
              disabled={photo.isUploading}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-50"
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
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Help text */}
      <p className="mt-2 text-xs text-gray-500">
        La primera foto será usada como imagen de portada.
      </p>
    </div>
  );
}
