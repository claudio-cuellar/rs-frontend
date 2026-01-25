'use client';

import Link from 'next/link';
import { Bell, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function MobileHeader({ className, variant = 'dark' }: MobileHeaderProps) {
  const isDark = variant === 'dark';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-4 py-3',
        isDark ? 'bg-slate-900' : 'bg-white',
        className
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isDark ? 'bg-blue-500' : 'bg-primary-600'
        )}>
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className={cn(
          'text-base font-semibold',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          La Paz Real Estate
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            isDark 
              ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            isDark 
              ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
