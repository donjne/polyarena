// components/ArenaCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Star, Share2 } from 'lucide-react';
import type { Arena } from '../types/arena';

interface ArenaCardProps {
  arena: Arena;
  onEnter: (arena: Arena) => void;
  onFavorite: (arenaId: string) => void;
  onShare: (arenaId: string) => void;
  isFavorited: boolean;
}

export const ArenaCard: React.FC<ArenaCardProps> = ({
  arena,
  onEnter,
  onFavorite,
  onShare,
  isFavorited
}) => {
  const timeRemaining = React.useMemo(() => {
    const now = Date.now();
    const endTime = arena.timestamp + (arena.rounds.timePerRound * arena.rounds.total * 1000);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }, [arena.timestamp, arena.rounds]);

  const prizePoolFormatted = React.useMemo(() => {
    const total = parseFloat(arena.prizeStructure.totalPool);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(total);
  }, [arena.prizeStructure.totalPool]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20
                 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Arena Header */}
      <div className="relative h-32 bg-gradient-to-br from-purple-600 to-blue-600 p-4">
        <div className="absolute inset-0 bg-[url('/arena-pattern.svg')] opacity-10" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {arena.status === 'active' && (
            <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold 
                           flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>LIVE</span>
            </span>
          )}
        </div>

        <div className="relative">
          <h3 className="text-xl font-['Russo_One'] text-white mb-2">{arena.name}</h3>
          <div className="flex items-center space-x-4">
            <span className="px-2 py-1 rounded-lg bg-white/20 text-white text-sm">
              {arena.matchType}
            </span>
            <span className="text-white/90 text-sm">
              Round {arena.rounds.current}/{arena.rounds.total}
            </span>
          </div>
        </div>
      </div>

      {/* Arena Details */}
      <div className="p-4 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-purple-600">Prize Pool</div>
            <div className="font-bold text-purple-900">{prizePoolFormatted}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-purple-600">Players</div>
            <div className="font-bold text-purple-900">
              {arena.players.current}/{arena.players.maximum}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-purple-600">Entry Fee</div>
            <div className="font-bold text-purple-900">{arena.entryFee}</div>
          </div>
        </div>

        {/* Time and Progress */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-purple-600">
            <Timer size={16} />
            <span>{timeRemaining}</span>
          </div>
          <div className="w-32 h-2 rounded-full bg-purple-100">
            <div 
              className="h-full rounded-full bg-purple-600" 
              style={{ 
                width: `${(arena.rounds.current / arena.rounds.total) * 100}%` 
              }} 
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => onEnter(arena)}
            className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 
                     text-white font-medium shadow-lg shadow-purple-500/20 
                     hover:shadow-purple-500/40 transition-all duration-300"
          >
            Enter Arena
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onFavorite(arena.id)}
            className={`p-2 rounded-lg border-2 
              ${isFavorited 
                ? 'border-yellow-400 text-yellow-400' 
                : 'border-purple-200 text-purple-400'
              } hover:border-yellow-400 hover:text-yellow-400 transition-colors`}
          >
            <Star size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onShare(arena.id)}
            className="p-2 rounded-lg border-2 border-purple-200 text-purple-400 
                     hover:border-purple-400 transition-colors"
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};