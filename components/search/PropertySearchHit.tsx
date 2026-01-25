'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from 'react-instantsearch';
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { AlgoliaPropertyRecord } from '@/types/database';

interface PropertySearchHitProps {
  hit: AlgoliaPropertyRecord;
}

export function PropertySearchHit({ hit }: PropertySearchHitProps) {
  return (
    <Link href={`/properties/${hit.objectID}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {hit.primary_image_url ? (
            <Image
              src={hit.primary_image_url}
              alt={hit.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}

          {/* Listing Type Badge */}
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                hit.listing_type === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              )}
            >
              {hit.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorite toggle
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart className="h-5 w-5 text-gray-600" />
          </button>

          {/* Featured Badge */}
          {hit.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-yellow-900">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(hit.price, hit.price_currency)}
            {hit.listing_type === 'rent' && (
              <span className="text-sm font-normal text-gray-500">/mo</span>
            )}
          </p>

          {/* Title - with highlight */}
          <h3 className="mt-1 truncate text-sm font-medium text-gray-900 group-hover:text-primary-600">
            <Highlight attribute="title" hit={hit as any} />
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              <Highlight attribute="city" hit={hit as any} />
              {hit.city && hit.state && ', '}
              <Highlight attribute="state" hit={hit as any} />
            </span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{hit.bedrooms} bd</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{hit.bathrooms} ba</span>
            </div>
            {hit.living_area && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{hit.living_area.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
