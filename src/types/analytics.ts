// types/analytics.ts

export interface TrendPoint {
    timestamp: number;
    value: number;
    movingAverage: number;
    volatility: number;
    volume: number;
    sentiment: number;
  }
  
  export interface TrendIndicator {
    type: 'support' | 'resistance' | 'breakout' | 'reversal';
    value: number;
    confidence: number;
    description: string;
    enabled?: boolean;
  }
  
  export interface MarketStats {
    totalVolume: string;
    dailyVolume: string;
    activeListings: number;
    uniqueTraders: number;
    averagePrice: string;
    volumeChange: number;
    priceChange: number;
  }
  
  export interface TimeSeriesData {
    timestamp: number;
    volume: number;
    price: number;
    transactions: number;
  }
  
  export interface CategoryPerformance {
    category: string;
    volume: number;
    transactions: number;
    averagePrice: number;
    change: number;
    marketShare: number;
    color: string;
  }
  
  export type TimeframeOption = 'day' | 'week' | 'month' | 'year';