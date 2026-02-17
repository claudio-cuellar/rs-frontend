'use client';

import { cn } from '@/lib/utils';

export type TransactionType = 'sale' | 'rent' | 'anticretico';

interface ListingTypeTabsProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  className?: string;
}

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
];

export function ListingTypeTabs({
  value,
  onChange,
  className,
}: ListingTypeTabsProps) {
  return (
    <div className={className}>
      <h2 className="mb-3 text-lg font-bold text-white">Quiero...</h2>
      <div className="flex rounded-xl bg-slate-800 p-1">
        {TRANSACTION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              'flex-1 rounded-lg py-3 text-sm font-medium transition-all',
              value === type.value
                ? 'bg-slate-900 text-blue-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
