export interface LeaderboardEntry {
    address: string;
    username: string;
    rank: number;
    score: number;
    winRate: number;
    totalPrize: string;
    change: number; // Position change
  }
  

export interface Leaderboard {
    id: string;
    type: 'global' | 'arena' | 'match_type' | 'weekly' | 'monthly';
    entries: LeaderboardEntry[];
    lastUpdated: number;
  }