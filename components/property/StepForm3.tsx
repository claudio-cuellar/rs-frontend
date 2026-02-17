'use client';

import { useState } from 'react';
import { ChevronLeft, Check, Upload, X, Loader2 } from 'lucide-react';
import type { StepProps } from './multiStepFormTypes';

export function StepForm3({ form, onBack }: StepProps & { isSubmitting?: boolean }) {
  const { watch, setValue, formState: { errors } } = form;
  const images = watch('images') || [];
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    // For now, create object URLs (in production, upload to Supabase Storage)
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setValue('images', [...images, ...newImages]);

    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos de la Propiedad
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Sube al menos 1 foto. Las imágenes de buena calidad ayudan a vender más rápido.
        </p>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
          {uploading ? (
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm font-medium text-gray-700">
            Haz clic para subir fotos
          </p>
          <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
        </label>
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <button
          type="submit"
          disabled={images.length === 0}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-5 w-5" />
          Publicar Propiedad
        </button>
      </div>
    </div>
  );
}
