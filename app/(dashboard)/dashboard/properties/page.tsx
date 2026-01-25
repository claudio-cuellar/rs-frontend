import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import { Plus, Edit, Eye, Trash2, MoreVertical } from 'lucide-react';
import type { Property, PropertyMedia } from '@/types/database';

export default async function DashboardPropertiesPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's properties with primary image
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: Property[] | null };

  // Get primary images for each property
  const propertyIds = properties?.map((p) => p.id) || [];
  const { data: mediaItems } = propertyIds.length > 0 
    ? await supabase
        .from('property_media')
        .select('*')
        .in('property_id', propertyIds)
        .eq('is_primary', true) as { data: PropertyMedia[] | null }
    : { data: null };

  const mediaByProperty = new Map(mediaItems?.map((m) => [m.property_id, m]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="mt-1 text-gray-600">
            Manage your property listings
          </p>
        </div>
        <Link
          href="/properties/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {/* Properties Table */}
      {properties && properties.length > 0 ? (
        <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {properties.map((property) => {
                  const primaryMedia = mediaByProperty.get(property.id);
                  return (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {primaryMedia?.public_url ? (
                              <Image
                                src={primaryMedia.public_url}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/properties/${property.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600"
                            >
                              {property.title}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {[property.city, property.state].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {getStatusLabel(property.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {formatPrice(property.price, property.price_currency)}
                        {property.listing_type === 'rent' && (
                          <span className="text-gray-500">/mo</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {property.view_count}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(property.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${property.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/properties/${property.id}/edit`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
          <p className="mt-2 text-gray-600">
            Get started by creating your first property listing.
          </p>
          <Link
            href="/properties/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Create Property
          </Link>
        </div>
      )}
    </div>
  );
}
