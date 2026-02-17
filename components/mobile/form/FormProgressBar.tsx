import { cn } from '@/lib/utils';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export function FormProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
  className,
}: FormProgressBarProps) {
  return (
    <div className={cn('px-4 pt-3 pb-2', className)}>
      <p className="mb-2 flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-blue-500">
          Paso {currentStep} de {totalSteps}
        </span>
        {stepLabels?.[currentStep - 1] && (
          <span className="text-slate-400">
            · {stepLabels[currentStep - 1]}
          </span>
        )}
      </p>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index < currentStep
              ? 'bg-blue-500'
              : 'bg-slate-700'
            )}
          />
        ))}
      </div>
    </div>
  );
}
