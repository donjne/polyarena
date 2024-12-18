// utils/arenaMappers.ts
import type { Arena } from '@/types/arena';
import type { MarketItem } from '@/types/market';

export function mapMarketItemsToArenas(items: MarketItem[]): Arena[] {
  return items.map(item => ({
    id: item.id,
    name: item.label,
    matchType: 'standard' as const,
    predictionScope: mapCategoryToPredictionScope(item.category),
    status: 'active' as const,
    creator: '0x...',
    timestamp: item.meta.createdAt,
    rounds: {
      current: 1,
      total: 5,
      timePerRound: 3600
    },
    players: {
      current: item.meta.engagementStats.participants,
      minimum: 2,
      maximum: 100
    },
    prizeStructure: {
      totalPool: item.meta.engagementStats.totalVolume,
      distribution: [{ position: 1, percentage: 100 }],
      platformFee: 2.5,
      referralReward: 1,
      communityIncentive: 0.5
    },
    entryFee: '10 USDC',
    predictions: {
      type: mapCategoryToPredictionType(item.category),
      ...(item.category === 'FINANCIAL' ? {
        range: {
          min: 0,
          max: 100000
        }
      } : {})
    },
    validationRules: {
      minimumStake: '5 USDC',
      maximumStake: '100 USDC',
      predictionWindow: 300,
      disputePeriod: 3600
    },
    oracle: {
      provider: 'chainlink' as const,
      feedId: 'feed-1',
      updateFrequency: 60,
      minimumConfidence: 0.95
    }
  }));
}

function mapCategoryToPredictionScope(category: string) {
  switch (category) {
    case 'FINANCIAL':
      return 'crypto_price' as const;
    case 'SPORTS':
      return 'sports_outcome' as const;
    default:
      return 'event_result' as const;
  }
}

function mapCategoryToPredictionType(category: string) {
  switch (category) {
    case 'FINANCIAL':
      return 'numeric' as const;
    default:
      return 'binary' as const;
  }
}