import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NeighborhoodCardProps {
  name: string;
  propertyCount: number;
  imageUrl?: string;
  href?: string;
  className?: string;
}

// Default neighborhood images (La Paz landmarks/areas)
const DEFAULT_IMAGES: Record<string, string> = {
  'Sopocachi': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
  'Calacoto': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80',
  'Achumani': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80',
  'San Pedro': 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=200&q=80',
  'Miraflores': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80',
  'Obrajes': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=80',
  'San Miguel': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80',
  'Irpavi': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200&q=80',
};

export function NeighborhoodCard({
  name,
  propertyCount,
  imageUrl,
  href,
  className,
}: NeighborhoodCardProps) {
  const image = imageUrl || DEFAULT_IMAGES[name] || DEFAULT_IMAGES['Sopocachi'];
  const linkHref = href || `/search?neighborhood=${encodeURIComponent(name)}`;

  return (
    <Link
      href={linkHref}
      className={cn(
        'flex items-center gap-3 rounded-xl bg-slate-800 p-3 transition-colors hover:bg-slate-700',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white">{name}</h3>
        <p className="text-xs text-blue-400">
          {propertyCount} PROP.
        </p>
      </div>
    </Link>
  );
}
