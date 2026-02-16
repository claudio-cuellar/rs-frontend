'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FormHeader,
  FormProgressBar,
  FormSelect,
  ListingTypeTabs,
  LocationPicker,
  PhotoUploader,
  FormFooter,
  type PhotoItem,
} from '@/components/mobile/form';
import type { ListingType } from '@/types/database';
import { createProperty, publishProperty } from '@/lib/services/properties';
import { uploadPropertyMedia } from '@/lib/services/media';
import { createClient } from '@/lib/supabase/client';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Condominio' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
];

const TERM_OPTIONS = [
  { value: '1', label: '1 Año' },
  { value: '2', label: '2 Años' },
  { value: '3', label: '3 Años' },
  { value: '5', label: '5 Años' },
];

interface FormData {
  propertyType: string;
  listingType: ListingType;
  latitude: number;
  longitude: number;
  neighborhood: string;
  fixedTerm: string;
  voluntaryTerm: string;
  photos: PhotoItem[];
  title: string;
  description: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  parkingSpaces: number;
  amenities: string[];
}

const TOTAL_STEPS = 4;

export default function ListPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<FormData>({
    propertyType: 'apartment',
    listingType: 'sale',
    latitude: -16.5,
    longitude: -68.15,
    neighborhood: '',
    fixedTerm: '1',
    voluntaryTerm: '1',
    photos: [],
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    bedrooms: 0,
    bathrooms: 0,
    livingArea: 0,
    parkingSpaces: 0,
    amenities: [],
  });

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, []);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleSave = async () => {
    // Save as draft
    setIsLoading(true);
    setError(null);

    try {
      const { data: property, error: createError } = await createProperty({
        title: formData.title || 'Propiedad sin título',
        description: formData.description,
        listing_type: formData.listingType,
        property_type: formData.propertyType,
        price: formData.price,
        price_currency: formData.currency,
        neighborhood: formData.neighborhood,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: 'La Paz',
        state: 'La Paz',
        country: 'Bolivia',
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        living_area: formData.livingArea,
        living_area_unit: 'sqm',
        parking_spaces: formData.parkingSpaces,
        status: 'draft',
      });

      if (createError) {
        throw createError;
      }

      // Upload photos if any
      if (property && formData.photos.length > 0) {
        await uploadPhotos(property.id);
      }

      router.push('/m/dashboard?saved=draft');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar borrador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.propertyType && !!formData.listingType;
      case 2:
        return !!formData.title && formData.price > 0;
      case 3:
        return true; // Features are optional
      case 4:
        return true; // Review step
      default:
        return true;
    }
  };

  const uploadPhotos = async (propertyId: string) => {
    const photosToUpload = formData.photos.filter((p) => p.file && !p.uploadedUrl);
    
    for (let i = 0; i < photosToUpload.length; i++) {
      const photo = photosToUpload[i];
      if (!photo.file) continue;

      // Update photo status to uploading
      const photoIndex = formData.photos.findIndex((p) => p === photo);
      const updatedPhotos = [...formData.photos];
      updatedPhotos[photoIndex] = { ...photo, isUploading: true };
      setFormData((prev) => ({ ...prev, photos: updatedPhotos }));

      try {
        const { data: media, error: uploadError } = await uploadPropertyMedia(photo.file, {
          propertyId,
          mediaType: 'image',
          isPrimary: i === 0,
          sortOrder: i,
          altText: `${formData.title} - Foto ${i + 1}`,
        });

        if (uploadError) {
          throw uploadError;
        }

        // Update photo with uploaded URL
        const finalPhotos = [...formData.photos];
        finalPhotos[photoIndex] = {
          ...photo,
          isUploading: false,
          uploadedUrl: media?.public_url || undefined,
        };
        setFormData((prev) => ({ ...prev, photos: finalPhotos }));
      } catch (err) {
        // Mark photo as having error
        const errorPhotos = [...formData.photos];
        errorPhotos[photoIndex] = {
          ...photo,
          isUploading: false,
          error: err instanceof Error ? err.message : 'Error al subir',
        };
        setFormData((prev) => ({ ...prev, photos: errorPhotos }));
        console.error('Error al subir foto:', err);
      }
    }
  };

  const handleContinue = async () => {
    if (!validateStep(currentStep)) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    } else {
      // Submit form
      setIsLoading(true);
      setError(null);

      try {
        // Create property
        const { data: property, error: createError } = await createProperty({
          title: formData.title,
          description: formData.description,
          listing_type: formData.listingType,
          property_type: formData.propertyType,
          price: formData.price,
          price_currency: formData.currency,
          neighborhood: formData.neighborhood,
          latitude: formData.latitude,
          longitude: formData.longitude,
          city: 'La Paz',
          state: 'La Paz',
          country: 'Bolivia',
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          living_area: formData.livingArea,
          living_area_unit: 'sqm',
          parking_spaces: formData.parkingSpaces,
          amenities: formData.amenities,
          status: 'draft',
        });

        if (createError) {
          throw createError;
        }

        if (!property) {
          throw new Error('Error al crear la propiedad');
        }

        // Upload photos
        if (formData.photos.length > 0) {
          await uploadPhotos(property.id);
        }

        // Publish property
        const { error: publishError } = await publishProperty(property.id);
        if (publishError) {
          throw publishError;
        }

        router.push('/m/dashboard?success=listed');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al publicar el anuncio');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show login prompt if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Iniciar Sesión Requerido</h2>
          <p className="mt-2 text-gray-400">
            Necesitas iniciar sesión para publicar una propiedad.
          </p>
          <button
            onClick={() => router.push('/login?redirect=/m/list')}
            className="mt-4 rounded-full bg-blue-500 px-6 py-2.5 font-semibold text-white hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <FormHeader title="Publicar Propiedad" onSave={handleSave} />

      {/* Progress Bar */}
      <FormProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form Content */}
      <div className="px-4 py-4">
        {currentStep === 1 && (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 2 && (
          <Step2Details formData={formData} updateFormData={updateFormData} />
        )}

        {currentStep === 3 && (
          <Step3Features formData={formData} updateFormData={updateFormData} />
        )}

        {currentStep === 4 && <Step4Review formData={formData} />}
      </div>

      {/* Footer */}
      <FormFooter
        onBack={handleBack}
        onContinue={handleContinue}
        showBack={currentStep > 1}
        continueLabel={currentStep === TOTAL_STEPS ? 'Publicar Anuncio' : 'Continuar'}
        isLoading={isLoading}
      />
    </div>
  );
}

// Step 1: Basic Information
function Step1BasicInfo({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Información Básica</h2>
        <p className="mt-1 text-sm text-gray-400">
          Comienza con los datos esenciales de tu anuncio.
        </p>
      </div>

      {/* Property Type */}
      <FormSelect
        label="Tipo de Propiedad"
        value={formData.propertyType}
        options={PROPERTY_TYPES}
        onChange={(value) => updateFormData({ propertyType: value })}
      />

      {/* Listing Type */}
      <ListingTypeTabs
        value={formData.listingType}
        onChange={(value) => updateFormData({ listingType: value })}
      />

      {/* Location */}
      <LocationPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        neighborhood={formData.neighborhood}
        onLocationChange={(lat, lng) =>
          updateFormData({ latitude: lat, longitude: lng })
        }
        onNeighborhoodChange={(neighborhood) => updateFormData({ neighborhood })}
      />

      {/* Anticrético Terms - shown when listing type is rent */}
      {formData.listingType === 'rent' && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            Términos de Anticrético (Opcional)
          </h3>
          <p className="mb-3 text-sm text-gray-400">
            Completa estos campos si es un anuncio de Anticrético.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="PLAZO FIJO"
              value={formData.fixedTerm}
              options={[{ value: '', label: 'No es Anticrético' }, ...TERM_OPTIONS]}
              onChange={(value) => updateFormData({ fixedTerm: value })}
            />
            <FormSelect
              label="PLAZO VOLUNTARIO"
              value={formData.voluntaryTerm}
              options={TERM_OPTIONS}
              onChange={(value) => updateFormData({ voluntaryTerm: value })}
            />
          </div>
        </div>
      )}

      {/* Photos */}
      <PhotoUploader
        photos={formData.photos}
        onPhotosChange={(photos) => updateFormData({ photos })}
      />
    </div>
  );
}

// Step 2: Property Details
function Step2Details({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Detalles de la Propiedad</h2>
        <p className="mt-1 text-sm text-gray-400">
          Cuéntanos más sobre tu propiedad.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Ej: Departamento Moderno en Sopocachi"
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe tu propiedad..."
          rows={4}
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Precio <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) =>
              updateFormData({ price: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FormSelect
          label="Moneda"
          value={formData.currency}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'BOB', label: 'BOB (Bs.)' },
          ]}
          onChange={(value) => updateFormData({ currency: value })}
        />
      </div>
    </div>
  );
}

// Step 3: Features
function Step3Features({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Características</h2>
        <p className="mt-1 text-sm text-gray-400">
          Agrega los detalles que los compradores quieren saber.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Dormitorios
          </label>
          <input
            type="number"
            min="0"
            value={formData.bedrooms || ''}
            onChange={(e) =>
              updateFormData({ bedrooms: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Baños
          </label>
          <input
            type="number"
            min="0"
            value={formData.bathrooms || ''}
            onChange={(e) =>
              updateFormData({ bathrooms: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Área (m²)
          </label>
          <input
            type="number"
            min="0"
            value={formData.livingArea || ''}
            onChange={(e) =>
              updateFormData({ livingArea: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Estacionamientos
          </label>
          <input
            type="number"
            min="0"
            value={formData.parkingSpaces || ''}
            onChange={(e) =>
              updateFormData({ parkingSpaces: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4: Review
function Step4Review({ formData }: { formData: FormData }) {
  const propertyTypeLabels: Record<string, string> = {
    apartment: 'Departamento',
    house: 'Casa',
    condo: 'Condominio',
    land: 'Terreno',
    commercial: 'Comercial',
    office: 'Oficina',
  };

  const listingTypeLabels: Record<string, string> = {
    sale: 'Venta',
    rent: 'Alquiler',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Revisar tu Anuncio</h2>
        <p className="mt-1 text-sm text-gray-400">
          Asegúrate de que todo esté correcto antes de publicar.
        </p>
      </div>

      {/* Summary Card */}
      <div className="space-y-4 rounded-xl bg-slate-800 p-4">
        {/* Photos Preview */}
        {formData.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {formData.photos.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg"
              >
                <img
                  src={photo.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {formData.photos.length > 4 && (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sm text-gray-400">
                +{formData.photos.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Title & Price */}
        <div>
          <h3 className="font-semibold text-white">
            {formData.title || 'Propiedad sin título'}
          </h3>
          <p className="text-xl font-bold text-blue-400">
            {formData.currency === 'USD' ? '$' : 'Bs.'}{' '}
            {formData.price.toLocaleString()}
            {formData.listingType === 'rent' && !formData.fixedTerm && (
              <span className="text-sm font-normal text-gray-400"> /mes</span>
            )}
          </p>
        </div>

        {/* Location */}
        <div className="text-sm text-gray-400">
          {formData.neighborhood || 'Ubicación no establecida'}, La Paz
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{formData.bedrooms} dormitorios</span>
          <span>{formData.bathrooms} baños</span>
          <span>{formData.livingArea} m²</span>
          {formData.parkingSpaces > 0 && (
            <span>{formData.parkingSpaces} estac.</span>
          )}
        </div>

        {/* Type Badges */}
        <div className="flex gap-2">
          <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-white">
            {propertyTypeLabels[formData.propertyType] || formData.propertyType}
          </span>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
            {formData.listingType === 'rent' && formData.fixedTerm
              ? 'Anticrético'
              : listingTypeLabels[formData.listingType] || formData.listingType}
          </span>
        </div>

        {/* Description Preview */}
        {formData.description && (
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm text-gray-400 line-clamp-3">
              {formData.description}
            </p>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Antes de publicar:</h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li className="flex items-center gap-2">
            <span
              className={
                formData.title
                  ? 'text-green-400'
                  : 'text-yellow-400'
              }
            >
              {formData.title ? '✓' : '○'}
            </span>
            Título establecido
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                formData.price > 0
                  ? 'text-green-400'
                  : 'text-yellow-400'
              }
            >
              {formData.price > 0 ? '✓' : '○'}
            </span>
            Precio establecido
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                formData.photos.length > 0
                  ? 'text-green-400'
                  : 'text-yellow-400'
              }
            >
              {formData.photos.length > 0 ? '✓' : '○'}
            </span>
            Al menos una foto agregada
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                formData.neighborhood
                  ? 'text-green-400'
                  : 'text-yellow-400'
              }
            >
              {formData.neighborhood ? '✓' : '○'}
            </span>
            Ubicación/barrio establecido
          </li>
        </ul>
      </div>
    </div>
  );
}
