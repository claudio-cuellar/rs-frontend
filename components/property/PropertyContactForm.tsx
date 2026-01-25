'use client';

import { useState } from 'react';
import { Mail, Phone, Send, Loader2, User } from 'lucide-react';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import type { Property } from '@/types/database';

interface PropertyContactFormProps {
  property: Property;
  agentPhone?: string;
  agentName?: string;
}

// Default agent phone for demo (Bolivia country code +591)
const DEFAULT_AGENT_PHONE = '59171234567';

export function PropertyContactForm({ 
  property, 
  agentPhone = DEFAULT_AGENT_PHONE,
  agentName = 'Agente Inmobiliario'
}: PropertyContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    `Hola, me interesa la propiedad "${property.title}" en ${property.neighborhood || property.city || 'La Paz'}. ¿Podrían contactarme con más información?`
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual contact form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  const propertyUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://casalapaz.bo/properties/${property.id}`;

  if (submitted) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 font-semibold text-gray-900">¡Mensaje Enviado!</h3>
          <p className="mt-2 text-sm text-gray-600">
            Gracias por tu interés. El agente te contactará pronto.
          </p>
          <div className="mt-4">
            <WhatsAppButton
              phoneNumber={agentPhone}
              propertyTitle={property.title}
              propertyUrl={propertyUrl}
              variant="outline"
              size="sm"
            >
              También puedes escribir por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      {/* Agent Info */}
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <User className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{agentName}</p>
          <p className="text-sm text-gray-500">Agente de CasaLaPaz</p>
        </div>
      </div>

      {/* WhatsApp Button - Primary CTA */}
      <div className="mb-4">
        <WhatsAppButton
          phoneNumber={agentPhone}
          propertyTitle={property.title}
          propertyUrl={propertyUrl}
          size="lg"
          className="w-full"
        />
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">o envía un mensaje</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tu Nombre
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono (opcional)
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="71234567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mensaje
          </label>
          <textarea
            id="message"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-gray-500">
        Al enviar, aceptas nuestros Términos de Servicio y Política de Privacidad.
      </p>
    </div>
  );
}
