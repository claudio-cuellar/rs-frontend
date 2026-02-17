'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepProps } from './multiStepFormTypes';
import { NEIGHBORHOODS } from './multiStepFormTypes';

/** Step 2 — FormStep2 layer: Ubicación + Fotos (dark theme) */
export function StepForm2({ form, onNext, onBack }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const neighborhood = watch('neighborhood');
  const images = watch('images') || [];
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setValue('images', [...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setValue(
      'images',
      images.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      {/* Ubicación */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">¿Dónde está ubicada?</h2>
        <div className="space-y-3">
          <p className="text-sm text-slate-400">Barrio / Zona</p>
          <div className="grid grid-cols-2 gap-2">
            {NEIGHBORHOODS.map((n) => (
              <label
                key={n}
                className={cn(
                  'flex items-center justify-center rounded-xl border-2 py-3 text-sm cursor-pointer transition-colors',
                  neighborhood === n
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                )}
              >
                <input
                  type="radio"
                  {...register('neighborhood')}
                  value={n}
                  className="sr-only"
                />
                {n}
              </label>
            ))}
          </div>
          {errors.neighborhood && (
            <p className="mt-1 text-sm text-red-400">{errors.neighborhood.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Dirección
          </label>
          <input
            type="text"
            {...register('address')}
            placeholder="Ej: Av. 6 de Agosto #2450"
            className="w-full rounded-xl border-0 bg-slate-800 px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-400">Ciudad</label>
          <input
            type="text"
            {...register('city')}
            readOnly
            className="w-full rounded-xl border-0 bg-slate-800/50 px-4 py-3.5 text-slate-400"
          />
        </div>

        <div className="mt-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 p-6 text-center">
          <MapPin className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-2 text-sm text-slate-400">
            Haz clic en el mapa para marcar la ubicación exacta
          </p>
          <p className="mt-1 text-xs text-slate-500">(Integración de mapa próximamente)</p>
        </div>
      </div>

      {/* Fotos */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">Fotos de la propiedad</h2>
        <p className="mb-3 text-sm text-slate-400">
          Sube al menos 1 foto. Las imágenes de buena calidad ayudan a vender más rápido.
        </p>
        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/50 p-8 cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
          {uploading ? (
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-slate-400" />
          )}
          <p className="mt-2 text-sm font-medium text-slate-300">Haz clic para subir fotos</p>
          <p className="text-xs text-slate-500">PNG, JPG hasta 10MB</p>
        </label>
        {errors.images && (
          <p className="mt-1 text-sm text-red-400">{errors.images.message}</p>
        )}

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-800"
              >
                <img
                  src={url}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1.5 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-600"
        >
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
