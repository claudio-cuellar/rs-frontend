'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyDetailHeaderProps {
  title?: string;
  onShare?: () => void;
  className?: string;
}

export function PropertyDetailHeader({
  title = 'Property Details',
  onShare,
  className,
}: PropertyDetailHeaderProps) {
  const router = useRouter();

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      });
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3',
        className
      )}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-slate-800"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-white">{title}</h1>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-slate-800"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </header>
  );
}
