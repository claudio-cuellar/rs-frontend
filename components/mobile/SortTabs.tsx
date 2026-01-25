'use client';

import { cn } from '@/lib/utils';

export type SortOption = 'recommended' | 'newest' | 'price';

interface SortTabsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'RECOMMENDED' },
  { value: 'newest', label: 'NEWEST' },
  { value: 'price', label: 'PRICE' },
];

export function SortTabs({ value, onChange, className }: SortTabsProps) {
  return (
    <div className={cn('flex gap-4 bg-slate-900 px-4 py-3', className)}>
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'text-xs font-semibold tracking-wide transition-colors',
            value === option.value
              ? 'text-blue-400'
              : 'text-gray-500 hover:text-gray-400'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
