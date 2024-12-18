// components/NavigationTabs.tsx
import React from 'react';
import { Star, Flame, Globe, History } from 'lucide-react';
import type { NavigationTab } from '@/types/navigation';

interface NavigationTabsProps {
  activeTab: NavigationTab['id'];
  onTabChange: (tab: NavigationTab['id']) => void;
  favoritedCount: number;
  recentCount: number;
}

export function NavigationTabs({ 
  activeTab, 
  onTabChange,
  favoritedCount,
  recentCount 
}: NavigationTabsProps) {
  const navigationTabs: NavigationTab[] = [
    { id: 'all', label: 'All Markets', icon: Globe },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoritedCount },
    { id: 'recent', label: 'Recent', icon: History, count: recentCount }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 overflow-x-auto hide-scrollbar">
          <div className="flex items-center space-x-8">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-purple-600 text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}