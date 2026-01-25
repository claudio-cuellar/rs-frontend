'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Home, 
  MapPin, 
  Camera,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { TransactionType } from '@/types/database';

// La Paz neighborhoods
const NEIGHBORHOODS = [
  'Sopocachi',
  'Calacoto',
  'San Miguel',
  'Obrajes',
  'Achumani',
  'Irpavi',
  'Cota Cota',
  'Miraflores',
  'San Pedro',
  'Centro',
  'Zona Sur',
  'Mallasa',
  'Chasquipampa',
  'Bolognia',
  'Seguencoma',
];

const PROPERTY_TYPES = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
];

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
];

// Form schemas for each step
const infoSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  transactionType: z.enum(['sale', 'rent', 'anticretico']),
  propertyType: z.string().min(1, 'Selecciona un tipo de propiedad'),
  price: z.number().min(1, 'Ingresa un precio válido'),
  currency: z.enum(['BOB', 'USD']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  livingArea: z.number().min(1, 'Ingresa el área de la propiedad'),
  parkingSpaces: z.number().min(0),
});

const locationSchema = z.object({
  neighborhood: z.string().min(1, 'Selecciona un barrio'),
  address: z.string().min(5, 'Ingresa una dirección válida'),
  city: z.string().default('La Paz'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const photosSchema = z.object({
  images: z.array(z.string()).min(1, 'Sube al menos una foto'),
});

const fullSchema = infoSchema.merge(locationSchema).merge(photosSchema);

type FormData = z.infer<typeof fullSchema>;

const STEPS = [
  { id: 'info', title: 'Información', icon: Home },
  { id: 'location', title: 'Ubicación', icon: MapPin },
  { id: 'photos', title: 'Fotos', icon: Camera },
];

interface StepProps {
  form: UseFormReturn<FormData>;
  onNext: () => void;
  onBack: () => void;
}

// Step 1: Property Information
function InfoStep({ form, onNext }: StepProps) {
  const { register, formState: { errors }, watch } = form;
  const transactionType = watch('transactionType');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Operación
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map((type) => (
            <label
              key={type.value}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors',
                transactionType === type.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                {...register('transactionType')}
                value={type.value}
                className="sr-only"
              />
              <span className="font-medium">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Propiedad
        </label>
        <select
          {...register('propertyType')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Selecciona...</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título del Anuncio
        </label>
        <input
          type="text"
          {...register('title')}
          placeholder="Ej: Hermoso departamento en Sopocachi con vista a Illimani"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe las características principales de tu propiedad..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moneda
          </label>
          <select
            {...register('currency')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="BOB">Bolivianos (Bs.)</option>
            <option value="USD">Dólares ($)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habitaciones
          </label>
          <input
            type="number"
            {...register('bedrooms', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baños
          </label>
          <input
            type="number"
            {...register('bathrooms', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área (m²)
          </label>
          <input
            type="number"
            {...register('livingArea', { valueAsNumber: true })}
            min="1"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.livingArea && (
            <p className="mt-1 text-sm text-red-600">{errors.livingArea.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parqueos
          </label>
          <input
            type="number"
            {...register('parkingSpaces', { valueAsNumber: true })}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700"
        >
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Step 2: Location
function LocationStep({ form, onNext, onBack }: StepProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const neighborhood = watch('neighborhood');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Barrio / Zona
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NEIGHBORHOODS.map((n) => (
            <label
              key={n}
              className={cn(
                'flex items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-colors text-sm',
                neighborhood === n
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                {...register('neighborhood')}
                value={n}
                className="sr-only"
              />
              {n}
            </label>
          ))}
        </div>
        {errors.neighborhood && (
          <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección
        </label>
        <input
          type="text"
          {...register('address')}
          placeholder="Ej: Av. 6 de Agosto #2450"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ciudad
        </label>
        <input
          type="text"
          {...register('city')}
          defaultValue="La Paz"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50"
          readOnly
        />
      </div>

      {/* Map placeholder - would integrate Mapbox here */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Haz clic en el mapa para marcar la ubicación exacta
        </p>
        <p className="text-xs text-gray-400 mt-1">
          (Integración de Mapbox próximamente)
        </p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700"
        >
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Step 3: Photos
function PhotosStep({ form, onBack }: StepProps & { isSubmitting: boolean }) {
  const { watch, setValue, formState: { errors } } = form;
  const images = watch('images') || [];
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    
    // For now, create object URLs (in production, upload to Supabase Storage)
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setValue('images', [...images, ...newImages]);
    
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos de la Propiedad
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Sube al menos 1 foto. Las imágenes de buena calidad ayudan a vender más rápido.
        </p>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="sr-only"
          />
          {uploading ? (
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm font-medium text-gray-700">
            Haz clic para subir fotos
          </p>
          <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
        </label>
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        <button
          type="submit"
          disabled={images.length === 0}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-5 w-5" />
          Publicar Propiedad
        </button>
      </div>
    </div>
  );
}

export function MultiStepForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      transactionType: 'sale',
      propertyType: '',
      title: '',
      description: '',
      price: 0,
      currency: 'BOB',
      bedrooms: 0,
      bathrooms: 0,
      livingArea: 0,
      parkingSpaces: 0,
      neighborhood: '',
      address: '',
      city: 'La Paz',
      images: [],
    },
    mode: 'onBlur',
  });

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const fields: (keyof FormData)[][] = [
      ['transactionType', 'propertyType', 'title', 'description', 'price', 'currency', 'bedrooms', 'bathrooms', 'livingArea', 'parkingSpaces'],
      ['neighborhood', 'address', 'city'],
      ['images'],
    ];

    const result = await form.trigger(fields[step]);
    return result;
  }, [form]);

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?redirect=/properties/new');
        return;
      }

      // In production, upload images to Supabase Storage and create property
      console.log('Submitting property:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Redirect to dashboard after success
      router.push('/dashboard/properties?success=created');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Steps */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-center">
          {STEPS.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                'flex items-center',
                index !== STEPS.length - 1 && 'flex-1'
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    index < currentStep
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : index === currentStep
                      ? 'border-primary-600 bg-white text-primary-600'
                      : 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    index <= currentStep ? 'text-primary-600' : 'text-gray-400'
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index !== STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-full min-w-[60px]',
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        {currentStep === 0 && (
          <InfoStep form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 1 && (
          <LocationStep form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 2 && (
          <PhotosStep form={form} onNext={handleNext} onBack={handleBack} isSubmitting={isSubmitting} />
        )}
      </form>
    </div>
  );
}
