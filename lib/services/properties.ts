'use client';

import { createClient } from '@/lib/supabase/client';
import type { Database, Property, PropertyMedia, ListingType } from '@/types/database';

type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyMediaInsert = Database['public']['Tables']['property_media']['Insert'];

export interface CreatePropertyData {
  title: string;
  description?: string;
  listing_type: ListingType;
  property_type: string;
  price: number;
  price_currency: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  living_area?: number;
  living_area_unit?: string;
  parking_spaces?: number;
  amenities?: string[];
  features?: Record<string, unknown>;
  status?: 'draft' | 'active';
}

export async function createProperty(
  data: CreatePropertyData
): Promise<{ data: Property | null; error: Error | null }> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: new Error('User must be authenticated to create a property') };
  }

  const propertyData: PropertyInsert = {
    user_id: user.id,
    title: data.title,
    description: data.description || null,
    listing_type: data.listing_type,
    property_type: data.property_type,
    price: data.price,
    price_currency: data.price_currency || 'USD',
    neighborhood: data.neighborhood || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    city: data.city || 'La Paz',
    state: data.state || 'La Paz',
    country: data.country || 'Bolivia',
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    living_area: data.living_area || null,
    living_area_unit: data.living_area_unit || 'sqm',
    parking_spaces: data.parking_spaces || 0,
    amenities: data.amenities || [],
    features: data.features || {},
    status: data.status || 'draft',
  };

  const { data: property, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: property, error: null };
}

export async function updateProperty(
  id: string,
  data: Partial<CreatePropertyData>
): Promise<{ data: Property | null; error: Error | null }> {
  const supabase = createClient();

  const { data: property, error } = await supabase
    .from('properties')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: property, error: null };
}

export async function publishProperty(
  id: string
): Promise<{ data: Property | null; error: Error | null }> {
  const supabase = createClient();

  const { data: property, error } = await supabase
    .from('properties')
    .update({
      status: 'active',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: property, error: null };
}

export async function getMyProperties(): Promise<{
  data: Property[] | null;
  error: Error | null;
}> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: new Error('User must be authenticated') };
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}
