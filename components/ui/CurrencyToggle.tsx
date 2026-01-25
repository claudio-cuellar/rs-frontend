'use client';

import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

interface CurrencyToggleProps {
  className?: string;
  variant?: 'switch' | 'dropdown' | 'buttons';
}

export function CurrencyToggle({ className, variant = 'switch' }: CurrencyToggleProps) {
  const { currency, setCurrency, toggleCurrency } = useCurrency();

  if (variant === 'buttons') {
    return (
      <div className={cn('inline-flex rounded-lg bg-gray-100 p-1', className)}>
        <button
          onClick={() => setCurrency('BOB')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            currency === 'BOB'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Bs.
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            currency === 'USD'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          $
        </button>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className={cn(
          'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700',
          'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          className
        )}
      >
        <option value="BOB">BOB (Bs.)</option>
        <option value="USD">USD ($)</option>
      </select>
    );
  }

  // Default: switch variant
  return (
    <button
      onClick={toggleCurrency}
      className={cn(
        'relative inline-flex h-8 w-16 items-center rounded-full transition-colors',
        currency === 'USD' ? 'bg-primary-600' : 'bg-gray-300',
        className
      )}
      role="switch"
      aria-checked={currency === 'USD'}
      aria-label="Toggle currency"
    >
      <span
        className={cn(
          'absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm transition-transform',
          currency === 'USD' && 'translate-x-8'
        )}
      >
        {currency === 'BOB' ? 'Bs' : '$'}
      </span>
      <span className="sr-only">
        {currency === 'BOB' ? 'Switch to USD' : 'Switch to BOB'}
      </span>
    </button>
  );
}
