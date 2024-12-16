// types/community.ts

export interface ClanStats {
  totalWins: number;
  averageRank: number;
  activePlayers: number;
  winRate: number;
}

export interface ClanRequirements {
  minLevel: number;
  minWinRate: number;
}

export interface ClanMember {
  address: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  verified?: boolean;
  rank?: number;
  members: ClanMember[];
  stats: ClanStats;
  requirements: ClanRequirements;
}

export interface ClanEvent {
  id: string;
  name: string;
  type: 'tournament' | 'challenge' | 'practice';
  startTime: number;
  endTime: number;
  participants: {
    required: number;
    registered: number;
  };
  prize?: {
    amount: string;
    currency: string;
  };
  status: 'upcoming' | 'active' | 'completed';
  requirements?: {
    minLevel: number;
    minWinRate: number;
  };
}

// Optional - if you need separate types for creation/updates
export type ClanUpdateInput = Partial<Clan>;
export type ClanEventInput = Omit<ClanEvent, 'id' | 'status'>;