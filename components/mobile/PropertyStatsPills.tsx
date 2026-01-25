import { Bed, Bath, Square, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyStatsPillsProps {
  bedrooms: number;
  bathrooms: number;
  area?: number | null;
  areaUnit?: string;
  parkingSpaces?: number;
  className?: string;
}

export function PropertyStatsPills({
  bedrooms,
  bathrooms,
  area,
  areaUnit = 'm²',
  parkingSpaces = 0,
  className,
}: PropertyStatsPillsProps) {
  const stats = [
    { icon: Bed, value: bedrooms, label: 'Beds' },
    { icon: Bath, value: bathrooms, label: 'Baths' },
    ...(area ? [{ icon: Square, value: area, label: areaUnit }] : []),
    ...(parkingSpaces > 0 ? [{ icon: Car, value: parkingSpaces, label: 'Park', isParking: true }] : []),
  ];

  return (
    <div className={cn('flex flex-wrap gap-2 px-4', className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-sm"
        >
          {'isParking' in stat ? (
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[10px] font-bold text-white">
              P
            </span>
          ) : (
            <stat.icon className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-white">
            {stat.value} {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
