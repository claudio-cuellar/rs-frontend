'use client';

import { Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapViewButtonProps {
  onClick?: () => void;
  className?: string;
}

export function MapViewButton({ onClick, className }: MapViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-full bg-slate-800 px-5 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95',
        className
      )}
    >
      <Map className="h-5 w-5" />
      MAP VIEW
    </button>
  );
}
