'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Home, MapPin, Camera, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { fullSchema, type FormData } from './multiStepFormTypes';
import { StepForm1 } from './StepForm1';
import { StepForm2 } from './StepForm2';
import { StepForm3 } from './StepForm3';
import { StepForm4 } from './StepForm4';

const STEPS = [
  { id: 'info', title: 'Información básica', icon: Home },
  { id: 'details', title: 'Ubicación y fotos', icon: MapPin },
  { id: 'details2', title: 'Detalles', icon: Camera },
  { id: 'review', title: 'Revisar', icon: FileCheck },
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
      contractDurationYears: undefined,
      registeredInPublicRecords: false,
      neighborhood: '',
      address: '',
      city: 'La Paz',
      images: [],
    },
    mode: 'onBlur',
  });

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields: (keyof FormData)[][] = [
        ['transactionType', 'propertyType', 'title'],
        ['neighborhood', 'address', 'city', 'images'],
        [], // Step 3 — no required fields yet
        [], // Step 4 — submit validates all
      ];
      const stepFields = fields[step];
      if (stepFields.length === 0) return true;
      return form.trigger(stepFields);
    },
    [form]
  );

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
        router.push('/login?redirect=/list');
        return;
      }
      console.log('Submitting property:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/dashboard?success=created');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress: Step X of 4 · Step name (design style) */}
      <div className="mb-6">
        <p className="mb-2 flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-blue-500">
            Paso {currentStep + 1} de {STEPS.length}
          </span>
          <span className="text-slate-400">· {STEPS[currentStep].title}</span>
        </p>
        <div className="flex gap-1">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                index <= currentStep ? 'bg-blue-500' : 'bg-slate-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Form — dark theme to match FormStep1/FormStep2 */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl bg-slate-900 p-6 text-white ring-1 ring-slate-700"
      >
        {currentStep === 0 && (
          <StepForm1 form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 1 && (
          <StepForm2 form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 2 && (
          <StepForm3 form={form} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <StepForm4 form={form} onNext={handleNext} onBack={handleBack} isSubmitting={isSubmitting} />
        )}
      </form>
    </div>
  );
}
