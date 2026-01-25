import { Bus, Train } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransitStop {
  type: 'bus' | 'teleferico' | 'train';
  name: string;
  station?: string;
  distance: string;
}

interface TransitInfoProps {
  stops: TransitStop[];
  className?: string;
}

const transitIcons = {
  bus: Bus,
  teleferico: Train, // Using train icon for teleférico
  train: Train,
};

const transitColors = {
  bus: 'bg-blue-500',
  teleferico: 'bg-yellow-500',
  train: 'bg-red-500',
};

export function TransitInfo({ stops, className }: TransitInfoProps) {
  if (stops.length === 0) return null;

  return (
    <div className={cn('px-4', className)}>
      <h3 className="text-base font-semibold text-white">
        Connectivity & Transit
      </h3>

      <div className="mt-4 space-y-3">
        {stops.map((stop, index) => {
          const Icon = transitIcons[stop.type];
          const bgColor = transitColors[stop.type];

          return (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bgColor)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{stop.name}</p>
                  {stop.station && (
                    <p className="text-xs text-gray-400">{stop.station}</p>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-400">{stop.distance}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
