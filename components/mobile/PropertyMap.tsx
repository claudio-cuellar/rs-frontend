'use client';

import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  className?: string;
}

export function PropertyMap({
  latitude,
  longitude,
  address,
  className,
}: PropertyMapProps) {
  // Default to La Paz center if no coordinates
  const lat = latitude || -16.5;
  const lng = longitude || -68.15;

  // Static map URL (using OpenStreetMap tiles via static image service)
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+3b82f6(${lng},${lat})/${lng},${lat},14,0/400x200@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;

  const handleOpenMap = () => {
    // Open in Google Maps or native map app
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn('mx-4', className)}>
      <button
        onClick={handleOpenMap}
        className="relative w-full overflow-hidden rounded-xl"
      >
        {/* Map Image */}
        <div className="aspect-[2/1] bg-slate-700">
          {/* Placeholder map styling */}
          <div 
            className="h-full w-full"
            style={{
              background: `
                linear-gradient(135deg, #e8f4ea 0%, #d4e8d8 50%, #c5dcc9 100%)
              `,
              position: 'relative',
            }}
          >
            {/* Simple map representation */}
            <svg
              viewBox="0 0 400 200"
              className="h-full w-full"
              style={{ position: 'absolute', inset: 0 }}
            >
              {/* Roads */}
              <path
                d="M0 100 L400 100"
                stroke="#fff"
                strokeWidth="8"
                fill="none"
              />
              <path
                d="M200 0 L200 200"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M0 50 L150 50 L200 100 L300 100 L400 150"
                stroke="#ffd"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M50 0 L50 80 Q50 100 70 100 L130 100"
                stroke="#ffd"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M350 0 L350 70 L400 70"
                stroke="#ffd"
                strokeWidth="3"
                fill="none"
              />
            </svg>

            {/* Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-500 p-2 shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="h-2 w-2 -mt-1 rotate-45 bg-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Overlay hint */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/30 to-transparent pb-3 opacity-0 transition-opacity hover:opacity-100">
          <span className="text-sm font-medium text-white">
            Tap to open in maps
          </span>
        </div>
      </button>
    </div>
  );
}
