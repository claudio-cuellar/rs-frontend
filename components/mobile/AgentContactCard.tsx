'use client';

import Image from 'next/image';
import { Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentContactCardProps {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  phoneNumber: string;
  propertyTitle?: string;
  className?: string;
}

export function AgentContactCard({
  name,
  avatarUrl,
  isOnline = true,
  phoneNumber,
  propertyTitle,
  className,
}: AgentContactCardProps) {
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  const handleCall = () => {
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsApp = () => {
    const message = propertyTitle
      ? `¡Hola! Me interesa la propiedad: ${propertyTitle}`
      : '¡Hola! Me interesa esta propiedad.';
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className={cn('mx-4 flex items-center gap-3 rounded-xl bg-slate-800 p-3', className)}>
      {/* Avatar */}
      <div className="relative">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-700">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
              {name.charAt(0)}
            </div>
          )}
        </div>
        {/* Online Status */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-800 bg-green-500" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-xs text-green-400">
          {isOnline ? '● Online' : '○ Offline'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Phone Button */}
        <button
          onClick={handleCall}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600"
        >
          <Phone className="h-5 w-5" />
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 font-semibold text-white hover:bg-green-600"
        >
          <MessageSquare className="h-5 w-5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
