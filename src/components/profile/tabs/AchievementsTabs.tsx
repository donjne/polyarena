// components/profile/tabs/AchievementsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Medal, Crown, Shield,
  Lock, CheckCircle
} from 'lucide-react';
import type { UserAchievement } from '@/types/user';

interface AchievementsTabProps {
  achievements: UserAchievement[];
  unlockedCount: number;
  totalCount: number;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievements,
  unlockedCount,
  totalCount
}) => {
  const [selectedRarity, setSelectedRarity] = React.useState<UserAchievement['rarity'] | 'all'>('all');

  const categories = [
    { id: 'wins', label: 'Victories', icon: Trophy },
    { id: 'survival', label: 'Survival', icon: Shield },
    { id: 'prediction', label: 'Predictions', icon: Star },
    { id: 'special', label: 'Special', icon: Crown }
  ];

  const rarityColors = {
    common: 'text-gray-500 bg-gray-100',
    rare: 'text-blue-500 bg-blue-100',
    epic: 'text-purple-500 bg-purple-100',
    legendary: 'text-yellow-500 bg-yellow-100'
  };

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-purple-900">Achievement Progress</h3>
            <p className="text-purple-600">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="#E2E8F0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="#8B5CF6"
                strokeWidth="8"
                strokeDasharray={`${(unlockedCount / totalCount) * 377} 377`}
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round((unlockedCount / totalCount) * 100)}%
                </div>
                <div className="text-sm text-purple-600">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rarity Distribution */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(rarityColors).map(([rarity, colors]) => (
            <motion.button
              key={rarity}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedRarity(rarity as UserAchievement['rarity'])}
              className={`p-4 rounded-lg ${colors} bg-opacity-20 
                ${selectedRarity === rarity ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
            >
              <div className="text-center">
                <div className="font-medium capitalize">{rarity}</div>
                <div className="text-sm">
                  {achievements.filter(a => a.rarity === rarity).length} total
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Achievement Categories */}
      {categories.map((category) => {
        const categoryAchievements = achievements.filter(a => 
          (selectedRarity === 'all' || a.rarity === selectedRarity)
        );

        return categoryAchievements.length > 0 ? (
          <div key={category.id} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <category.icon className="text-purple-600" size={24} />
              <h3 className="text-lg font-bold text-purple-900">{category.label}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {categoryAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border-2 
                    ${achievement.dateUnlocked
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${rarityColors[achievement.rarity]}`}>
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

                    {achievement.dateUnlocked ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <Lock className="text-gray-400" size={20} />
                    )}
                  </div>

                  {achievement.dateUnlocked && (
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-sm text-purple-600">
                        Unlocked on {new Date(achievement.dateUnlocked).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};
