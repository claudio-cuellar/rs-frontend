'use client';

import Image from 'next/image';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  userName: string;
  avatarUrl?: string;
  notificationCount?: number;
  className?: string;
}

export function DashboardHeader({
  userName,
  avatarUrl,
  notificationCount = 0,
  className,
}: DashboardHeaderProps) {
  return (
    <header className={cn('flex items-center justify-between px-4 py-4', className)}>
      {/* Left - Avatar and Welcome */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-700">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <h1 className="text-lg font-semibold text-white">Mi Panel</h1>
          <p className="text-sm text-gray-400">Bienvenido, {userName}</p>
        </div>
      </div>

      {/* Right - Notification Bell */}
      <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-slate-800 hover:text-white">
        <Bell className="h-6 w-6" />
        {notificationCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
}
