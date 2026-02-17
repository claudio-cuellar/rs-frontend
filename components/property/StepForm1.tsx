'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepProps } from './multiStepFormTypes';
import { TRANSACTION_TYPES, TITLE_MAX_LENGTH } from './multiStepFormTypes';
import {
  Building2,
  Home,
  Layout,
  Building,
  Mountain,
  MoreHorizontal,
} from 'lucide-react';

const PROPERTY_GRID = [
  { value: 'apartment', label: 'Departamento', icon: Building2 },
  { value: 'house', label: 'Casa', icon: Home },
  { value: 'condo', label: 'Estudio', icon: Layout },
  { value: 'office', label: 'Oficina', icon: Building },
  { value: 'land', label: 'Terreno', icon: Mountain },
  { value: 'commercial', label: 'Otro', icon: MoreHorizontal },
] as const;

/** Step 1 — FormStep1 layer: Quiero..., tipo de propiedad, título del anuncio (dark theme) */
export function StepForm1({ form, onNext }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const transactionType = watch('transactionType');
  const propertyType = watch('propertyType');
  const title = watch('title') ?? '';

  return (
    <div className="space-y-8">
      {/* Quiero... — 3 tabs */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">Quiero...</h2>
        <div className="flex rounded-xl bg-slate-800 p-1">
          {TRANSACTION_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setValue('transactionType', type.value)}
              className={cn(
                'flex-1 rounded-lg py-3 text-sm font-medium transition-all',
                transactionType === type.value
                  ? 'bg-slate-900 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-400">{errors.transactionType.message}</p>
        )}
      </div>

      {/* ¿Qué tipo de propiedad es? — 6-card grid */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-white">
          ¿Qué tipo de propiedad es?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_GRID.map((type) => {
            const Icon = type.icon;
            const isSelected = propertyType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setValue('propertyType', type.value)}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all',
                  isSelected
                    ? 'border-2 border-blue-500 bg-blue-500/10'
                    : 'border-2 border-slate-700 bg-slate-800/50 hover:border-slate-600'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6',
                    isSelected ? 'text-blue-400' : 'text-slate-400'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-white' : 'text-slate-300'
                  )}
                >
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.propertyType && (
          <p className="mt-1 text-sm text-red-400">{errors.propertyType.message}</p>
        )}
      </div>

      {/* Título del anuncio — 0/80 + helper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Título del anuncio</h2>
          <span className="text-sm text-slate-400">
            {title.length} / {TITLE_MAX_LENGTH}
          </span>
        </div>
        <input
          type="text"
          maxLength={TITLE_MAX_LENGTH}
          {...register('title')}
          placeholder="ej. Departamento moderno de 2 dormitorios en Sopocachi"
          className="w-full rounded-xl border-0 bg-slate-800 px-4 py-3.5 text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400">
          Un título atractivo ayuda a que tu propiedad se destaque en los
          resultados de búsqueda.
        </p>
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
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
