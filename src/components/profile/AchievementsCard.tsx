import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;  // Changed from string to LucideIcon
    earnedAt: number;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
    legendary: 'bg-yellow-100 text-yellow-600'
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg"
    >
      <div className={`p-3 rounded-lg ${rarityColors[achievement.rarity]}`}>
      {achievement.icon ? (
        <achievement.icon size={24} />
        ) : (
        <Trophy size={24} />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-purple-900">{achievement.title}</div>
          <div className="flex items-center text-purple-600 text-sm space-x-1">
            <Star size={14} />
            <span>{achievement.xpReward} XP</span>
          </div>
        </div>
        <div className="text-sm text-purple-600 mt-1">{achievement.description}</div>
        <div className="flex items-center text-xs text-purple-500 mt-2 space-x-1">
          <Clock size={12} />
          <span>Earned {formatDate(achievement.earnedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};