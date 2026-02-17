'use client';

import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepProps } from './multiStepFormTypes';
import { NEIGHBORHOODS } from './multiStepFormTypes';

export function StepForm2({ form, onNext, onBack }: StepProps) {
  const { register, formState: { errors }, watch } = form;
  const neighborhood = watch('neighborhood');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Barrio / Zona
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NEIGHBORHOODS.map((n) => (
            <label
              key={n}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-colors text-sm',
                neighborhood === n
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
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
          <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección
        </label>
        <input
          type="text"
          {...register('address')}
          placeholder="Ej: Av. 6 de Agosto #2450"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ciudad
        </label>
        <input
          type="text"
          {...register('city')}
          defaultValue="La Paz"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50"
          readOnly
        />
      </div>

      {/* Map placeholder - would integrate Mapbox here */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Haz clic en el mapa para marcar la ubicación exacta
        </p>
        <p className="text-xs text-gray-400 mt-1">
          (Integración de Mapbox próximamente)
        </p>
      </div>

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
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700"
        >
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
