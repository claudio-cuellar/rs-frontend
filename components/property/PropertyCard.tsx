'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';
import { TransactionBadgeSolid } from '@/components/ui/TransactionBadge';
import type { PropertyListItem, Property, TransactionType } from '@/types/database';

interface PropertyCardProps {
  property: PropertyListItem | Property;
  primaryImageUrl?: string | null;
  transactionType?: TransactionType;
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteClick?: () => void;
}

export function PropertyCard({
  property,
  primaryImageUrl,
  transactionType,
  showFavorite = true,
  isFavorited = false,
  onFavoriteClick,
}: PropertyCardProps) {
  const { formatPrice } = useCurrency();
  const imageUrl = primaryImageUrl || (property as PropertyListItem).primary_image_url;
  
  // Determine transaction type from listing_type if not provided
  const txType: TransactionType = transactionType || property.listing_type;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
              Sin Imagen
            </div>
          )}
          
          {/* Transaction Type Badge */}
          <div className="absolute left-3 top-3">
            <TransactionBadgeSolid type={txType} size="md" />
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoriteClick?.();
              }}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </button>
          )}

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-yellow-900">
                Destacado
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(property.price, property.price_currency)}
              {txType === 'rent' && (
                <span className="text-sm font-normal text-gray-500">/mes</span>
              )}
            </p>
          </div>

          {/* Title */}
          <h3 className="mt-1 truncate text-sm font-medium text-gray-900 group-hover:text-primary-600">
            {property.title}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {[['neighborhood' in property ? property.neighborhood : null, property.city].filter(Boolean).join(', '), property.city].filter(Boolean).join(', ') || 'La Paz'}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} hab</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} baño{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            {property.living_area && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.living_area.toLocaleString()} m²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
