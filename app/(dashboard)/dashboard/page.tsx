import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Building, Eye, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Property } from '@/types/database';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's properties
  const { data: properties, count: propertyCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(4) as { data: Property[] | null; count: number | null };

  // Get total views for user's properties
  const { data: viewsData } = await supabase
    .from('properties')
    .select('view_count')
    .eq('user_id', user!.id) as { data: { view_count: number }[] | null };

  const totalViews = viewsData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

  // Get user's favorites count
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id);

  // Get active listings count
  const { count: activeCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('status', 'active');

  const stats = [
    {
      name: 'Total Properties',
      value: propertyCount || 0,
      icon: Building,
      href: '/dashboard/properties',
      color: 'bg-blue-500',
    },
    {
      name: 'Active Listings',
      value: activeCount || 0,
      icon: TrendingUp,
      href: '/dashboard/properties?status=active',
      color: 'bg-green-500',
    },
    {
      name: 'Total Views',
      value: totalViews,
      icon: Eye,
      href: '/dashboard/analytics',
      color: 'bg-purple-500',
    },
    {
      name: 'Saved Properties',
      value: favoritesCount || 0,
      icon: Heart,
      href: '/dashboard/favorites',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back! Here&apos;s an overview of your listings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Properties */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
          <Link
            href="/dashboard/properties"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>

        {properties && properties.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                showFavorite={false}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first property listing.
            </p>
            <Link
              href="/properties/new"
              className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Create Property
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            href="/properties/new"
            className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2">
                <Building className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">List a Property</p>
                <p className="text-sm text-gray-500">Create a new listing</p>
              </div>
            </div>
          </Link>
          <Link
            href="/search"
            className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Browse Listings</p>
                <p className="text-sm text-gray-500">Explore properties</p>
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/settings"
            className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Settings</p>
                <p className="text-sm text-gray-500">Manage your profile</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
