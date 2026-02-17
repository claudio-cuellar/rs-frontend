import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PropertyDetailHeader } from '@/components/mobile/PropertyDetailHeader';
import { ImageCarousel } from '@/components/mobile/ImageCarousel';
import { PropertyPriceSection } from '@/components/mobile/PropertyPriceSection';
import { PropertyStatsPills } from '@/components/mobile/PropertyStatsPills';
import { AnticreticoTermsCard } from '@/components/mobile/AnticreticoTermsCard';
import { AgentContactCard } from '@/components/mobile/AgentContactCard';
import { PropertyMap } from '@/components/mobile/PropertyMap';
import { TransitInfo } from '@/components/mobile/TransitInfo';
import { PropertyDescription } from '@/components/mobile/PropertyDescription';
import type { Property, TransactionType } from '@/types/database';

// Sample property data for demo
const SAMPLE_PROPERTY = {
  id: 'demo-1',
  title: 'Apartamento Moderno Sopocachi',
  description: 'Stunning modern apartment located in the heart of Sopocachi. Features panoramic views of the city and the Illimani. Recently renovated with top-tier finishes. The building offers 24/7 security, a community lounge, and easy access to the city\'s best restaurants and parks.',
  price: 185000,
  price_currency: 'USD',
  listing_type: 'sale' as TransactionType,
  property_type: 'apartment',
  bedrooms: 3,
  bathrooms: 2,
  living_area: 145,
  parking_spaces: 1,
  neighborhood: 'Sopocachi',
  city: 'La Paz',
  latitude: -16.5038,
  longitude: -68.1343,
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
  ],
  agent: {
    name: 'Alejandro Velasco',
    phone: '59171234567',
    isOnline: true,
  },
  hasAnticreticoTerms: true,
  transitStops: [
    {
      type: 'teleferico' as const,
      name: 'Teleférico Línea Amarilla',
      station: 'Estación Sopocachi',
      distance: '450m',
    },
    {
      type: 'bus' as const,
      name: 'PumaKatari Stop',
      station: 'Parada Plaza Abaroa',
      distance: '2 min walk',
    },
  ],
};

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MobilePropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Try to fetch real property data
  let property: typeof SAMPLE_PROPERTY | null = null;

  if (id !== 'demo-1') {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      // Fetch property media
      const { data: media } = await supabase
        .from('property_media')
        .select('public_url')
        .eq('property_id', id)
        .eq('media_type', 'image')
        .order('sort_order');

      const row = data as Property;
      const mediaUrls = (media as { public_url: string }[] | null)?.map((m) => m.public_url).filter(Boolean) as string[] | undefined;
      property = {
        ...SAMPLE_PROPERTY,
        ...row,
        description: row.description ?? SAMPLE_PROPERTY.description,
        living_area: row.living_area ?? SAMPLE_PROPERTY.living_area,
        latitude: row.latitude ?? SAMPLE_PROPERTY.latitude,
        longitude: row.longitude ?? SAMPLE_PROPERTY.longitude,
        neighborhood: row.neighborhood ?? SAMPLE_PROPERTY.neighborhood,
        city: row.city ?? SAMPLE_PROPERTY.city,
        images: mediaUrls?.length ? mediaUrls : SAMPLE_PROPERTY.images,
      };
    }
  }

  // Use sample property if no real data
  if (!property) {
    property = SAMPLE_PROPERTY;
  }

  const transactionType: TransactionType = property.hasAnticreticoTerms 
    ? 'anticretico' 
    : (property.listing_type as TransactionType) || 'sale';

  return (
    <div className="min-h-screen bg-slate-900 pb-8">
      {/* Header */}
      <PropertyDetailHeader title="Property Details" />

      {/* Image Carousel */}
      <ImageCarousel
        images={property.images}
        alt={property.title}
      />

      {/* Price Section */}
      <PropertyPriceSection
        price={property.price}
        priceCurrency={property.price_currency}
        transactionType={transactionType}
      />

      {/* Stats Pills */}
      <PropertyStatsPills
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        area={property.living_area}
        parkingSpaces={property.parking_spaces}
      />

      {/* Anticrético Terms (if applicable) */}
      {property.hasAnticreticoTerms && (
        <div className="mt-4">
          <AnticreticoTermsCard />
        </div>
      )}

      {/* Agent Contact Card */}
      <div className="mt-4">
        <AgentContactCard
          name={property.agent.name}
          phoneNumber={property.agent.phone}
          isOnline={property.agent.isOnline}
          propertyTitle={property.title}
        />
      </div>

      {/* Map */}
      <div className="mt-6">
        <PropertyMap
          latitude={property.latitude}
          longitude={property.longitude}
        />
      </div>

      {/* Transit Info */}
      {property.transitStops && property.transitStops.length > 0 && (
        <div className="mt-6">
          <TransitInfo stops={property.transitStops} />
        </div>
      )}

      {/* Description */}
      <div className="mt-6">
        <PropertyDescription description={property.description} />
      </div>
    </div>
  );
}
