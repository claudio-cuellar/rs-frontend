'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  onLocationChange?: (lat: number, lng: number) => void;
  onNeighborhoodChange?: (neighborhood: string) => void;
  className?: string;
}

// La Paz neighborhoods
const NEIGHBORHOODS = [
  'Sopocachi',
  'Calacoto',
  'San Miguel',
  'Obrajes',
  'Achumani',
  'Irpavi',
  'Cota Cota',
  'Miraflores',
  'San Pedro',
  'Centro',
  'Zona Sur',
];

export function LocationPicker({
  latitude = -16.5,
  longitude = -68.15,
  neighborhood = '',
  onLocationChange,
  onNeighborhoodChange,
  className,
}: LocationPickerProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(neighborhood);

  const filteredNeighborhoods = inputValue
    ? NEIGHBORHOODS.filter((n) =>
        n.toLowerCase().includes(inputValue.toLowerCase())
      )
    : NEIGHBORHOODS;

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange?.(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleNeighborhoodSelect = (value: string) => {
    setInputValue(value);
    onNeighborhoodChange?.(value);
    setShowSuggestions(false);
  };

  return (
    <div className={cn('', className)}>
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-white">Ubicación en La Paz</h3>
        <p className="text-sm text-gray-400">
          Arrastra el marcador para ubicar tu propiedad.
        </p>
      </div>

      {/* Map Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Map Placeholder */}
        <div
          className="aspect-[4/3] w-full"
          style={{
            background: 'linear-gradient(135deg, #1a2234 0%, #0f1623 100%)',
          }}
        >
          {/* Grid pattern for map effect */}
          <svg
            viewBox="0 0 400 300"
            className="h-full w-full opacity-30"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Horizontal lines */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 20}
                x2="400"
                y2={i * 20}
                stroke="#3b5998"
                strokeWidth="0.5"
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2="300"
                stroke="#3b5998"
                strokeWidth="0.5"
              />
            ))}
            {/* Main roads */}
            <path
              d="M0 150 L400 150"
              stroke="#4a6fa5"
              strokeWidth="3"
            />
            <path
              d="M200 0 L200 300"
              stroke="#4a6fa5"
              strokeWidth="3"
            />
            <path
              d="M50 50 L150 150 L350 150"
              stroke="#4a6fa5"
              strokeWidth="2"
            />
          </svg>

          {/* Pin Marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-500 p-3 shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="h-3 w-3 -mt-1.5 rotate-45 bg-blue-500" />
            </div>
          </div>
        </div>

        {/* My Location Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-blue-400 shadow-lg hover:bg-slate-700"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {/* Neighborhood Input */}
      <div className="relative mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Barrio (ej. Sopocachi, Calacoto)"
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredNeighborhoods.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-auto rounded-xl bg-slate-800 py-2 shadow-xl">
            {filteredNeighborhoods.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleNeighborhoodSelect(n)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white hover:bg-slate-700"
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
