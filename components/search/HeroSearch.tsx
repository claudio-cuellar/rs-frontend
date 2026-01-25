'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// La Paz neighborhoods with some metadata
const NEIGHBORHOODS = [
  { name: 'Sopocachi', zone: 'Centro', popular: true },
  { name: 'Calacoto', zone: 'Zona Sur', popular: true },
  { name: 'San Miguel', zone: 'Zona Sur', popular: true },
  { name: 'Obrajes', zone: 'Zona Sur', popular: true },
  { name: 'Achumani', zone: 'Zona Sur', popular: true },
  { name: 'Irpavi', zone: 'Zona Sur', popular: false },
  { name: 'Cota Cota', zone: 'Zona Sur', popular: false },
  { name: 'Miraflores', zone: 'Centro', popular: true },
  { name: 'San Pedro', zone: 'Centro', popular: false },
  { name: 'Centro', zone: 'Centro', popular: false },
  { name: 'Mallasa', zone: 'Zona Sur', popular: false },
  { name: 'Chasquipampa', zone: 'Zona Sur', popular: false },
  { name: 'Bolognia', zone: 'Zona Sur', popular: false },
  { name: 'Seguencoma', zone: 'Zona Sur', popular: false },
  { name: 'Alto Obrajes', zone: 'Zona Sur', popular: false },
  { name: 'La Florida', zone: 'Zona Sur', popular: false },
  { name: 'Villa Fátima', zone: 'Norte', popular: false },
  { name: 'El Alto', zone: 'El Alto', popular: false },
];

interface HeroSearchProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

export function HeroSearch({ className, variant = 'hero' }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter neighborhoods based on query
  const filteredNeighborhoods = query
    ? NEIGHBORHOODS.filter((n) =>
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.zone.toLowerCase().includes(query.toLowerCase())
      )
    : NEIGHBORHOODS.filter((n) => n.popular);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    setQuery(neighborhood);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedNeighborhood(null);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (selectedNeighborhood) {
      searchParams.set('neighborhood', selectedNeighborhood);
    } else if (query) {
      searchParams.set('q', query);
    }
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar barrio..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-8 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && filteredNeighborhoods.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {filteredNeighborhoods.map((n) => (
              <button
                key={n.name}
                onClick={() => handleSelect(n.name)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900">{n.name}</span>
                <span className="text-gray-500">· {n.zone}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Hero variant (default)
  return (
    <div className={cn('relative mx-auto max-w-2xl', className)}>
      <div className="relative rounded-2xl bg-white p-2 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setSelectedNeighborhood(null);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="¿Dónde quieres vivir? Ej: Sopocachi, Calacoto..."
              className="w-full rounded-xl border-0 py-4 pl-12 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl bg-white py-3 shadow-xl ring-1 ring-black ring-opacity-5"
        >
          <div className="px-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {query ? 'Resultados' : 'Barrios Populares'}
            </p>
          </div>
          <div className="max-h-64 overflow-auto">
            {filteredNeighborhoods.length > 0 ? (
              filteredNeighborhoods.map((n) => (
                <button
                  key={n.name}
                  onClick={() => handleSelect(n.name)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{n.name}</p>
                    <p className="text-sm text-gray-500">{n.zone}, La Paz</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500">No se encontraron resultados</p>
                <p className="mt-1 text-sm text-gray-400">
                  Intenta con otro barrio o zona
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
