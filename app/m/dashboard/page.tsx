'use client';

import { useState } from 'react';
import {
  DashboardHeader,
  DashboardTabs,
  DashboardTab,
  FilterChips,
  FilterType,
  DashboardPropertyCard,
  DashboardNavBar,
} from '@/components/mobile/dashboard';
import { SectionHeader } from '@/components/mobile/SectionHeader';
import type { TransactionType } from '@/types/database';

// Sample user data
const USER = {
  name: 'Carlos',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
};

// Sample properties data
interface SampleProperty {
  id: string;
  title: string;
  price: number;
  priceCurrency: string;
  transactionType: TransactionType;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  status: 'active' | 'sold' | 'archived' | 'new';
  isFavorited: boolean;
  hasPriceDropped?: boolean;
  isNewListing?: boolean;
}

const SAMPLE_FAVORITES: SampleProperty[] = [
  {
    id: '1',
    title: 'Modern Condo in Calacoto',
    price: 45000,
    priceCurrency: 'USD',
    transactionType: 'anticretico',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    location: 'Zona Sur, La Paz',
    status: 'active',
    isFavorited: true,
    hasPriceDropped: true,
  },
  {
    id: '2',
    title: 'Historic Sopocachi Residence',
    price: 185000,
    priceCurrency: 'USD',
    transactionType: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    location: 'Sopocachi, La Paz',
    status: 'sold',
    isFavorited: true,
  },
  {
    id: '3',
    title: 'Penthouse Achumani View',
    price: 850,
    priceCurrency: 'USD',
    transactionType: 'rent',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    location: 'Achumani, La Paz',
    status: 'active',
    isFavorited: true,
    isNewListing: true,
  },
];

const SAMPLE_LISTINGS: SampleProperty[] = [
  {
    id: '4',
    title: 'My Apartment in Miraflores',
    price: 65000,
    priceCurrency: 'USD',
    transactionType: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    location: 'Miraflores, La Paz',
    status: 'active',
    isFavorited: false,
  },
  {
    id: '5',
    title: 'Commercial Space Downtown',
    price: 1200,
    priceCurrency: 'USD',
    transactionType: 'rent',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    location: 'Centro, La Paz',
    status: 'archived',
    isFavorited: false,
  },
];

export default function MobileDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('favorites');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(SAMPLE_FAVORITES.map((p) => p.id))
  );

  // Get properties based on active tab
  const properties = activeTab === 'favorites' ? SAMPLE_FAVORITES : SAMPLE_LISTINGS;

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'anticretico') return p.transactionType === 'anticretico';
    return p.transactionType === activeFilter;
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

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'favorites':
        return 'Saved Properties';
      case 'listings':
        return 'My Listings';
      case 'messages':
        return 'Messages';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <DashboardHeader
        userName={USER.name}
        avatarUrl={USER.avatarUrl}
        notificationCount={2}
      />

      {/* Tabs */}
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={SAMPLE_FAVORITES.length}
        listingsCount={SAMPLE_LISTINGS.length}
      />

      {/* Filter Chips */}
      <div className="mt-2">
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Section Header */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{getSectionTitle()}</h2>
          <span className="text-sm text-blue-400">
            {filteredProperties.length} items
          </span>
        </div>
      </div>

      {/* Property List */}
      <div className="mt-4 space-y-4 px-4">
        {activeTab === 'messages' ? (
          // Messages placeholder
          <div className="py-12 text-center">
            <p className="text-gray-400">No messages yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Your conversations with agents will appear here
            </p>
          </div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <DashboardPropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              priceCurrency={property.priceCurrency}
              transactionType={property.transactionType}
              imageUrl={property.imageUrl}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              location={property.location}
              status={property.status}
              isFavorited={favorites.has(property.id)}
              hasPriceDropped={property.hasPriceDropped}
              isNewListing={property.isNewListing}
              onFavoriteClick={() => toggleFavorite(property.id)}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400">No properties found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <DashboardNavBar />
    </div>
  );
}
