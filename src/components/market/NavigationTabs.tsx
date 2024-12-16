// components/market/NavigationTabs.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { NavigationTab, NavigationTabId } from '@/types/market';

interface NavigationTabsProps {
  tabs: NavigationTab[];
  activeTab: NavigationTabId;
  onTabChange: (tabId: NavigationTabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className="flex items-center space-x-2 p-3 border-b border-purple-100">
    {tabs.map(tab => (
      <motion.button
        key={tab.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded-lg flex items-center space-x-2
          ${activeTab === tab.id 
            ? 'bg-purple-100 text-purple-900' 
            : 'hover:bg-purple-50 text-purple-700'
          } transition-all duration-300`}
      >
        <tab.icon size={18} />
        <span className="font-medium">{tab.label}</span>
      </motion.button>
    ))}
  </div>
);