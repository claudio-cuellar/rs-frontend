'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { TransactionType, PropertyListItem, Property } from '@/types/database';

interface SearchPropertyCardProps {
  property: PropertyListItem | Property;
  primaryImageUrl?: string | null;
  transactionType?: TransactionType;
  propertyType?: string;
  isFavorited?: boolean;
  onFavoriteClick?: () => void;
  className?: string;
}

const transactionBadgeStyles: Record<TransactionType, string> = {
  rent: 'bg-green-500',
  sale: 'bg-blue-500',
  anticretico: 'bg-purple-500',
};

const transactionBadgeLabels: Record<TransactionType, string> = {
  rent: 'RENT',
  sale: 'FOR SALE',
  anticretico: 'ANTICRÉTICO',
};

const propertyTypeLabels: Record<string, string> = {
  apartment: 'APARTMENT',
  house: 'HOUSE',
  condo: 'CONDO',
  land: 'LAND',
  commercial: 'COMMERCIAL',
  office: 'OFFICE',
};

export function SearchPropertyCard({
  property,
  primaryImageUrl,
  transactionType,
  propertyType,
  isFavorited = false,
  onFavoriteClick,
  className,
}: SearchPropertyCardProps) {
  const { formatPrice } = useCurrency();
  const imageUrl = primaryImageUrl || (property as PropertyListItem).primary_image_url;
  const txType: TransactionType = transactionType || property.listing_type;
  const propType = propertyType || property.property_type;

  return (
    <Link
      href={`/m/property/${property.id}`}
      className={cn('block', className)}
    >
      <div className="overflow-hidden rounded-2xl bg-slate-800">
        {/* Image */}
        <div className="relative aspect-[4/3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-700 text-gray-500">
              Sin Imagen
            </div>
          )}

          {/* Transaction Badge */}
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                'rounded-md px-2.5 py-1 text-[10px] font-bold uppercase text-white',
                transactionBadgeStyles[txType]
              )}
            >
              {transactionBadgeLabels[txType]}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavoriteClick?.();
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-sm transition-colors hover:bg-slate-900/80"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price and Property Type */}
          <div className="flex items-start justify-between">
            <p className="text-xl font-bold text-blue-400">
              {formatPrice(property.price, property.price_currency)}
              {txType === 'rent' && (
                <span className="text-sm font-normal text-gray-400">/mo</span>
              )}
            </p>
            {propType && (
              <span className="rounded border border-slate-600 px-2 py-1 text-[10px] font-semibold uppercase text-gray-400">
                {propertyTypeLabels[propType] || propType.toUpperCase()}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-sm text-white">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>
              {['neighborhood' in property ? property.neighborhood : null, property.city].filter(Boolean).join(', ') || property.city || 'La Paz'}, La Paz
            </span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} bath</span>
            </div>
            {property.living_area && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4" />
                <span>{property.living_area}m²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
