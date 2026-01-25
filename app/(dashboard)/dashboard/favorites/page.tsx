import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import type { Property, Favorite } from '@/types/database';

type FavoriteWithProperty = Favorite & { properties: Property | null };

export default async function FavoritesPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's favorites with property data
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      user_id,
      property_id,
      properties (*)
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: FavoriteWithProperty[] | null };

  const properties = favorites?.map((f) => f.properties).filter(Boolean) as Property[] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
        <p className="mt-1 text-gray-600">
          Properties you&apos;ve saved for later
        </p>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property: any) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorited={true}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No saved properties</h3>
          <p className="mt-2 text-gray-600">
            Start browsing and save properties you&apos;re interested in.
          </p>
          <Link
            href="/search"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
}
