'use client';

import { ChevronLeft, ChevronRight, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepProps } from './multiStepFormTypes';
import { CONTRACT_DURATION_OPTIONS } from './multiStepFormTypes';

/** Step 3 — FormStep3 layer: Property Details (physical specs + Anticrético terms), dark theme */
export function StepForm3({ form, onNext, onBack }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const transactionType = watch('transactionType');
  const isAnticretico = transactionType === 'anticretico';
  const contractDurationYears = watch('contractDurationYears');
  const registeredInPublicRecords = watch('registeredInPublicRecords');

  return (
    <div className="space-y-8">
      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-white">
          Cuéntanos más sobre el espacio y el acuerdo.
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Completa las características físicas y los términos legales del
          Anticrético.
        </p>
      </div>

      {/* Physical Specifications */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
          <Layout className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold text-white">
            Características físicas
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Dormitorios
            </label>
            <input
              type="number"
              min={0}
              {...register('bedrooms', { valueAsNumber: true })}
              className="h-[50px] w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Baños
            </label>
            <input
              type="number"
              min={0}
              {...register('bathrooms', { valueAsNumber: true })}
              className="h-[50px] w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Área total (m²)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              {...register('livingArea', { valueAsNumber: true })}
              placeholder="ej. 120"
              className="h-[50px] w-full rounded-lg border border-slate-700 bg-slate-900 pl-4 pr-12 text-base text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              m²
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Estacionamientos
          </label>
          <input
            type="number"
            min={0}
            {...register('parkingSpaces', { valueAsNumber: true })}
            className="h-[50px] w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-base text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Anticrético Terms — only when transaction is Anticrético */}
      {isAnticretico && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
            <h2 className="text-lg font-bold text-white">
              Términos de Anticrético
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Duración del contrato (años)
            </label>
            <div className="flex gap-2">
              {CONTRACT_DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setValue('contractDurationYears', opt.value)
                  }
                  className={cn(
                    'flex-1 rounded-lg border-2 py-3 text-sm font-medium transition-colors',
                    contractDurationYears === opt.value
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={!!registeredInPublicRecords}
                onChange={(e) =>
                  setValue('registeredInPublicRecords', e.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-200">
                ¿Registrado en Derechos Reales?
              </span>
            </label>
            <p className="text-sm text-slate-400">
              ¿Este contrato está legalmente registrado en Derechos Reales?
            </p>
            <p className="text-xs text-slate-500">
              El estado de registro puede afectar la visibilidad del anuncio. Las
              propiedades registradas suelen recibir hasta 40% más consultas.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
        >
          Continuar al paso 4
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
