// components/profile/UserProfile.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Trophy, 
  Shield, Users2, Clock, Activity,
  Settings, Edit
} from 'lucide-react';
import type { UserProfile } from '@/types/user';
import type { Arena } from '@/types/arena';
import { AchievementCard } from './AchievementsCard';
import { StatsCard } from './StatsCard';
import { RecentArenaCard } from './RecentArena';


interface ProfileTabs {
  id: 'overview' | 'achievements' | 'history' | 'settings';
  label: string;
  icon: typeof User;
}

interface UserProfileProps {
  user: UserProfile;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onUpdateSettings?: (settings: Partial<UserProfile>) => Promise<void>;
  recentArenas?: Arena[];
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({
  user,
  isCurrentUser,
  onEditProfile,
  onUpdateSettings,
  recentArenas
}) => {
  const [activeTab, setActiveTab] = React.useState<ProfileTabs['id']>('overview');

  const tabs: ProfileTabs[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'history', label: 'History', icon: Clock },
    ...(isCurrentUser ? [{ id: 'settings', label: 'Settings', icon: Settings }] : [])
  ] as ProfileTabs[];

  const formatXP = (xp: number): string => {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
  };

  const getNextLevelXP = (level: number): number => {
    return Math.floor(1000 * Math.pow(1.5, level - 1));
  };

  const getLevelProgress = (): number => {
    const currentLevelXP = getNextLevelXP(user.level - 1);
    const nextLevelXP = getNextLevelXP(user.level);
    return ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img 
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-white/20 flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
              )}
              {isCurrentUser && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={onEditProfile}
                  className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-white text-purple-600
                           hover:bg-purple-50 transition-colors"
                >
                  <Edit size={16} />
                </motion.button>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {user.clan && (
                  <div className="px-3 py-1 rounded-full bg-white/20 text-sm">
                    {user.clan.name}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Trophy size={16} />
                  <span>{user.stats.wins} Wins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity size={16} />
                  <span>{user.stats.winRate}% Win Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users2 size={16} />
                  <span>{user.stats.totalArenas} Arenas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">Level {user.level}</div>
            <div className="text-white/80">{formatXP(user.xp)} XP</div>
            {/* XP Progress Bar */}
            <div className="w-32 h-2 bg-white/20 rounded-full mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getLevelProgress()}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-medium
              ${activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 hover:bg-purple-50'
              }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 gap-8"
          >
            {/* Stats Overview */}
            <div className="col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <StatsCard
                  title="Total Wins"
                  value={user.stats.wins}
                  icon={Trophy}
                  trend={user.stats.wins > 0 ? '+12%' : undefined}
                />
                <StatsCard
                  title="Win Rate"
                  value={`${user.stats.winRate}%`}
                  icon={Activity}
                  trend={user.stats.winRate > 50 ? '+5%' : undefined}
                />
                <StatsCard
                  title="Average Survival"
                  value={`${user.stats.averageSurvival} rounds`}
                  icon={Shield}
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-purple-900 mb-6">Recent Activity</h3>
                {recentArenas && recentArenas.length > 0 ? (
                  <div className="space-y-4">
                    {recentArenas.map((arena) => (
                      <RecentArenaCard key={arena.id} arena={arena} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-purple-600 py-8">
                    No recent activity
                  </div>
                )}
              </div>
            </div>

            {/* Achievements Showcase */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-purple-900">Latest Achievements</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveTab('achievements')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    View All
                  </motion.button>
                </div>
                <div className="space-y-4">
                {user.achievements.slice(0, 5).map((achievement) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={{
                    ...achievement,
                    earnedAt: achievement.dateUnlocked,
                    xpReward: 100 // You can set a default XP reward or calculate it based on rarity
                  }} 
                />
              ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue with other tabs */}
      </AnimatePresence>
    </div>
  );
};
