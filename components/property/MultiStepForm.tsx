'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Home, MapPin, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { fullSchema, type FormData } from './multiStepFormTypes';
import { StepForm1 } from './StepForm1';
import { StepForm2 } from './StepForm2';
import { StepForm3 } from './StepForm3';

const STEPS = [
  { id: 'info', title: 'Información', icon: Home },
  { id: 'location', title: 'Ubicación', icon: MapPin },
  { id: 'photos', title: 'Fotos', icon: Camera },
];

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
          <StepForm1 form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 1 && (
          <StepForm2 form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 2 && (
          <StepForm3 form={form} onNext={handleNext} onBack={handleBack} isSubmitting={isSubmitting} />
        )}
      </form>
    </div>
  );
}
