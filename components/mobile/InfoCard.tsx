import { Info, HelpCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description: string;
  variant?: 'info' | 'help' | 'warning' | 'tip';
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-400',
  },
  help: {
    icon: HelpCircle,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-400',
  },
  warning: {
    icon: AlertCircle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-400',
  },
  tip: {
    icon: Lightbulb,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    titleColor: 'text-green-400',
  },
};

export function InfoCard({
  title,
  description,
  variant = 'info',
  className,
}: InfoCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex gap-4 rounded-xl bg-slate-800 p-4',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
          config.iconBg
        )}
      >
        <Icon className={cn('h-5 w-5', config.iconColor)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className={cn('font-semibold', config.titleColor)}>
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
