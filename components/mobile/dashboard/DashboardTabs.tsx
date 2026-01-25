'use client';

import { Heart, LayoutList, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DashboardTab = 'favorites' | 'listings' | 'messages';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  favoritesCount?: number;
  listingsCount?: number;
  messagesCount?: number;
  className?: string;
}

export function DashboardTabs({
  activeTab,
  onTabChange,
  favoritesCount,
  listingsCount,
  messagesCount,
  className,
}: DashboardTabsProps) {
  const tabs = [
    {
      id: 'favorites' as DashboardTab,
      label: 'Favorites',
      icon: Heart,
      count: favoritesCount,
    },
    {
      id: 'listings' as DashboardTab,
      label: 'My Listings',
      icon: LayoutList,
      count: listingsCount,
    },
    {
      id: 'messages' as DashboardTab,
      label: 'Messages',
      icon: MessageSquare,
      count: messagesCount,
    },
  ];

  return (
    <div className={cn('flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            )}
          >
            <Icon className={cn('h-4 w-4', isActive && tab.id === 'favorites' && 'fill-current')} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                isActive ? 'bg-white/20' : 'bg-slate-700'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
