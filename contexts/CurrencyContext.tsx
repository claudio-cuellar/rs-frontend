'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Currency = 'BOB' | 'USD';

// Approximate exchange rate (should be fetched from API in production)
const EXCHANGE_RATE_BOB_TO_USD = 0.145; // 1 BOB ≈ 0.145 USD
const EXCHANGE_RATE_USD_TO_BOB = 6.9; // 1 USD ≈ 6.9 BOB

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  convertPrice: (price: number, fromCurrency: string) => number;
  formatPrice: (price: number, fromCurrency: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('BOB');

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === 'BOB' ? 'USD' : 'BOB'));
  }, []);

  const convertPrice = useCallback(
    (price: number, fromCurrency: string): number => {
      if (fromCurrency === currency) {
        return price;
      }

      if (fromCurrency === 'BOB' && currency === 'USD') {
        return Math.round(price * EXCHANGE_RATE_BOB_TO_USD);
      }

      if (fromCurrency === 'USD' && currency === 'BOB') {
        return Math.round(price * EXCHANGE_RATE_USD_TO_BOB);
      }

      // For other currencies, return as-is
      return price;
    },
    [currency]
  );

  const formatPrice = useCallback(
    (price: number, fromCurrency: string): string => {
      const convertedPrice = convertPrice(price, fromCurrency);

      return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(convertedPrice);
    },
    [currency, convertPrice]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
