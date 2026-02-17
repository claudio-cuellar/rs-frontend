import { createClient } from '@/lib/supabase/server';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MobileHeroSearch } from '@/components/mobile/MobileHeroSearch';
import { FeaturedPropertyCard } from '@/components/mobile/FeaturedPropertyCard';
import { NeighborhoodCard } from '@/components/mobile/NeighborhoodCard';
import { InfoCard } from '@/components/mobile/InfoCard';
import { SectionHeader } from '@/components/mobile/SectionHeader';
import type { Property, TransactionType } from '@/types/database';

// Popular neighborhoods data
const POPULAR_NEIGHBORHOODS = [
  { name: 'Sopocachi', propertyCount: 124 },
  { name: 'Calacoto', propertyCount: 89 },
  { name: 'Achumani', propertyCount: 56 },
  { name: 'San Pedro', propertyCount: 42 },
];

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

  // Fetch latest properties for the carousel
  const { data: latestProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10) as { data: Property[] | null };

  const displayProperties = featuredProperties?.length 
    ? featuredProperties 
    : latestProperties;

  // Helper to determine transaction type for demo
  const getTransactionType = (index: number): TransactionType => {
    const types: TransactionType[] = ['sale', 'rent', 'anticretico'];
    return types[index % 3];
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <MobileHeader variant="dark" />

      {/* Hero Search */}
      <MobileHeroSearch />

      {/* Featured Properties Section */}
      <section className="mt-6 px-4">
        <SectionHeader
          title="Propiedades Destacadas"
          href="/search?featured=true"
        />

        {/* Horizontal Scroll */}
        <div className="mt-4 -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {displayProperties && displayProperties.length > 0 ? (
              displayProperties.map((property, index) => (
                <FeaturedPropertyCard
                  key={property.id}
                  property={property}
                  isFeatured={property.featured}
                  transactionType={getTransactionType(index)}
                />
              ))
            ) : (
              // Placeholder cards when no data
              <>
                <PlaceholderPropertyCard title="Apartamento Moderno - Sopocachi" address="Edificio Sky, Calle Presbítero" beds={3} baths={2} area={120} />
                <PlaceholderPropertyCard title="Casa Residencial" address="Calle 15, Calacoto" beds={4} baths={3} area={250} isAnticretico />
                <PlaceholderPropertyCard title="Departamento Vista" address="Av. Ballivián" beds={2} baths={1} area={85} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Popular Neighborhoods Section */}
      <section className="mt-8 px-4">
        <SectionHeader title="Barrios Populares" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          {POPULAR_NEIGHBORHOODS.map((neighborhood) => (
            <NeighborhoodCard
              key={neighborhood.name}
              name={neighborhood.name}
              propertyCount={neighborhood.propertyCount}
            />
          ))}
        </div>
      </section>

      {/* Info Card - Anticrético Explanation */}
      <section className="mt-8 px-4 pb-8">
        <InfoCard
          variant="info"
          title="¿Qué es el Anticrético?"
          description="Es una modalidad única en Bolivia donde entregas una suma de dinero a cambio de vivir en un inmueble sin pagar alquiler. El dueño devuelve el dinero al finalizar el contrato."
        />
      </section>
    </div>
  );
}

// Placeholder card with sample data
function PlaceholderPropertyCard({ 
  title, 
  address, 
  beds, 
  baths, 
  area,
  isAnticretico = false 
}: { 
  title: string;
  address: string;
  beds: number;
  baths: number;
  area: number;
  isAnticretico?: boolean;
}) {
  return (
    <div className="w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800">
      {/* Image placeholder with gradient */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700">
        {/* Badge */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span className="rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
            Destacado
          </span>
          <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white ${isAnticretico ? 'bg-purple-500' : 'bg-blue-500'}`}>
            {isAnticretico ? 'Anticrético' : 'Venta'}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{address}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {beds}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            {baths}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {area}m²
          </span>
        </div>
        <p className="mt-2 text-base font-bold text-blue-400">
          Bs. {(area * 800).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
