// types/market.ts

import type { LucideIcon } from 'lucide-react';

// Market Categories and Types
export type MarketCategory = 
  | 'FINANCIAL' 
  | 'SPORTS'
  | 'GAMING'
  | 'ENTERTAINMENT'
  | 'POLITICS'
  | 'TECHNOLOGY';

export interface MarketTypeMap {
  FINANCIAL: 'CRYPTO' | 'STOCKS' | 'FOREX' | 'COMMODITIES' | 'DEFI';
  SPORTS: 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'CRICKET';
  GAMING: 'ESPORTS' | 'STREAMING' | 'RELEASES';
  ENTERTAINMENT: 'MOVIES' | 'MUSIC' | 'TV' | 'CELEBRITIES';
  POLITICS: 'ELECTIONS' | 'POLICY' | 'GOVERNANCE';
  TECHNOLOGY: 'SOFTWARE' | 'HARDWARE' | 'AI' | 'WEB3';
}

export type MarketType = MarketTypeMap[MarketCategory];
export type MarketTypesByCategory<C extends MarketCategory> = MarketTypeMap[C];

// Market Status and Size
export type MarketStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';
export type MarketSize = 'small' | 'medium' | 'large';

// Navigation
export type NavigationTabId = 'all' | 'trending' | 'favorites' | 'recent';

export interface NavigationTab {
  id: NavigationTabId;
  label: string;
  icon: LucideIcon;
}

// Market Items
export interface MarketBase {
  id: string;
  label: string;
  count: number;
  hot?: boolean;
  category: MarketCategory;
  type: MarketType;
  meta: MarketMeta;
}

export interface MarketItem extends MarketBase {
  description?: string;
  requirements?: MarketRequirements;
}

export interface PopularMarket extends MarketBase {
  icon: LucideIcon;
  prize: string;
  trend: string;
  timeLeft: string;
  featured?: boolean;
}

// Market Structure
export interface MarketSection {
  title: string;
  items: MarketItem[];
}

export interface Market {
  id: string;
  sections: MarketSection[];
}

export interface MarketCategoryGroup {
  title: string;
  highlighted?: boolean;
  markets: (Market | PopularMarket)[];
}

// Market Metadata
export interface MarketMeta {
  createdAt: number;
  updatedAt: number;
  lastActiveAt: number;
  engagementScore: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  engagementStats: {
    views: number;
    participants: number;
    totalVolume: string;
  };
  tags: string[];
}

// Market Requirements
export interface MarketRequirements {
  minParticipants: number;
  minStake: string;
  maxParticipants?: number;
  maxStake?: string;
  startDate?: number;
  endDate?: number;
  restrictions?: {
    geographies?: string[];
    age?: number;
    kyc?: boolean;
  };
}

// Filters and Search
export interface MarketFilter {
  category?: MarketCategory;
  type?: MarketType;
  status?: MarketStatus;
  size?: MarketSize;
  minEngagementScore?: number;
  verificationStatus?: MarketMeta['verificationStatus'];
  timeRange?: {
    start: number;
    end: number;
  };
  tags?: string[];
  search?: string;
}

export interface SearchResult {
  categories: MarketCategoryGroup[];
  totalResults: number;
  filters: MarketFilter;
}

// Creation and Updates
export interface CreateMarketInput {
  label: string;
  description: string;
  category: MarketCategory;
  type: MarketType;
  initialSize: MarketSize;
  requirements: MarketRequirements;
  tags?: string[];
}

export interface UpdateMarketInput extends Partial<CreateMarketInput> {
  id: string;
  meta?: Partial<MarketMeta>;
}

// User Interactions
export interface UserMarketInteraction {
  userId: string;
  marketId: string;
  type: 'view' | 'participate' | 'favorite' | 'share';
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface MarketParticipation {
  userId: string;
  marketId: string;
  stake: string;
  position: 'for' | 'against';
  timestamp: number;
  status: 'active' | 'closed' | 'claimed';
}

// Type Guards
export function isPopularMarket(market: Market | PopularMarket): market is PopularMarket {
  return !('sections' in market);
}

export function isMarketByCategory<C extends MarketCategory>(
  market: MarketBase,
  category: C
): market is MarketBase & { category: C; type: MarketTypesByCategory<C> } {
  return market.category === category;
}