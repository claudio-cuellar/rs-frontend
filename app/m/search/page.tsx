'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchHeader } from '@/components/mobile/SearchHeader';
import { FilterBar } from '@/components/mobile/FilterBar';
import { SortTabs, SortOption } from '@/components/mobile/SortTabs';
import { SearchPropertyCard } from '@/components/mobile/SearchPropertyCard';
import { MapViewButton } from '@/components/mobile/MapViewButton';
import { MobileNavBar } from '@/components/mobile/MobileNavBar';
import type { Property, TransactionType } from '@/types/database';

// Sample data for demo (would come from API in production)
const SAMPLE_PROPERTIES: (Partial<Property> & { id: string; imageUrl: string; transactionType: TransactionType })[] = [
  {
    id: '1',
    title: 'Apartamento Moderno Sopocachi',
    price: 35000,
    price_currency: 'USD',
    neighborhood: 'Sopocachi',
    city: 'La Paz',
    bedrooms: 3,
    bathrooms: 2,
    living_area: 120,
    property_type: 'apartment',
    listing_type: 'sale',
    transactionType: 'anticretico',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },
  {
    id: '2',
    title: 'Casa Residencial Calacoto',
    price: 450000,
    price_currency: 'BOB',
    neighborhood: 'Calacoto',
    city: 'La Paz',
    bedrooms: 4,
    bathrooms: 3,
    living_area: 250,
    property_type: 'house',
    listing_type: 'sale',
    transactionType: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
  {
    id: '3',
    title: 'Departamento San Jorge',
    price: 1200,
    price_currency: 'USD',
    neighborhood: 'San Jorge',
    city: 'La Paz',
    bedrooms: 2,
    bathrooms: 2,
    living_area: 90,
    property_type: 'condo',
    listing_type: 'rent',
    transactionType: 'rent',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  },
  {
    id: '4',
    title: 'Apartamento Achumani',
    price: 25000,
    price_currency: 'BOB',
    neighborhood: 'Achumani',
    city: 'La Paz',
    bedrooms: 3,
    bathrooms: 2,
    living_area: 110,
    property_type: 'apartment',
    listing_type: 'sale',
    transactionType: 'anticretico',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
  },
  {
    id: '5',
    title: 'Casa Moderna Obrajes',
    price: 380000,
    price_currency: 'USD',
    neighborhood: 'Obrajes',
    city: 'La Paz',
    bedrooms: 5,
    bathrooms: 4,
    living_area: 320,
    property_type: 'house',
    listing_type: 'sale',
    transactionType: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
  },
];

function MobileSearchContent() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Get search params
  const neighborhood = searchParams.get('neighborhood');
  const transactionType = searchParams.get('type');
  const query = searchParams.get('q');

  // Filter properties based on params (in production, this would be an API call)
  const filteredProperties = SAMPLE_PROPERTIES.filter((p) => {
    if (neighborhood && p.neighborhood?.toLowerCase() !== neighborhood.toLowerCase()) {
      return false;
    }
    if (transactionType && p.transactionType !== transactionType) {
      return false;
    }
    if (filters.type && p.property_type !== filters.type) {
      return false;
    }
    if (filters.bedrooms && p.bedrooms && p.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'newest') {
      return -1; // Would use created_at in production
    }
    if (sortBy === 'price') {
      return (a.price || 0) - (b.price || 0);
    }
    return 0; // recommended - keep original order
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMapView = () => {
    // Would navigate to map view
    console.log('Open map view');
  };

  // Build title
  const title = neighborhood || 'La Paz, Bolivia';
  const subtitle = `${sortedProperties.length} properties found`;

  return (
    <div className="min-h-screen bg-slate-900 pb-32">
      {/* Header */}
      <SearchHeader
        title={title}
        subtitle={subtitle}
      />

      {/* Filters */}
      <FilterBar onFiltersChange={setFilters} />

      {/* Sort Tabs */}
      <SortTabs value={sortBy} onChange={setSortBy} />

      {/* Property List */}
      <div className="space-y-4 px-4 py-4">
        {sortedProperties.length > 0 ? (
          sortedProperties.map((property) => (
            <SearchPropertyCard
              key={property.id}
              property={property as Property}
              primaryImageUrl={property.imageUrl}
              transactionType={property.transactionType}
              propertyType={property.property_type}
              isFavorited={favorites.has(property.id)}
              onFavoriteClick={() => toggleFavorite(property.id)}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-400">No se encontraron propiedades</p>
            <p className="mt-2 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Map View Button - Floating */}
      <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2">
        <MapViewButton onClick={handleMapView} />
      </div>

      {/* Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}

export default function MobileSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 pb-32 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
      </div>
    }>
      <MobileSearchContent />
    </Suspense>
  );
}
