// app/profile/page.tsx
'use client';

import React from 'react';
import { UserProfileComponent } from '@/components/profile/UserProfile';
import { UserInventory } from '@/components/inventory/UserInventory';
import { AchievementSystem } from '@/components/achievements/AchievementSystem';
import { PredictionStats } from '@/components/prediction/PredictionStats';
import { PredictionHistory } from '@/components/prediction/PredictionHistory';
import { AchievementsTab } from '@/components/profile/tabs/AchievementsTabs';
import { HistoryTab } from '@/components/profile/tabs/HistoryTab';
import { SettingsTab } from '@/components/profile/tabs/SettingsTab';
import type { UserProfile } from '@/types/user';
import type { Arena } from '@/types/arena';
import type { InventoryItem } from '@/components/inventory/UserInventory';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<'inventory' | 'achievements' | 'stats' | 'history'>('inventory');
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [recentArenas, setRecentArenas] = React.useState<Arena[]>([]);

  // Fetch user profile and data
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const [profileRes, arenasRes] = await Promise.all([
        //   // fetch('/api/user/profile'),
        //   // fetch('/api/user/arenas')
        //   console.log("fetched")
        // ]);

        // const [profileData, arenasData] = await Promise.all([
        //   profileRes.json(),
        //   arenasRes.json()
        // ]);

        // setUserProfile(profileData);
        // setRecentArenas(arenasData);
        console.log("fetched")
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateSettings = async (settings: Partial<UserProfile>) => {
    try {
      // const response = await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      //}
    // );

      // if (!response.ok) throw new Error('Failed to update settings');
      
      // const updatedProfile = await response.json();
      // setUserProfile(updatedProfile);
      console.log("done")
    } catch (error) {
      throw new Error('Failed to update settings');
    }
  };

  const handleEditProfile = () => {
    // Implement edit profile logic
  };

  if (!userProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-purple-100 rounded-xl" />
          <div className="h-24 bg-purple-100 rounded-xl" />
          <div className="h-96 bg-purple-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {userProfile && (
        <>
          {/* Profile Header */}
          <UserProfileComponent
            user={userProfile}
            isCurrentUser={true}
            onEditProfile={handleEditProfile}
            onUpdateSettings={handleUpdateSettings}
            recentArenas={recentArenas}
          />

          {/* Content Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === 'inventory' && (
              <UserInventory
                items={[]}
                stats={{
                  totalItems: 0,
                  equippedItems: 0,
                  tradeableItems: 0,
                  totalValue: '$0'
                }}
                onEquip={(item: InventoryItem) => {}}
                onUnequip={(item: InventoryItem) => {}}
                onList={(item: InventoryItem) => {}}
                onView={(item: InventoryItem) => {}}
                onTransfer={(item: InventoryItem) => {}}
              />
            )}

            {activeTab === 'achievements' && (
              <>
                <AchievementSystem
                  user={userProfile}
                  achievements={[]}
                  onAchievementClaim={(achievementId) => Promise.resolve()}
                  onNotificationToggle={() => {}}
                />
                <AchievementsTab
                  achievements={userProfile.achievements}
                  unlockedCount={userProfile.achievements.filter(a => a.dateUnlocked).length}
                  totalCount={userProfile.achievements.length}
                />
              </>
            )}

            {activeTab === 'stats' && (
              <PredictionStats
                stats={{
                  overall: {
                    totalPredictions: 0,
                    winRate: 0,
                    profitLoss: 0,
                    averageStake: 0,
                    bestStreak: 0,
                    currentStreak: 0,
                    totalStaked: 0,
                    totalReturns: 0,
                    averageReturnRate: 0
                  },
                  categoryPerformance: [],
                  recentActivity: []
                }}
                onPeriodChange={() => { } }
                selectedPeriod="month" userAddress={''}              />
            )}

            {activeTab === 'history' && (
              <>
                <PredictionHistory
                  predictions={recentArenas.map(arena => ({
                    id: `prediction-${arena.id}`, // Generate unique ID
                    arenaId: arena.id,
                    timestamp: arena.timestamp,
                    predictedValue: '', // Add actual prediction value
                    actualValue: '', // Add actual outcome value
                    status: 'pending', // Determine based on arena result
                    stake: '0', // Add actual stake amount
                    reward: '0', // Add actual reward amount
                    type: 'binary' // Add actual prediction type from arena
                  }))}
                  onViewArena={() => {}}
                  onFilterChange={(filters) => {
                    // Handle filter changes
                    console.log('Filter changed:', filters);
                  }}
                />
                <HistoryTab
                  arenas={recentArenas as any}
                  stats={{
                    totalArenas: userProfile.stats.totalArenas,
                    winRate: userProfile.stats.winRate,
                    averagePosition: 0,
                    totalRewards: '$0',
                    bestStreak: 0,
                    predictionAccuracy: 0,
                    matchTypePerformance: {
                      standard: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      },
                      tournament: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      },
                      survivor: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      },
                      group: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      },
                      points_based: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      },
                      double_elim: {
                        played: 0,
                        winRate: 0,
                        averageReward: ''
                      }
                    }
                  }}
                  onViewArena={() => {}}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}