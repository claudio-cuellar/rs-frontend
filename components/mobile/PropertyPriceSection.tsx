'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/database';

interface PropertyPriceSectionProps {
  price: number;
  priceCurrency: string;
  transactionType: TransactionType;
  className?: string;
}

const badgeStyles: Record<TransactionType, string> = {
  rent: 'border-green-500 text-green-400',
  sale: 'border-blue-500 text-blue-400',
  anticretico: 'border-purple-500 text-purple-400',
};

const badgeLabels: Record<TransactionType, string> = {
  rent: 'FOR RENT',
  sale: 'FOR SALE',
  anticretico: 'ANTICRÉTICO',
};

// Exchange rate for display (approximate)
const EXCHANGE_RATE_USD_TO_BOB = 6.97;
const EXCHANGE_RATE_BOB_TO_USD = 0.143;

export function PropertyPriceSection({
  price,
  priceCurrency,
  transactionType,
  className,
}: PropertyPriceSectionProps) {
  const { currency } = useCurrency();

  // Calculate both prices for display
  const priceInUSD = priceCurrency === 'USD' ? price : Math.round(price * EXCHANGE_RATE_BOB_TO_USD);
  const priceInBOB = priceCurrency === 'BOB' ? price : Math.round(price * EXCHANGE_RATE_USD_TO_BOB);

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBOB = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn('px-4 py-4', className)}>
      <div className="flex items-start justify-between">
        {/* Price */}
        <div>
          <p className="text-2xl font-bold text-white">
            {formatUSD(priceInUSD)} USD
          </p>
          <p className="mt-1 text-sm text-gray-400">
            ~ {formatBOB(priceInBOB)} BOB
          </p>
        </div>

        {/* Transaction Badge */}
        <span
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-semibold uppercase',
            badgeStyles[transactionType]
          )}
        >
          {badgeLabels[transactionType]}
        </span>
      </div>
    </div>
  );
}
