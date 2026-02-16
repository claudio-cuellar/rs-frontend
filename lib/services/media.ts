'use client';

import { createClient } from '@/lib/supabase/client';
import type { PropertyMedia, MediaType } from '@/types/database';

const STORAGE_BUCKET = 'property-media';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalFilename.split('.').pop() || 'jpg';
  return `${timestamp}-${random}.${ext}`;
}

function getMediaTypeFolder(mediaType: MediaType): string {
  switch (mediaType) {
    case 'image':
      return 'images';
    case 'video':
      return 'videos';
    case 'floor_plan':
      return 'floor_plans';
    case 'virtual_tour':
      return 'virtual_tours';
    case 'document':
      return 'documents';
    default:
      return 'other';
  }
}

function validateFile(
  file: File,
  mediaType: MediaType
): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }

  let allowedTypes: string[];
  switch (mediaType) {
    case 'image':
    case 'floor_plan':
      allowedTypes = ALLOWED_IMAGE_TYPES;
      break;
    case 'video':
    case 'virtual_tour':
      allowedTypes = ALLOWED_VIDEO_TYPES;
      break;
    case 'document':
      allowedTypes = ALLOWED_DOCUMENT_TYPES;
      break;
    default:
      allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  return { valid: true };
}

export interface UploadPropertyMediaData {
  propertyId: string;
  mediaType?: MediaType;
  title?: string;
  description?: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export async function uploadPropertyMedia(
  file: File,
  data: UploadPropertyMediaData
): Promise<{ data: PropertyMedia | null; error: Error | null }> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: new Error('User must be authenticated to upload media') };
  }

  const mediaType = data.mediaType || 'image';

  // Validate file
  const validation = validateFile(file, mediaType);
  if (!validation.valid) {
    return { data: null, error: new Error(validation.error) };
  }

  // Generate storage path
  const folder = getMediaTypeFolder(mediaType);
  const filename = generateUniqueFilename(file.name);
  const storagePath = `${user.id}/${data.propertyId}/${folder}/${filename}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: new Error(`Upload failed: ${uploadError.message}`) };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  // If this is set as primary, unset other primary images
  if (data.isPrimary) {
    await supabase
      .from('property_media')
      .update({ is_primary: false })
      .eq('property_id', data.propertyId)
      .eq('media_type', mediaType);
  }

  // Create database record
  const { data: media, error: dbError } = await supabase
    .from('property_media')
    .insert({
      property_id: data.propertyId,
      media_type: mediaType,
      storage_bucket: STORAGE_BUCKET,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      filename: filename,
      original_filename: file.name,
      mime_type: file.type,
      file_size: file.size,
      title: data.title || null,
      description: data.description || null,
      alt_text: data.altText || null,
      is_primary: data.isPrimary || false,
      sort_order: data.sortOrder || 0,
      processing_status: 'completed',
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup uploaded file if database insert fails
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return { data: null, error: new Error(`Database error: ${dbError.message}`) };
  }

  return { data: media, error: null };
}

export async function deletePropertyMedia(
  mediaId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();

  // Get media record to find storage path
  const { data: media, error: fetchError } = await supabase
    .from('property_media')
    .select('storage_path')
    .eq('id', mediaId)
    .single();

  if (fetchError || !media) {
    return { error: new Error('Media not found') };
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([media.storage_path]);

  if (storageError) {
    console.error('Storage deletion error:', storageError);
    // Continue to delete database record even if storage deletion fails
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from('property_media')
    .delete()
    .eq('id', mediaId);

  if (dbError) {
    return { error: new Error(`Database error: ${dbError.message}`) };
  }

  return { error: null };
}

export async function getPropertyMedia(
  propertyId: string
): Promise<{ data: PropertyMedia[] | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('property_media')
    .select('*')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: true });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

export async function setPrimaryMedia(
  mediaId: string,
  propertyId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();

  // Unset all primary
  await supabase
    .from('property_media')
    .update({ is_primary: false })
    .eq('property_id', propertyId)
    .eq('media_type', 'image');

  // Set new primary
  const { error } = await supabase
    .from('property_media')
    .update({ is_primary: true })
    .eq('id', mediaId);

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}
