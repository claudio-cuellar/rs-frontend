import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/property/PropertyCard';
import { HeroSearch } from '@/components/search/HeroSearch';
import { Home, Building, TrendingUp, Handshake } from 'lucide-react';
import type { Property } from '@/types/database';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured properties
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6) as { data: Property[] | null };

  // Fetch latest properties
  const { data: latestProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(8) as { data: Property[] | null };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Encuentra tu hogar ideal en{' '}
              <span className="text-yellow-300">La Paz</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100">
              Descubre miles de propiedades en venta, alquiler y anticrético. 
              Tu nuevo hogar está a solo una búsqueda de distancia.
            </p>
            
            {/* Hero Search */}
            <div className="mt-10">
              <HeroSearch />
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/properties?type=sale"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
                Comprar
              </Link>
              <Link
                href="/properties?type=rent"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Building className="h-4 w-4" />
                Alquilar
              </Link>
              <Link
                href="/properties?type=anticretico"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Handshake className="h-4 w-4" />
                Anticrético
              </Link>
              <Link
                href="/properties/new"
                className="flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900 transition-colors hover:bg-yellow-300"
              >
                <TrendingUp className="h-4 w-4" />
                Publicar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Propiedades Destacadas</h2>
                <p className="mt-1 text-gray-600">Seleccionadas especialmente para ti</p>
              </div>
              <Link
                href="/properties?featured=true"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ver todas →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Properties */}
      {latestProperties && latestProperties.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Últimos Anuncios</h2>
                <p className="mt-1 text-gray-600">Propiedades agregadas recientemente</p>
              </div>
              <Link
                href="/properties"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ver todas →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-2xl bg-primary-600 px-6 py-16 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold">¿Listo para encontrar tu hogar ideal?</h2>
            <p className="mt-4 text-lg text-primary-100">
              Crea una cuenta para guardar tus favoritos y recibir recomendaciones personalizadas.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 hover:bg-gray-50"
              >
                Registrarse Gratis
              </Link>
              <Link
                href="/search"
                className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explorar Propiedades
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
