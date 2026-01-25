'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Compass, LayoutGrid, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Search', href: '/m/search', icon: Search },
  { name: 'Explore', href: '/m', icon: Compass },
  { name: 'Dashboard', href: '/m/dashboard', icon: LayoutGrid },
  { name: 'Profile', href: '/m/profile', icon: User },
];

interface DashboardNavBarProps {
  className?: string;
}

export function DashboardNavBar({ className }: DashboardNavBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-900 px-2 pb-safe',
        className
      )}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/m' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                isActive ? 'text-blue-400' : 'text-gray-500'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
