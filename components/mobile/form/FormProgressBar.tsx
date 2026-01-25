import { cn } from '@/lib/utils';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function FormProgressBar({
  currentStep,
  totalSteps,
  className,
}: FormProgressBarProps) {
  return (
    <div className={cn('flex gap-2 px-4 py-3', className)}>
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
  );
}
