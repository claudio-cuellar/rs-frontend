'use client';

import { cn } from '@/lib/utils';

export type FilterType = 'all' | 'sale' | 'rent' | 'anticretico';

interface FilterChipsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'sale', label: 'Sale' },
  { id: 'rent', label: 'Rent' },
  { id: 'anticretico', label: 'Anticrético' },
];

export function FilterChips({
  activeFilter,
  onFilterChange,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto px-4 scrollbar-hide', className)}>
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-slate-700 text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-400'
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
