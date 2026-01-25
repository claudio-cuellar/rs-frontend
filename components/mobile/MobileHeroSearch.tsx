'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/database';

interface MobileHeroSearchProps {
  className?: string;
}

const TRANSACTION_TABS: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
];

export function MobileHeroSearch({ className }: MobileHeroSearchProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TransactionType>('sale');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', activeTab);
    if (searchQuery) {
      params.set('neighborhood', searchQuery);
    }
    router.push(`/m/search?${params.toString()}`);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Background Image - Illimani Mountain */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1619546952812-520e98064a52?w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-6 pt-8">
        {/* Headlines */}
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-tight text-white">
            Tu próximo hogar bajo<br />el Illimani
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Venta, Alquiler y Anticrético en la Ciudad Maravilla
          </p>
        </div>

        {/* Search Card */}
        <div className="mt-6 rounded-2xl bg-slate-800/80 p-4 backdrop-blur-sm">
          {/* Transaction Type Tabs */}
          <div className="flex gap-2">
            {TRANSACTION_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  activeTab === tab.value
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej. Sopocachi, Calacoto o Achumani"
              className="w-full rounded-xl border-0 bg-slate-700/50 py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Buscar Propiedades
          </button>
        </div>
      </div>
    </div>
  );
}
