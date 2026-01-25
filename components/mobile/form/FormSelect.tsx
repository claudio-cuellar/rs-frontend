'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  className,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('', className)} ref={containerRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-white">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-4 py-3.5 text-left"
        >
          <span className={cn(
            'text-sm',
            selectedOption ? 'text-white' : 'text-gray-500'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-xl bg-slate-800 py-2 shadow-xl">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors',
                  option.value === value
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-white hover:bg-slate-700'
                )}
              >
                {option.label}
                {option.value === value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
