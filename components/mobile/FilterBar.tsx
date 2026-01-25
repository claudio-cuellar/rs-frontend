'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onFiltersChange?: (filters: Record<string, string>) => void;
  className?: string;
}

const PRICE_OPTIONS: FilterOption[] = [
  { label: 'Cualquier precio', value: '' },
  { label: 'Hasta Bs 50,000', value: '0-50000' },
  { label: 'Bs 50,000 - 100,000', value: '50000-100000' },
  { label: 'Bs 100,000 - 250,000', value: '100000-250000' },
  { label: 'Bs 250,000 - 500,000', value: '250000-500000' },
  { label: 'Más de Bs 500,000', value: '500000-' },
];

const BEDROOM_OPTIONS: FilterOption[] = [
  { label: 'Cualquiera', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
];

const TYPE_OPTIONS: FilterOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Apartamento', value: 'apartment' },
  { label: 'Casa', value: 'house' },
  { label: 'Terreno', value: 'land' },
  { label: 'Comercial', value: 'commercial' },
];

export function FilterBar({ onFiltersChange, className }: FilterBarProps) {
  const { currency, setCurrency } = useCurrency();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    price: '',
    bedrooms: '',
    type: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setActiveDropdown(null);
    onFiltersChange?.(newFilters);
  };

  const getFilterLabel = (key: string, options: FilterOption[]) => {
    const value = filters[key as keyof typeof filters];
    if (!value) return options[0].label.split(' ')[0]; // Return first word as default
    return options.find((o) => o.value === value)?.label || options[0].label;
  };

  const hasActiveFilter = (key: string) => {
    return filters[key as keyof typeof filters] !== '';
  };

  return (
    <div className={cn('bg-slate-900 px-4 py-3', className)}>
      {/* Currency Toggle */}
      <div className="mb-3 flex rounded-lg bg-slate-800 p-1">
        <button
          onClick={() => setCurrency('BOB')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
            currency === 'BOB'
              ? 'bg-slate-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          )}
        >
          BOB
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
            currency === 'USD'
              ? 'bg-slate-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          )}
        >
          USD
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {/* Price Filter */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors',
              hasActiveFilter('price')
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            )}
          >
            Price
            <ChevronDown className="h-4 w-4" />
          </button>
          {activeDropdown === 'price' && (
            <FilterDropdown
              options={PRICE_OPTIONS}
              value={filters.price}
              onChange={(v) => handleFilterChange('price', v)}
              onClose={() => setActiveDropdown(null)}
            />
          )}
        </div>

        {/* Bedrooms Filter */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'bedrooms' ? null : 'bedrooms')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors',
              hasActiveFilter('bedrooms')
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            )}
          >
            Bedrooms
            <ChevronDown className="h-4 w-4" />
          </button>
          {activeDropdown === 'bedrooms' && (
            <FilterDropdown
              options={BEDROOM_OPTIONS}
              value={filters.bedrooms}
              onChange={(v) => handleFilterChange('bedrooms', v)}
              onClose={() => setActiveDropdown(null)}
            />
          )}
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors',
              hasActiveFilter('type')
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            )}
          >
            Type
            <ChevronDown className="h-4 w-4" />
          </button>
          {activeDropdown === 'type' && (
            <FilterDropdown
              options={TYPE_OPTIONS}
              value={filters.type}
              onChange={(v) => handleFilterChange('type', v)}
              onClose={() => setActiveDropdown(null)}
            />
          )}
        </div>

        {/* More Filters Button */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-gray-300 hover:bg-slate-700">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Dropdown component
function FilterDropdown({
  options,
  value,
  onChange,
  onClose,
}: {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Dropdown */}
      <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl bg-slate-800 py-2 shadow-xl">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'block w-full px-4 py-2.5 text-left text-sm transition-colors',
              value === option.value
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-300 hover:bg-slate-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
