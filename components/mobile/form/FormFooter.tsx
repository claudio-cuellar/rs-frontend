'use client';

import { cn } from '@/lib/utils';

interface FormFooterProps {
  onBack?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  continueLabel?: string;
  showBack?: boolean;
  continueDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function FormFooter({
  onBack,
  onContinue,
  backLabel = 'Atrás',
  continueLabel = 'Continuar',
  showBack = true,
  continueDisabled = false,
  isLoading = false,
  className,
}: FormFooterProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 flex gap-3 bg-slate-900 px-4 py-4 pb-safe',
        className
      )}
    >
      {/* Back Button */}
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl bg-slate-800 py-3.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          {backLabel}
        </button>
      )}

      {/* Continue Button */}
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled || isLoading}
        className={cn(
          'rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed',
          showBack ? 'flex-[2]' : 'flex-1'
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </span>
        ) : (
          continueLabel
        )}
      </button>
    </div>
  );
}
