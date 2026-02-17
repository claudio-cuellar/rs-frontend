'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { TransactionType, PropertyListItem, Property } from '@/types/database';

interface FeaturedPropertyCardProps {
  property: PropertyListItem | Property;
  primaryImageUrl?: string | null;
  transactionType?: TransactionType;
  isFeatured?: boolean;
  className?: string;
}

const badgeStyles: Record<TransactionType, string> = {
  rent: 'bg-green-500',
  sale: 'bg-blue-500',
  anticretico: 'bg-purple-500',
};

const badgeLabels: Record<TransactionType, string> = {
  rent: 'ALQUILER',
  sale: 'VENTA',
  anticretico: 'ANTICRÉTICO',
};

export function FeaturedPropertyCard({
  property,
  primaryImageUrl,
  transactionType,
  isFeatured = false,
  className,
}: FeaturedPropertyCardProps) {
  const { formatPrice } = useCurrency();
  const imageUrl = primaryImageUrl || (property as PropertyListItem).primary_image_url;
  const txType: TransactionType = transactionType || property.listing_type;

  return (
    <Link
      href={`/m/property/${property.id}`}
      className={cn(
        'block w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="260px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-700 text-gray-500">
            Sin Imagen
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isFeatured && (
            <span className="rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
              Destacado
            </span>
          )}
          <span
            className={cn(
              'rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white',
              badgeStyles[txType]
            )}
          >
            {badgeLabels[txType]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="truncate text-sm font-semibold text-white">
          {property.title}
        </h3>

        {/* Location */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="truncate">
            {property.address_line1 || ['neighborhood' in property ? property.neighborhood : null, property.city].filter(Boolean).join(', ') || 'La Paz'}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            <span>{property.bathrooms}</span>
          </div>
          {property.living_area && (
            <div className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5" />
              <span>{property.living_area}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <p className="mt-2 text-base font-bold text-blue-400">
          {formatPrice(property.price, property.price_currency)}
          {txType === 'rent' && <span className="text-xs font-normal text-gray-500">/mes</span>}
        </p>
      </div>
    </Link>
  );
}
