import { Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnticreticoTermsCardProps {
  duration?: string;
  durationSubtext?: string;
  registration?: string;
  registrationSubtext?: string;
  className?: string;
}

export function AnticreticoTermsCard({
  duration = '1 Year Fixed',
  durationSubtext = '+1 Year Voluntary',
  registration = 'Derechos Reales',
  registrationSubtext = 'Legal paperwork incl.',
  className,
}: AnticreticoTermsCardProps) {
  return (
    <div className={cn('mx-4 rounded-xl bg-slate-800 p-4', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-blue-400">
        <Handshake className="h-5 w-5" />
        <span className="font-semibold">Anticrético Terms Available</span>
      </div>

      {/* Terms Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Duration */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Duration</p>
          <p className="mt-1 font-semibold text-white">{duration}</p>
          <p className="text-xs text-gray-500">{durationSubtext}</p>
        </div>

        {/* Registration */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Registration</p>
          <p className="mt-1 font-semibold text-white">{registration}</p>
          <p className="text-xs text-gray-500">{registrationSubtext}</p>
        </div>
      </div>
    </div>
  );
}
