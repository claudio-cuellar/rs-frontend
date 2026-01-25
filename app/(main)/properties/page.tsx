import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import type { ListingType, Property } from '@/types/database';

interface SearchParams {
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  city?: string;
  propertyType?: string;
  page?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  
  const page = parseInt(params.page || '1');
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  // Build query
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Apply filters
  if (params.type === 'sale' || params.type === 'rent') {
    query = query.eq('listing_type', params.type as ListingType);
  }

  if (params.minPrice) {
    query = query.gte('price', parseInt(params.minPrice));
  }

  if (params.maxPrice) {
    query = query.lte('price', parseInt(params.maxPrice));
  }

  if (params.bedrooms) {
    query = query.gte('bedrooms', parseInt(params.bedrooms));
  }

  if (params.bathrooms) {
    query = query.gte('bathrooms', parseInt(params.bathrooms));
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`);
  }

  if (params.propertyType) {
    query = query.eq('property_type', params.propertyType);
  }

  const { data: properties, count } = await query as { data: Property[] | null; count: number | null };

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {params.type === 'rent' ? 'Properties for Rent' : 
             params.type === 'sale' ? 'Properties for Sale' : 
             'All Properties'}
          </h1>
          <p className="mt-2 text-gray-600">
            {count || 0} properties found
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <PropertyFilters currentFilters={params} />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {properties && properties.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <a
                        key={pageNum}
                        href={`?${new URLSearchParams({
                          ...params,
                          page: pageNum.toString(),
                        }).toString()}`}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          pageNum === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg bg-white p-12 text-center">
                <p className="text-gray-500">No properties found matching your criteria.</p>
                <a href="/properties" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
                  Clear all filters
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
