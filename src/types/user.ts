import type { LucideIcon } from 'lucide-react';

export interface UserStats {
    wins: number;
    topFinishes: number;
    correctPredictions: number;
    averageSurvival: number;
    winRate: number;
    totalArenas: number;
    favorites: string[];
    recentArenas: string[];
  }
  
  export interface UserAchievement {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    dateUnlocked: number; 
    earnedAt: number;     
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;  
  }
  
  export interface UserProfile {
    address: string;
    username: string;
    avatar?: string;
    stats: UserStats;
    achievements: UserAchievement[];
    level: number;
    xp: number;
    rank?: number;
    clan?: {
      id: string;
      name: string;
      role: 'member' | 'admin' | 'owner';
    };
    settings: UserSettings;   
  }

  export interface NotificationSettings {
    arenaStart: boolean;
    roundEnd: boolean;
    predictions: boolean;
    rewards: boolean;
    mentions: boolean;
    clanEvents: boolean;
    achievements: boolean;
  }
  
  export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showStats: boolean;
    showHistory: boolean;
    showRewards: boolean;
  }
  
  export interface UserSettings {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
  }