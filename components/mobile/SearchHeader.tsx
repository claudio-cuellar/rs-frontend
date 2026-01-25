'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onSearchClick?: () => void;
  className?: string;
}

export function SearchHeader({
  title,
  subtitle,
  showBack = true,
  showSearch = true,
  onSearchClick,
  className,
}: SearchHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3',
        className
      )}
    >
      {/* Left - Back button and title */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-slate-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right - Search button */}
      {showSearch && (
        <button
          onClick={onSearchClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-slate-800"
        >
          <Search className="h-5 w-5" />
        </button>
      )}
    </header>
  );
}
