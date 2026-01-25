'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

interface PropertyFiltersProps {
  currentFilters: {
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    city?: string;
    propertyType?: string;
  };
}

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
];

const priceRanges = [
  { min: '', max: '100000', label: 'Under $100K' },
  { min: '100000', max: '250000', label: '$100K - $250K' },
  { min: '250000', max: '500000', label: '$250K - $500K' },
  { min: '500000', max: '750000', label: '$500K - $750K' },
  { min: '750000', max: '1000000', label: '$750K - $1M' },
  { min: '1000000', max: '', label: '$1M+' },
];

export function PropertyFilters({ currentFilters }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(currentFilters);

  const updateFilters = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key as keyof typeof newFilters];
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`/properties?${params.toString()}`);
  }, [filters, router, searchParams]);

  const clearFilters = () => {
    setFilters({});
    router.push('/properties');
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear all
        </button>
      </div>

      {/* Listing Type */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Listing Type</h3>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => updateFilters('type', filters.type === 'sale' ? '' : 'sale')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filters.type === 'sale'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => updateFilters('type', filters.type === 'rent' ? '' : 'rent')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filters.type === 'rent'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* Property Type */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Property Type</h3>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => updateFilters('propertyType', e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
        <div className="mt-2 space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2">
              <input
                type="radio"
                name="priceRange"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => {
                  updateFilters('minPrice', range.min);
                  updateFilters('maxPrice', range.max);
                }}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Bedrooms</h3>
        <div className="mt-2 flex gap-2">
          {['1', '2', '3', '4', '5'].map((num) => (
            <button
              key={num}
              onClick={() => updateFilters('bedrooms', filters.bedrooms === num ? '' : num)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                filters.bedrooms === num
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">Bathrooms</h3>
        <div className="mt-2 flex gap-2">
          {['1', '2', '3', '4'].map((num) => (
            <button
              key={num}
              onClick={() => updateFilters('bathrooms', filters.bathrooms === num ? '' : num)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                filters.bathrooms === num
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* City Search */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900">City</h3>
        <input
          type="text"
          value={filters.city || ''}
          onChange={(e) => updateFilters('city', e.target.value)}
          placeholder="Enter city name..."
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}
