// components/market/PopularMarketItem.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import type { PopularMarket } from '@/types/market';

interface PopularMarketItemProps {
  market: PopularMarket;
  isFavorite: boolean;
  onFavoriteToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (id: string) => void;
}

export const PopularMarketItem: React.FC<PopularMarketItemProps> = ({
  market,
  isFavorite,
  onFavoriteToggle,
  onSelect,
}) => {
  const Icon = market.icon;
  
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(market.id)}
      className="w-full p-4 rounded-lg bg-white/50 border border-purple-100 
                hover:border-purple-200 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <Icon size={20} className="text-purple-600" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-['Orbitron'] font-bold text-purple-900">
                {market.label}
              </span>
              {market.hot && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
                  HOT
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-purple-600">{market.type}</span>
              <span className="text-green-600">{market.trend}</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={(e) => onFavoriteToggle(market.id, e)}
          className={`p-1 rounded-full transition-colors ${
            isFavorite ? 'text-yellow-500' : 'text-purple-200 group-hover:text-purple-300'
          }`}
        >
          <Star size={16} />
        </motion.button>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">Prize Pool:</span>
          <span className="font-medium text-purple-900">{market.prize}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-purple-600">
            <Clock size={16} />
            <span>{market.timeLeft}</span>
          </div>
          
          <span className="bg-purple-100 px-2 py-0.5 rounded text-xs font-medium">
            {market.count} Arenas
          </span>
        </div>
      </div>
    </motion.button>
  );
};