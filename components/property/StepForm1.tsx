'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepProps } from './multiStepFormTypes';
import { PROPERTY_TYPES, TRANSACTION_TYPES } from './multiStepFormTypes';

export function StepForm1({ form, onNext }: StepProps) {
  const { register, formState: { errors }, watch } = form;
  const transactionType = watch('transactionType');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Operación
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map((type) => (
            <label
              key={type.value}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors',
                transactionType === type.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                {...register('transactionType')}
                value={type.value}
                className="sr-only"
              />
              <span className="font-medium">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Propiedad
        </label>
        <select
          {...register('propertyType')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Selecciona...</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título del Anuncio
        </label>
        <input
          type="text"
          {...register('title')}
          placeholder="Ej: Hermoso departamento en Sopocachi con vista a Illimani"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe las características principales de tu propiedad..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moneda
          </label>
          <select
            {...register('currency')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="BOB">Bolivianos (Bs.)</option>
            <option value="USD">Dólares ($)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habitaciones
          </label>
          <input
            type="number"
            {...register('bedrooms', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baños
          </label>
          <input
            type="number"
            {...register('bathrooms', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área (m²)
          </label>
          <input
            type="number"
            {...register('livingArea', { valueAsNumber: true })}
            min="1"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.livingArea && (
            <p className="mt-1 text-sm text-red-600">{errors.livingArea.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parqueos
          </label>
          <input
            type="number"
            {...register('parkingSpaces', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
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
