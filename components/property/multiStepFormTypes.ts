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
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
];

export const infoSchema = z.object({
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
