'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormHeaderProps {
  title: string;
  onSave?: () => void;
  onClose?: () => void;
  showSave?: boolean;
  saveLabel?: string;
  saveDisabled?: boolean;
  className?: string;
}

export function FormHeader({
  title,
  onSave,
  onClose,
  showSave = true,
  saveLabel = 'Guardar',
  saveDisabled = false,
  className,
}: FormHeaderProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3',
        className
      )}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-slate-800"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-white">{title}</h1>

      {/* Save Button */}
      {showSave ? (
        <button
          onClick={onSave}
          disabled={saveDisabled}
          className={cn(
            'text-sm font-semibold text-blue-400 hover:text-blue-300',
            saveDisabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {saveLabel}
        </button>
      ) : (
        <div className="w-10" /> // Spacer for alignment
      )}
    </header>
  );
}
