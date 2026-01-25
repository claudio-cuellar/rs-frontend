import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/database';

interface TransactionBadgeProps {
  type: TransactionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeStyles: Record<TransactionType, string> = {
  rent: 'bg-green-100 text-green-800 ring-green-600/20',
  sale: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  anticretico: 'bg-purple-100 text-purple-800 ring-purple-600/20',
};

const badgeLabels: Record<TransactionType, string> = {
  rent: 'Alquiler',
  sale: 'Venta',
  anticretico: 'Anticrético',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function TransactionBadge({ type, size = 'md', className }: TransactionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold ring-1 ring-inset',
        badgeStyles[type],
        sizeStyles[size],
        className
      )}
    >
      {badgeLabels[type]}
    </span>
  );
}

// Solid variant for use on images
export function TransactionBadgeSolid({ type, size = 'md', className }: TransactionBadgeProps) {
  const solidStyles: Record<TransactionType, string> = {
    rent: 'bg-green-600 text-white',
    sale: 'bg-blue-600 text-white',
    anticretico: 'bg-purple-600 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        solidStyles[type],
        sizeStyles[size],
        className
      )}
    >
      {badgeLabels[type]}
    </span>
  );
}
