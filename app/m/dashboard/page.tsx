'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DashboardHeader,
  DashboardTabs,
  DashboardTab,
  FilterChips,
  FilterType,
  DashboardPropertyCard,
  DashboardNavBar,
} from '@/components/mobile/dashboard';
import {
  getCurrentUser,
  getFavorites,
  getMyPropertiesWithMedia,
  addFavorite,
  removeFavorite,
  type UserProfile,
  type PropertyWithMedia,
} from '@/lib/services/properties';
import type { TransactionType, ListingType } from '@/types/database';

type PropertyStatus = 'active' | 'sold' | 'archived' | 'draft';

interface DashboardProperty {
  id: string;
  title: string;
  price: number;
  priceCurrency: string;
  transactionType: TransactionType;
  imageUrl?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  location: string;
  status: PropertyStatus;
  isNewListing?: boolean;
  createdAt: string;
}

// Map listing_type to TransactionType for display
function mapListingType(listingType: ListingType): TransactionType {
  return listingType === 'sale' ? 'sale' : 'rent';
}

// Map property status
function mapStatus(status: string): PropertyStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'sold':
      return 'sold';
    case 'rented':
      return 'sold';
    case 'archived':
      return 'archived';
    case 'draft':
      return 'draft';
    default:
      return 'active';
  }
}

// Check if property is new (created within last 7 days)
function isNewListing(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

// Transform property from DB to dashboard format
function transformProperty(property: PropertyWithMedia): DashboardProperty {
  const primaryImage = property.property_media?.find((m) => m.is_primary);
  const firstImage = property.property_media?.[0];
  
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    priceCurrency: property.price_currency,
    transactionType: mapListingType(property.listing_type),
    imageUrl: primaryImage?.public_url || firstImage?.public_url || undefined,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.living_area || undefined,
    location: property.neighborhood 
      ? `${property.neighborhood}, ${property.city || 'La Paz'}`
      : property.city || 'La Paz',
    status: mapStatus(property.status),
    isNewListing: isNewListing(property.created_at),
    createdAt: property.created_at,
  };
}

export default function MobileDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('favorites');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Data states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<DashboardProperty[]>([]);
  const [myListings, setMyListings] = useState<DashboardProperty[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // Get current user
        const { data: userData, error: userError } = await getCurrentUser();
        
        if (userError || !userData) {
          setIsAuthenticated(false);
          return;
        }
        
        setUser(userData);
        setIsAuthenticated(true);

        // Fetch favorites and listings in parallel
        const [favoritesResult, listingsResult] = await Promise.all([
          getFavorites(),
          getMyPropertiesWithMedia(),
        ]);

        if (favoritesResult.data) {
          const transformedFavorites = favoritesResult.data.map(transformProperty);
          setFavorites(transformedFavorites);
          setFavoriteIds(new Set(favoritesResult.data.map((p) => p.id)));
        }

        if (listingsResult.data) {
          setMyListings(listingsResult.data.map(transformProperty));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const isFav = favoriteIds.has(id);
    
    // Optimistic update
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isFav) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    // Update favorites list if removing
    if (isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    }

    try {
      if (isFav) {
        const { error } = await removeFavorite(id);
        if (error) throw error;
      } else {
        const { error } = await addFavorite(id);
        if (error) throw error;
      }
    } catch (err) {
      // Revert on error
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isFav) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
      console.error('Error toggling favorite:', err);
    }
  };

  // Get properties based on active tab
  const properties = activeTab === 'favorites' ? favorites : myListings;

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'anticretico') return p.transactionType === 'anticretico';
    return p.transactionType === activeFilter;
  });

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'favorites':
        return 'Propiedades Guardadas';
      case 'listings':
        return 'Mis Anuncios';
      case 'messages':
        return 'Mensajes';
      default:
        return '';
    }
  };

  // Show login prompt if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Iniciar Sesión Requerido</h2>
          <p className="mt-2 text-gray-400">
            Necesitas iniciar sesión para ver tu dashboard.
          </p>
          <button
            onClick={() => router.push('/login?redirect=/m/dashboard')}
            className="mt-4 rounded-full bg-blue-500 px-6 py-2.5 font-semibold text-white hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <DashboardHeader
        userName={user?.fullName || 'Usuario'}
        avatarUrl={user?.avatarUrl}
        notificationCount={0}
      />

      {/* Tabs */}
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
        listingsCount={myListings.length}
      />

      {/* Filter Chips */}
      <div className="mt-2">
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Section Header */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{getSectionTitle()}</h2>
          <span className="text-sm text-blue-400">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
          </span>
        </div>
      </div>

      {/* Property List */}
      <div className="mt-4 space-y-4 px-4">
        {activeTab === 'messages' ? (
          // Messages placeholder
          <div className="py-12 text-center">
            <p className="text-gray-400">Sin mensajes aún</p>
            <p className="mt-2 text-sm text-gray-500">
              Tus conversaciones con agentes aparecerán aquí
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
              isFavorited={favoriteIds.has(property.id)}
              isNewListing={property.isNewListing}
              onFavoriteClick={() => toggleFavorite(property.id)}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            {activeTab === 'favorites' ? (
              <>
                <p className="text-gray-400">No tienes propiedades guardadas</p>
                <p className="mt-2 text-sm text-gray-500">
                  Explora propiedades y guárdalas para verlas aquí
                </p>
                <button
                  onClick={() => router.push('/m/search')}
                  className="mt-4 rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Explorar Propiedades
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400">No tienes anuncios</p>
                <p className="mt-2 text-sm text-gray-500">
                  Publica tu primera propiedad
                </p>
                <button
                  onClick={() => router.push('/m/list')}
                  className="mt-4 rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Publicar Propiedad
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <DashboardNavBar />
    </div>
  );
}
