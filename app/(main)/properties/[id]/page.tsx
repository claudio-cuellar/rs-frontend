import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyContactForm } from '@/components/property/PropertyContactForm';
import { FavoriteButton } from '@/components/property/FavoriteButton';
import { 
  MapPin, Bed, Bath, Square, Calendar, Car, Home as HomeIcon,
  Share2, Printer, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import type { Property, PropertyMedia, Category } from '@/types/database';

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch property
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single() as { data: Property | null; error: any };

  if (error || !property) {
    notFound();
  }

  // Fetch property media
  const { data: media } = await supabase
    .from('property_media')
    .select('*')
    .eq('property_id', id)
    .eq('is_visible', true)
    .order('sort_order') as { data: PropertyMedia[] | null };

  // Fetch categories with media
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order') as { data: Category[] | null };

  // Organize media by category
  const mediaByCategory = categories?.map((category) => ({
    ...category,
    media: media?.filter((m) => m.category_id === category.id) || [],
  })).filter((cat) => cat.media.length > 0);

  const primaryImage = media?.find((m) => m.is_primary) || media?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="border-b bg-white">
        <div className="container py-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <PropertyGallery 
        media={media || []} 
        propertyTitle={property.title}
      />

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      property.listing_type === 'sale'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getListingTypeLabel(property.listing_type)}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {property.title}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {[property.address_line1, property.city, property.state, property.postal_code]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price, property.price_currency)}
                    {property.listing_type === 'rent' && (
                      <span className="text-lg font-normal text-gray-500">/mo</span>
                    )}
                  </p>
                  {property.price_per_sqft && (
                    <p className="text-sm text-gray-500">
                      ${property.price_per_sqft.toFixed(0)}/sqft
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 flex flex-wrap gap-6 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-gray-500">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-gray-500">Bathrooms</span>
                </div>
                {property.living_area && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.living_area.toLocaleString()}</span>
                    <span className="text-gray-500">sqft</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.year_built}</span>
                    <span className="text-gray-500">Year Built</span>
                  </div>
                )}
                {property.garage_spaces > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.garage_spaces}</span>
                    <span className="text-gray-500">Garage</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">
                <FavoriteButton propertyId={property.id} />
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                <p className="mt-4 whitespace-pre-line text-gray-600">
                  {property.description}
                </p>
              </div>
            )}

            {/* Property Details */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Property Type</dt>
                  <dd className="font-medium text-gray-900">
                    {getPropertyTypeLabel(property.property_type)}
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Listing Type</dt>
                  <dd className="font-medium text-gray-900">
                    {getListingTypeLabel(property.listing_type)}
                  </dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Bedrooms</dt>
                  <dd className="font-medium text-gray-900">{property.bedrooms}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-gray-500">Bathrooms</dt>
                  <dd className="font-medium text-gray-900">{property.bathrooms}</dd>
                </div>
                {property.living_area && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Living Area</dt>
                    <dd className="font-medium text-gray-900">
                      {property.living_area.toLocaleString()} {property.living_area_unit}
                    </dd>
                  </div>
                )}
                {property.lot_size && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Lot Size</dt>
                    <dd className="font-medium text-gray-900">
                      {property.lot_size.toLocaleString()} {property.lot_size_unit}
                    </dd>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Year Built</dt>
                    <dd className="font-medium text-gray-900">{property.year_built}</dd>
                  </div>
                )}
                {property.stories > 0 && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Stories</dt>
                    <dd className="font-medium text-gray-900">{property.stories}</dd>
                  </div>
                )}
                {property.parking_spaces > 0 && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Parking Spaces</dt>
                    <dd className="font-medium text-gray-900">{property.parking_spaces}</dd>
                  </div>
                )}
                {property.garage_spaces > 0 && (
                  <div className="flex justify-between border-b pb-2">
                    <dt className="text-gray-500">Garage Spaces</dt>
                    <dd className="font-medium text-gray-900">{property.garage_spaces}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Photos by Category */}
            {mediaByCategory && mediaByCategory.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Photos by Room</h2>
                <div className="mt-6 space-y-8">
                  {mediaByCategory.map((category) => (
                    <div key={category.id}>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {category.media.map((item) => (
                          <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                            {item.public_url && (
                              <Image
                                src={item.public_url}
                                alt={item.title || category.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Form */}
              <PropertyContactForm property={property} />

              {/* Listing Info */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">Listing Information</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Listed</dt>
                    <dd className="text-gray-900">{formatDate(property.created_at)}</dd>
                  </div>
                  {property.published_at && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Published</dt>
                      <dd className="text-gray-900">{formatDate(property.published_at)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Views</dt>
                    <dd className="text-gray-900">{property.view_count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Saves</dt>
                    <dd className="text-gray-900">{property.favorite_count}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
