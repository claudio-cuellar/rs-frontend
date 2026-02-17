import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import type { TransactionType } from '@/types/database';

export const NEIGHBORHOODS = [
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

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Estudio' },
  { value: 'office', label: 'Oficina' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Otro' },
];

export const TITLE_MAX_LENGTH = 80;

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
];

export const CONTRACT_DURATION_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5+' },
];

export const infoSchema = z.object({
  title: z.string().min(1, 'Ingresa un título').max(80, 'Máximo 80 caracteres'),
  description: z.string().optional(),
  transactionType: z.enum(['sale', 'rent', 'anticretico']),
  propertyType: z.string().min(1, 'Selecciona un tipo de propiedad'),
  price: z.number().min(0),
  currency: z.enum(['BOB', 'USD']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  livingArea: z.number().min(0),
  parkingSpaces: z.number().min(0),
  contractDurationYears: z.number().optional(),
  registeredInPublicRecords: z.boolean().optional(),
});

export const locationSchema = z.object({
  neighborhood: z.string().min(1, 'Selecciona un barrio'),
  address: z.string().min(5, 'Ingresa una dirección válida'),
  city: z.string().default('La Paz'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const photosSchema = z.object({
  images: z.array(z.string()).min(1, 'Sube al menos una foto'),
});

export const fullSchema = infoSchema.merge(locationSchema).merge(photosSchema);

export type FormData = z.infer<typeof fullSchema>;

export interface StepProps {
  form: UseFormReturn<FormData>;
  onNext: () => void;
  onBack: () => void;
}
