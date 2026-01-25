/**
 * Database types for Supabase
 *
 * Copy the auto-generated types from your backend:
 * cp ../rs-backend/src/types/database.ts ./types/database.ts
 *
 * Or generate fresh from Supabase:
 * npx supabase gen types typescript --project-id zrbvyjpepwibifpijvyg > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================
// ENUM TYPES
// ============================================

export type PropertyStatus = 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'archived';
export type ListingType = 'sale' | 'rent';
export type TransactionType = 'sale' | 'rent' | 'anticretico';
export type MediaType = 'image' | 'video' | 'floor_plan' | 'virtual_tour' | 'document';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ============================================
// DATABASE TYPE (for Supabase client)
// ============================================

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subcategories_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string | null;
          description: string | null;
          status: PropertyStatus;
          listing_type: ListingType;
          price: number;
          price_currency: string;
          price_per_sqft: number | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          neighborhood: string | null;
          latitude: number | null;
          longitude: number | null;
          mapbox_place_id: string | null;
          property_type: string;
          year_built: number | null;
          lot_size: number | null;
          lot_size_unit: string;
          living_area: number | null;
          living_area_unit: string;
          bedrooms: number;
          bathrooms: number;
          half_bathrooms: number;
          parking_spaces: number;
          garage_spaces: number;
          stories: number;
          amenities: Json;
          features: Json;
          algolia_object_id: string | null;
          algolia_synced_at: string | null;
          featured: boolean;
          verified: boolean;
          view_count: number;
          favorite_count: number;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug?: string | null;
          description?: string | null;
          status?: PropertyStatus;
          listing_type: ListingType;
          price: number;
          price_currency?: string;
          price_per_sqft?: number | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          neighborhood?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          mapbox_place_id?: string | null;
          property_type: string;
          year_built?: number | null;
          lot_size?: number | null;
          lot_size_unit?: string;
          living_area?: number | null;
          living_area_unit?: string;
          bedrooms?: number;
          bathrooms?: number;
          half_bathrooms?: number;
          parking_spaces?: number;
          garage_spaces?: number;
          stories?: number;
          amenities?: Json;
          features?: Json;
          algolia_object_id?: string | null;
          algolia_synced_at?: string | null;
          featured?: boolean;
          verified?: boolean;
          view_count?: number;
          favorite_count?: number;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          slug?: string | null;
          description?: string | null;
          status?: PropertyStatus;
          listing_type?: ListingType;
          price?: number;
          price_currency?: string;
          price_per_sqft?: number | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          neighborhood?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          mapbox_place_id?: string | null;
          property_type?: string;
          year_built?: number | null;
          lot_size?: number | null;
          lot_size_unit?: string;
          living_area?: number | null;
          living_area_unit?: string;
          bedrooms?: number;
          bathrooms?: number;
          half_bathrooms?: number;
          parking_spaces?: number;
          garage_spaces?: number;
          stories?: number;
          amenities?: Json;
          features?: Json;
          algolia_object_id?: string | null;
          algolia_synced_at?: string | null;
          featured?: boolean;
          verified?: boolean;
          view_count?: number;
          favorite_count?: number;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      property_media: {
        Row: {
          id: string;
          property_id: string;
          category_id: string | null;
          subcategory_id: string | null;
          media_type: MediaType;
          storage_bucket: string;
          storage_path: string;
          public_url: string | null;
          filename: string | null;
          original_filename: string | null;
          mime_type: string | null;
          file_size: number | null;
          width: number | null;
          height: number | null;
          duration: number | null;
          thumbnail_path: string | null;
          thumbnail_url: string | null;
          title: string | null;
          description: string | null;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          is_visible: boolean;
          processing_status: ProcessingStatus;
          processing_error: string | null;
          processed_at: string | null;
          exif_data: Json | null;
          tags: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          category_id?: string | null;
          subcategory_id?: string | null;
          media_type: MediaType;
          storage_bucket?: string;
          storage_path: string;
          public_url?: string | null;
          filename?: string | null;
          original_filename?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          thumbnail_path?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          description?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          is_visible?: boolean;
          processing_status?: ProcessingStatus;
          processing_error?: string | null;
          processed_at?: string | null;
          exif_data?: Json | null;
          tags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          category_id?: string | null;
          subcategory_id?: string | null;
          media_type?: MediaType;
          storage_bucket?: string;
          storage_path?: string;
          public_url?: string | null;
          filename?: string | null;
          original_filename?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          thumbnail_path?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          description?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          is_visible?: boolean;
          processing_status?: ProcessingStatus;
          processing_error?: string | null;
          processed_at?: string | null;
          exif_data?: Json | null;
          tags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'property_media_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_media_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      property_features: {
        Row: {
          id: string;
          property_id: string;
          category_id: string | null;
          feature_key: string;
          feature_value: string | null;
          feature_type: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          category_id?: string | null;
          feature_key: string;
          feature_value?: string | null;
          feature_type?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          category_id?: string | null;
          feature_key?: string;
          feature_value?: string | null;
          feature_type?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'property_features_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          }
        ];
      };
      property_views: {
        Row: {
          id: string;
          property_id: string;
          user_id: string | null;
          session_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          user_id?: string | null;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          user_id?: string | null;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'property_views_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          }
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_property_id_fkey';
            columns: ['property_id'];
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      property_status: PropertyStatus;
      listing_type: ListingType;
      media_type: MediaType;
      processing_status: ProcessingStatus;
    };
    CompositeTypes: {};
  };
};

// ============================================
// TYPE ALIASES
// ============================================

export type Category = Database['public']['Tables']['categories']['Row'];
export type Subcategory = Database['public']['Tables']['subcategories']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyMedia = Database['public']['Tables']['property_media']['Row'];
export type PropertyFeature = Database['public']['Tables']['property_features']['Row'];
export type PropertyView = Database['public']['Tables']['property_views']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];

// ============================================
// DISPLAY TYPES (for UI)
// ============================================

export interface PropertyListItem {
  id: string;
  title: string;
  slug: string | null;
  price: number;
  price_currency: string;
  listing_type: ListingType;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  living_area: number | null;
  living_area_unit: string;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  created_at: string;
  primary_image_url: string | null;
}

export interface PropertyWithMedia extends Property {
  primary_image: PropertyMedia | null;
  media: PropertyMedia[];
  media_by_category?: MediaByCategory[];
}

export interface MediaByCategory {
  category_id: string;
  category_slug: string;
  category_name: string;
  media: PropertyMedia[];
}

// ============================================
// ALGOLIA TYPES
// ============================================

export interface AlgoliaPropertyRecord {
  objectID: string;
  title: string;
  description: string | null;
  price: number;
  price_currency: string;
  listing_type: ListingType;
  property_type: string;
  _geoloc: {
    lat: number;
    lng: number;
  } | null;
  city: string | null;
  state: string | null;
  country: string;
  neighborhood: string | null;
  bedrooms: number;
  bathrooms: number;
  address: string;
  amenities: string[];
  primary_image_url: string | null;
  living_area: number | null;
  lot_size: number | null;
  year_built: number | null;
  featured: boolean;
  created_at: number;
  published_at: number | null;
}
