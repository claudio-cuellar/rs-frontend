'use client';

import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/database';

interface ListingTypeTabsProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  className?: string;
}

const LISTING_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Sale' },
  { value: 'rent', label: 'Rent' },
  { value: 'anticretico', label: 'Anticrético' },
];

export function ListingTypeTabs({
  value,
  onChange,
  className,
}: ListingTypeTabsProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-white">
        Listing Type
      </label>

      <div className="flex rounded-xl bg-slate-800 p-1">
        {LISTING_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors',
              value === type.value
                ? 'bg-slate-700 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
