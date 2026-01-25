import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = 'Ver todo',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
