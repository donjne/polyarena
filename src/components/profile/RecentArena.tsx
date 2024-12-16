import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock } from 'lucide-react';
import type { Arena } from '@/types/arena';

interface RecentArenaCardProps {
  arena: Arena;
}

export const RecentArenaCard: React.FC<RecentArenaCardProps> = ({ arena }) => {
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Trophy size={20} className="text-purple-600" />
        </div>
        <div>
          <div className="font-medium text-purple-900">{arena.name}</div>
          <div className="text-sm text-purple-600">
            {arena.matchType.charAt(0).toUpperCase() + arena.matchType.slice(1)} Match
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm text-purple-600">
        <div className="flex items-center space-x-2">
          <Users size={16} />
          <span>{arena.players.current}/{arena.players.maximum}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} />
          <span>{formatTimeAgo(arena.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
};