'use client';

import { createClient } from '@/lib/supabase/client';
import type { Database, Json, Property, PropertyMedia, ListingType } from '@/types/database';

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
    amenities: (data.amenities || []) as Json,
    features: (data.features || {}) as Json,
    status: data.status || 'draft',
  };

  const { data: property, error } = await supabase
    .from('properties')
    // @ts-expect-error Supabase client infers never for table ops when Database schema isn't fully inferred
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
    // @ts-expect-error Supabase client infers never for table ops when Database schema isn't fully inferred
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
    // @ts-expect-error Supabase client infers never for table ops when Database schema isn't fully inferred
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

// ============================================
// FAVORITES
// ============================================

export interface PropertyWithMedia extends Property {
  property_media: PropertyMedia[];
}

export async function getFavorites(): Promise<{
  data: PropertyWithMedia[] | null;
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
    .from('favorites')
    .select(`
      property_id,
      properties (
        *,
        property_media (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  // Extract properties from favorites
  const properties = data
    ?.map((f: any) => f.properties)
    .filter(Boolean) as PropertyWithMedia[];

  return { data: properties || [], error: null };
}

export async function addFavorite(propertyId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: new Error('User must be authenticated') };
  }

  const { error } = await supabase
    .from('favorites')
    // @ts-expect-error Supabase client infers never for table ops when Database schema isn't fully inferred
    .insert({
      user_id: user.id,
      property_id: propertyId,
    });

  if (error) {
    // Ignore duplicate key error
    if (error.code === '23505') {
      return { error: null };
    }
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function removeFavorite(propertyId: string): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: new Error('User must be authenticated') };
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('property_id', propertyId);

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}

export async function isFavorite(propertyId: string): Promise<{
  data: boolean;
  error: Error | null;
}> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: false, error: new Error('User must be authenticated') };
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { data: false, error: new Error(error.message) };
  }

  return { data: !!data, error: null };
}

// ============================================
// USER PROFILE
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export async function getCurrentUser(): Promise<{
  data: UserProfile | null;
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

  return {
    data: {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
      avatarUrl: user.user_metadata?.avatar_url,
    },
    error: null,
  };
}

// ============================================
// PROPERTY WITH MEDIA
// ============================================

export async function getMyPropertiesWithMedia(): Promise<{
  data: PropertyWithMedia[] | null;
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
    .select(`
      *,
      property_media (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as PropertyWithMedia[], error: null };
}
