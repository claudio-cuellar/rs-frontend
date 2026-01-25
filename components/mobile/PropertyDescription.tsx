'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PropertyDescriptionProps {
  description: string;
  maxLength?: number;
  className?: string;
}

export function PropertyDescription({
  description,
  maxLength = 200,
  className,
}: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded || !shouldTruncate
    ? description
    : `${description.slice(0, maxLength)}...`;

  return (
    <div className={cn('px-4', className)}>
      <h3 className="text-base font-semibold text-white">Description</h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-300">
        {displayText}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
