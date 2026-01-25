import { Metadata } from 'next';
import { MultiStepForm } from '@/components/property/MultiStepForm';

export const metadata: Metadata = {
  title: 'Publicar Propiedad',
  description: 'Publica tu propiedad en CasaLaPaz - El portal inmobiliario de La Paz',
};

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Publicar Nueva Propiedad
          </h1>
          <p className="mt-2 text-gray-600">
            Completa los siguientes pasos para publicar tu propiedad en CasaLaPaz
          </p>
        </div>

        <MultiStepForm />
      </div>
    </div>
  );
}
