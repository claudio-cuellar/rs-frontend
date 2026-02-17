'use client';

import { ChevronLeft, Check, Home, MapPin, Image, Layout } from 'lucide-react';
import type { StepProps } from './multiStepFormTypes';
import {
  TRANSACTION_TYPES,
  PROPERTY_TYPES,
  CONTRACT_DURATION_OPTIONS,
} from './multiStepFormTypes';

/** Step 4 — Review & Publish (FormStep4-style): summary of listing + submit */
export function StepForm4({
  form,
  onBack,
  isSubmitting,
}: StepProps & { isSubmitting?: boolean }) {
  const { watch } = form;
  const values = watch();

  const transactionLabel =
    TRANSACTION_TYPES.find((t) => t.value === values.transactionType)?.label ??
    values.transactionType;
  const propertyLabel =
    PROPERTY_TYPES.find((p) => p.value === values.propertyType)?.label ??
    values.propertyType;
  const durationLabel =
    values.contractDurationYears != null
      ? CONTRACT_DURATION_OPTIONS.find(
          (o) => o.value === values.contractDurationYears
        )?.label ?? String(values.contractDurationYears)
      : null;

  return (
    <div className="space-y-8">
      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-white">
          Revisa tu anuncio
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Confirma que todo esté correcto antes de publicar.
        </p>
      </div>

      {/* Summary sections */}
      <div className="space-y-6">
        {/* Información básica */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
            <Home className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">
              Información básica
            </h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-400">Título</dt>
              <dd className="font-medium text-white">{values.title || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Tipo de operación</dt>
              <dd className="font-medium text-white">{transactionLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Tipo de propiedad</dt>
              <dd className="font-medium text-white">{propertyLabel}</dd>
            </div>
            {(values.price ?? 0) > 0 && (
              <div>
                <dt className="text-slate-400">Precio</dt>
                <dd className="font-medium text-white">
                  {values.currency === 'USD' ? '$' : 'Bs '}
                  {values.price?.toLocaleString() ?? '—'}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Ubicación */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Ubicación</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-400">Barrio</dt>
              <dd className="font-medium text-white">
                {values.neighborhood || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Dirección</dt>
              <dd className="font-medium text-white">
                {values.address || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Ciudad</dt>
              <dd className="font-medium text-white">
                {values.city || 'La Paz'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Fotos */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
            <Image className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Fotos</h2>
          </div>
          <p className="text-sm text-slate-300">
            {values.images?.length ?? 0} foto(s) subida(s)
          </p>
        </div>

        {/* Detalles (características + Anticrético si aplica) */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-3">
            <Layout className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Detalles</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-slate-400">Dormitorios</dt>
              <dd className="font-medium text-white">
                {values.bedrooms ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Baños</dt>
              <dd className="font-medium text-white">
                {values.bathrooms ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Área total</dt>
              <dd className="font-medium text-white">
                {values.livingArea ? `${values.livingArea} m²` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Estacionamientos</dt>
              <dd className="font-medium text-white">
                {values.parkingSpaces ?? 0}
              </dd>
            </div>
            {values.transactionType === 'anticretico' && (
              <>
                {durationLabel != null && (
                  <div>
                    <dt className="text-slate-400">Duración del contrato</dt>
                    <dd className="font-medium text-white">
                      {durationLabel} año(s)
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-400">Registrado en Derechos Reales</dt>
                  <dd className="font-medium text-white">
                    {values.registeredInPublicRecords ? 'Sí' : 'No'}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Footer: Back + Publish */}
      <div className="flex justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
          {isSubmitting ? 'Publicando…' : 'Publicar propiedad'}
        </button>
      </div>
    </div>
  );
}
