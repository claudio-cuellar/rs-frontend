'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FormHeader,
  FormProgressBar,
  FormSelect,
  ListingTypeTabs,
  LocationPicker,
  PhotoUploader,
  FormFooter,
} from '@/components/mobile/form';
import type { TransactionType } from '@/types/database';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
];

const TERM_OPTIONS = [
  { value: '1', label: '1 Year' },
  { value: '2', label: '2 Years' },
  { value: '3', label: '3 Years' },
  { value: '5', label: '5 Years' },
];

interface FormData {
  propertyType: string;
  listingType: TransactionType;
  latitude: number;
  longitude: number;
  neighborhood: string;
  fixedTerm: string;
  voluntaryTerm: string;
  photos: string[];
  // Step 2 fields
  title: string;
  description: string;
  price: number;
  currency: string;
  // Step 3 fields
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  parkingSpaces: number;
  // Step 4 fields
  amenities: string[];
}

const TOTAL_STEPS = 4;

export default function ListPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    // Save as draft
    console.log('Saving draft:', formData);
    router.push('/m');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleContinue = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit form
      setIsLoading(true);
      try {
        console.log('Submitting property:', formData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push('/m?success=listed');
      } catch (error) {
        console.error('Error listing property:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isAnticretico = formData.listingType === 'anticretico';

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <FormHeader
        title="List Your Property"
        onSave={handleSave}
      />

      {/* Progress Bar */}
      <FormProgressBar
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />

      {/* Form Content */}
      <div className="px-4 py-4">
        {currentStep === 1 && (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            isAnticretico={isAnticretico}
          />
        )}

        {currentStep === 2 && (
          <Step2Details
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 3 && (
          <Step3Features
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 4 && (
          <Step4Review formData={formData} />
        )}
      </div>

      {/* Footer */}
      <FormFooter
        onBack={handleBack}
        onContinue={handleContinue}
        showBack={currentStep > 1}
        continueLabel={currentStep === TOTAL_STEPS ? 'Publish Listing' : 'Continue'}
        isLoading={isLoading}
      />
    </div>
  );
}

// Step 1: Basic Information
function Step1BasicInfo({
  formData,
  updateFormData,
  isAnticretico,
}: {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  isAnticretico: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-400">
          Start with the essentials of your listing.
        </p>
      </div>

      {/* Property Type */}
      <FormSelect
        label="Property Type"
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
        onLocationChange={(lat, lng) => updateFormData({ latitude: lat, longitude: lng })}
        onNeighborhoodChange={(neighborhood) => updateFormData({ neighborhood })}
      />

      {/* Anticrético Terms */}
      {isAnticretico && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            Anticrético Terms
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="FIXED TERM"
              value={formData.fixedTerm}
              options={TERM_OPTIONS}
              onChange={(value) => updateFormData({ fixedTerm: value })}
            />
            <FormSelect
              label="VOLUNTARY TERM"
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
        <h2 className="text-xl font-bold text-white">Property Details</h2>
        <p className="mt-1 text-sm text-gray-400">
          Tell us more about your property.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="e.g. Modern Apartment in Sopocachi"
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe your property..."
          rows={4}
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Price
          </label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => updateFormData({ price: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FormSelect
          label="Currency"
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
        <h2 className="text-xl font-bold text-white">Features & Specs</h2>
        <p className="mt-1 text-sm text-gray-400">
          Add the details buyers want to know.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Bedrooms
          </label>
          <input
            type="number"
            min="0"
            value={formData.bedrooms || ''}
            onChange={(e) => updateFormData({ bedrooms: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Bathrooms
          </label>
          <input
            type="number"
            min="0"
            value={formData.bathrooms || ''}
            onChange={(e) => updateFormData({ bathrooms: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Area (m²)
          </label>
          <input
            type="number"
            min="0"
            value={formData.livingArea || ''}
            onChange={(e) => updateFormData({ livingArea: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Parking Spaces
          </label>
          <input
            type="number"
            min="0"
            value={formData.parkingSpaces || ''}
            onChange={(e) => updateFormData({ parkingSpaces: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

// Step 4: Review
function Step4Review({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Review Your Listing</h2>
        <p className="mt-1 text-sm text-gray-400">
          Make sure everything looks good.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl bg-slate-800 p-4 space-y-4">
        {/* Photos Preview */}
        {formData.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {formData.photos.slice(0, 4).map((photo, index) => (
              <div key={index} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <img src={photo} alt="" className="h-full w-full object-cover" />
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
            {formData.title || 'Untitled Property'}
          </h3>
          <p className="text-xl font-bold text-blue-400">
            {formData.currency === 'USD' ? '$' : 'Bs.'} {formData.price.toLocaleString()}
          </p>
        </div>

        {/* Location */}
        <div className="text-sm text-gray-400">
          {formData.neighborhood || 'Location not set'}, La Paz
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{formData.bedrooms} beds</span>
          <span>{formData.bathrooms} baths</span>
          <span>{formData.livingArea} m²</span>
          {formData.parkingSpaces > 0 && <span>{formData.parkingSpaces} parking</span>}
        </div>

        {/* Type */}
        <div className="flex gap-2">
          <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-white capitalize">
            {formData.propertyType}
          </span>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400 capitalize">
            {formData.listingType}
          </span>
        </div>
      </div>
    </div>
  );
}
