'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { TransactionType } from '@/types/database';

type PropertyStatus = 'active' | 'sold' | 'archived' | 'new';

interface DashboardPropertyCardProps {
  id: string;
  title: string;
  price: number;
  priceCurrency: string;
  transactionType: TransactionType;
  propertyType?: string;
  imageUrl?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  location: string;
  status?: PropertyStatus;
  isFavorited?: boolean;
  hasPriceDropped?: boolean;
  isNewListing?: boolean;
  onFavoriteClick?: () => void;
  className?: string;
}

const transactionBadgeStyles: Record<TransactionType, string> = {
  sale: 'bg-slate-700 text-white',
  rent: 'bg-green-500 text-white',
  anticretico: 'bg-purple-500 text-white',
};

const transactionLabels: Record<TransactionType, string> = {
  sale: 'SALE',
  rent: 'RENT',
  anticretico: 'ANTICRÉTICO',
};

export function DashboardPropertyCard({
  id,
  title,
  price,
  priceCurrency,
  transactionType,
  imageUrl,
  bedrooms,
  bathrooms,
  area,
  location,
  status = 'active',
  isFavorited = false,
  hasPriceDropped = false,
  isNewListing = false,
  onFavoriteClick,
  className,
}: DashboardPropertyCardProps) {
  const { formatPrice } = useCurrency();
  const isSold = status === 'sold';
  const isArchived = status === 'archived';

  return (
    <div className={cn('overflow-hidden rounded-2xl bg-slate-800', className)}>
      {/* Image */}
      <div className="relative aspect-[16/10]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={cn('object-cover', isSold && 'opacity-70')}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-700 text-gray-500">
            Sin Imagen
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {/* Transaction Type */}
          <span className={cn(
            'rounded-md px-2 py-1 text-[10px] font-bold uppercase',
            transactionBadgeStyles[transactionType]
          )}>
            {transactionLabels[transactionType]}
          </span>

          {/* Status Badges */}
          {isSold && (
            <span className="rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase text-white">
              SOLD
            </span>
          )}
          {hasPriceDropped && !isSold && (
            <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
              PRICE DROPPED
            </span>
          )}
          {isNewListing && !isSold && (
            <span className="rounded-md bg-green-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
              NEW LISTING
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteClick?.();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center"
        >
          <Heart
            className={cn(
              'h-6 w-6 transition-colors',
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'fill-white/30 text-white'
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className={cn(
          'text-xl font-bold',
          isSold ? 'text-gray-500 line-through' : 'text-blue-400'
        )}>
          {formatPrice(price, priceCurrency)}
          {transactionType === 'rent' && (
            <span className="text-sm font-normal text-gray-500"> /month</span>
          )}
        </p>

        {/* Title */}
        <h3 className="mt-1 font-semibold text-white">{title}</h3>

        {/* Stats */}
        <p className="mt-1 text-sm text-gray-400">
          {bedrooms} beds • {bathrooms} baths{area ? ` • ${area}m²` : ''}
        </p>

        {/* Location & Action */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {location}
          </div>

          {isArchived ? (
            <span className="rounded-full bg-slate-700 px-4 py-1.5 text-xs font-medium text-gray-400">
              Archived
            </span>
          ) : !isSold ? (
            <Link
              href={`/m/property/${id}`}
              className="rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
            >
              View Details
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
