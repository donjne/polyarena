// components/market/MarketListItem.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import type { MarketItem } from '@/types/market';

interface MarketListItemProps {
  item: MarketItem;
  isFavorite: boolean;
  onFavoriteToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (id: string) => void;
}

export const MarketListItem: React.FC<MarketListItemProps> = ({
  item,
  isFavorite,
  onFavoriteToggle,
  onSelect,
}) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    onClick={() => onSelect(item.id)}
    className="w-full p-2 rounded-lg flex items-center justify-between hover:bg-purple-50
             text-purple-900 transition-all duration-300 group"
  >
    <div className="flex items-center space-x-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={(e) => onFavoriteToggle(item.id, e)}
        className={`p-1 rounded-full transition-colors ${
          isFavorite ? 'text-yellow-500' : 'text-purple-200 group-hover:text-purple-300'
        }`}
      >
        <Star size={14} />
      </motion.button>
      
      <span className="font-['Orbitron'] text-sm">{item.label}</span>
      
      {item.hot && (
        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
          HOT
        </span>
      )}
    </div>

    <div className="flex items-center space-x-4">
      <span className="bg-purple-100 px-2 py-0.5 rounded text-xs font-medium">
        {item.count} Arenas
      </span>
      <ChevronRight size={16} className="text-purple-400" />
    </div>
  </motion.button>
);

