'use client';

import { cn } from '@/lib/utils';
import {
  Building2,
  Home,
  Layout,
  Building,
  Mountain,
  MoreHorizontal,
} from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Departamento', icon: Building2 },
  { value: 'house', label: 'Casa', icon: Home },
  { value: 'condo', label: 'Estudio', icon: Layout },
  { value: 'office', label: 'Oficina', icon: Building },
  { value: 'land', label: 'Terreno', icon: Mountain },
  { value: 'commercial', label: 'Otro', icon: MoreHorizontal },
] as const;

interface PropertyTypeGridProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PropertyTypeGrid({
  value,
  onChange,
  className,
}: PropertyTypeGridProps) {
  return (
    <div className={className}>
      <h2 className="mb-3 text-lg font-bold text-white">
        ¿Qué tipo de propiedad es?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {PROPERTY_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
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
    </div>
  );
}
