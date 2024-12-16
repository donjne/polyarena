// components/achievements/AchievementSystem.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Shield, Target, Crown, 
  TrendingUp, Award, Gift, Lock, 
   Bell
} from 'lucide-react';
import type { UserProfile } from '@/types/user';
import { UnlockModal } from './UnlockModal';

interface AchievementCategory {
  id: string;
  name: string;
  icon: typeof Trophy;
  description: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'wins' | 'streak' | 'prediction_accuracy' | 'participation' | 'rewards';
    target: number;
    current?: number;
  };
  rewards: {
    xp: number;
    title?: string;
    badge?: string;
    multiplier?: number;
  };
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
}

interface AchievementSystemProps {
  user: UserProfile;
  achievements: Achievement[];
  onAchievementClaim: (achievementId: string) => Promise<void>;
  onNotificationToggle: (enabled: boolean) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  user,
  achievements,
  onAchievementClaim,
  onNotificationToggle
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [claimingId, setClaimingId] = React.useState<string | null>(null);
  const [showUnlockModal, setShowUnlockModal] = React.useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = React.useState<Achievement | null>(null);

  const categories: AchievementCategory[] = [
    {
      id: 'wins',
      name: 'Victory',
      icon: Trophy,
      description: 'Achievements for winning arenas',
      achievements: achievements.filter(a => a.requirements.type === 'wins')
    },
    {
      id: 'streaks',
      name: 'Streaks',
      icon: TrendingUp,
      description: 'Win streak achievements',
      achievements: achievements.filter(a => a.requirements.type === 'streak')
    },
    {
      id: 'predictions',
      name: 'Predictions',
      icon: Target,
      description: 'Prediction accuracy achievements',
      achievements: achievements.filter(a => a.requirements.type === 'prediction_accuracy')
    },
    {
      id: 'participation',
      name: 'Participation',
      icon: Shield,
      description: 'Arena participation achievements',
      achievements: achievements.filter(a => a.requirements.type === 'participation')
    },
    {
      id: 'rewards',
      name: 'Rewards',
      icon: Gift,
      description: 'Reward-based achievements',
      achievements: achievements.filter(a => a.requirements.type === 'rewards')
    }
  ];

  const handleClaim = async (achievement: Achievement) => {
    if (claimingId || achievement.progress !== 100 || achievement.unlocked) return;
    
    setClaimingId(achievement.id);
    try {
      await onAchievementClaim(achievement.id);
      setUnlockedAchievement(achievement);
      setShowUnlockModal(true);
    } finally {
      setClaimingId(null);
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-500 bg-gray-100';
      case 'rare':
        return 'text-blue-500 bg-blue-100';
      case 'epic':
        return 'text-purple-500 bg-purple-100';
      case 'legendary':
        return 'text-yellow-500 bg-yellow-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Achievement Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-purple-900">Achievements</h2>
            <p className="text-purple-600">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => onNotificationToggle(!user.settings?.notifications?.achievements)}
            className={`p-2 rounded-lg ${
              user.settings?.notifications?.achievements
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Bell size={20} />
          </motion.button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-5 gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-100 ring-2 ring-purple-500'
                  : 'bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <category.icon 
                className="mx-auto mb-2 text-purple-600" 
                size={24} 
              />
              <div className="font-medium text-purple-900">
                {category.name}
              </div>
              <div className="text-sm text-purple-600">
                {category.achievements.filter(a => a.unlocked).length}/
                {category.achievements.length}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievement List */}
      <div className="grid grid-cols-2 gap-6">
        {(selectedCategory === 'all' 
          ? achievements 
          : categories.find(c => c.id === selectedCategory)?.achievements || []
        ).map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl p-6 shadow-lg ${
              achievement.unlocked ? 'border-2 border-purple-200' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                  <achievement.icon size={24} />
                </div>
                <div>
                  <div className="font-medium text-purple-900">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-purple-600">
                    {achievement.description}
                  </div>
                </div>
              </div>

              {achievement.unlocked ? (
                <Award className="text-purple-600" size={24} />
              ) : (
                <Lock className="text-gray-400" size={24} />
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-600">Progress</span>
                <span className="text-purple-900 font-medium">
                  {achievement.progress}%
                </span>
              </div>
              <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  className="h-full bg-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* Rewards */}
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="text-sm font-medium text-purple-900 mb-2">
                Rewards
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-purple-600">
                  <Star size={16} />
                  <span>{achievement.rewards.xp} XP</span>
                </div>
                {achievement.rewards.title && (
                  <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-600 text-sm">
                    {achievement.rewards.title}
                  </div>
                )}
                {achievement.rewards.multiplier && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp size={16} />
                    <span>{achievement.rewards.multiplier}x Multiplier</span>
                  </div>
                )}
              </div>
            </div>

            {/* Claim Button */}
            {achievement.progress === 100 && !achievement.unlocked && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleClaim(achievement)}
                disabled={claimingId === achievement.id}
                className={`w-full mt-4 py-2 rounded-lg font-medium text-white
                  ${claimingId === achievement.id
                    ? 'bg-purple-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {claimingId === achievement.id ? 'Claiming...' : 'Claim Rewards'}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && unlockedAchievement && (
          <UnlockModal
            achievement={unlockedAchievement}
            onClose={() => setShowUnlockModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
