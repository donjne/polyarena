// data/marketCategories.ts
import { 
    Binary, Trophy, TrendingUp, DollarSign, Gamepad, Globe, 
    Star, LineChart, Tv, Gavel, Cpu, Bomb, Music, Film, 
    Award, Users, Building, Network
  } from 'lucide-react';
  import type { MarketCategoryGroup, MarketCategory, MarketTypeMap } from '@/types/market';
  
  export const marketCategories: MarketCategoryGroup[] = [
    {
      title: 'POPULAR MARKETS',
      highlighted: true,
      markets: [
        { 
          id: 'btc-prediction', 
          label: 'BTC Price 30K',
          icon: Binary,
          count: 1243,
          prize: '50,000 USDC',
          trend: '+15%',
          timeLeft: '2H 30M',
          category: 'FINANCIAL',
          type: 'CRYPTO',
          hot: true,
          meta: {
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now(),
            lastActiveAt: Date.now(),
            engagementScore: 95,
            verificationStatus: 'verified',
            engagementStats: {
              views: 15000,
              participants: 1243,
              totalVolume: '500000'
            },
            tags: ['crypto', 'bitcoin', 'price-prediction']
          }
        },
        { 
          id: 'world-cup', 
          label: 'FIFA World Cup Finals',
          icon: Trophy,
          count: 2891,
          prize: '100,000 USDC',
          trend: '+42%',
          timeLeft: '5D',
          category: 'SPORTS',
          type: 'FOOTBALL',
          hot: true,
          meta: {
            createdAt: Date.now() - 172800000,
            updatedAt: Date.now(),
            lastActiveAt: Date.now(),
            engagementScore: 98,
            verificationStatus: 'verified',
            engagementStats: {
              views: 25000,
              participants: 2891,
              totalVolume: '1000000'
            },
            tags: ['sports', 'football', 'world-cup']
          }
        }
      ]
    },
    {
      title: 'FINANCIAL MARKETS',
      markets: [
        {
          id: 'crypto',
          sections: [
            { 
              title: 'CRYPTOCURRENCIES',
              items: [
                { 
                  id: 'btc', 
                  label: 'Bitcoin (BTC)', 
                  count: 23, 
                  hot: true,
                  category: 'FINANCIAL',
                  type: 'CRYPTO',
                  description: 'Bitcoin price and market predictions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 92,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 12000,
                      participants: 890,
                      totalVolume: '250000'
                    },
                    tags: ['crypto', 'bitcoin']
                  }
                },
                { 
                  id: 'eth', 
                  label: 'Ethereum (ETH)', 
                  count: 19, 
                  hot: true,
                  category: 'FINANCIAL',
                  type: 'CRYPTO',
                  description: 'Ethereum ecosystem predictions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 90,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 10000,
                      participants: 750,
                      totalVolume: '200000'
                    },
                    tags: ['crypto', 'ethereum', 'defi']
                  }
                }
              ]
            },
            {
              title: 'DEFI PROTOCOLS',
              items: [
                { 
                  id: 'yields', 
                  label: 'DeFi Yields', 
                  count: 8,
                  category: 'FINANCIAL',
                  type: 'DEFI',
                  description: 'DeFi yield predictions and competitions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 75,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 5000,
                      participants: 320,
                      totalVolume: '100000'
                    },
                    tags: ['defi', 'yields', 'farming']
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'stocks',
          sections: [
            {
              title: 'STOCK MARKETS',
              items: [
                { 
                  id: 'tech-stocks', 
                  label: 'Technology Stocks', 
                  count: 15,
                  category: 'FINANCIAL',
                  type: 'STOCKS',
                  description: 'Tech stock market predictions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 85,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 8000,
                      participants: 450,
                      totalVolume: '150000'
                    },
                    tags: ['stocks', 'tech', 'nasdaq']
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'SPORTS & GAMING',
      markets: [
        {
          id: 'sports',
          sections: [
            {
              title: 'TRADITIONAL SPORTS',
              items: [
                { 
                  id: 'football', 
                  label: 'Football', 
                  count: 45, 
                  hot: true,
                  category: 'SPORTS',
                  type: 'FOOTBALL',
                  description: 'Football match predictions and tournaments',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 94,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 20000,
                      participants: 1500,
                      totalVolume: '300000'
                    },
                    tags: ['sports', 'football', 'soccer']
                  }
                },
                { 
                  id: 'basketball', 
                  label: 'Basketball', 
                  count: 38,
                  category: 'SPORTS',
                  type: 'BASKETBALL',
                  description: 'Basketball match predictions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 88,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 15000,
                      participants: 1200,
                      totalVolume: '250000'
                    },
                    tags: ['sports', 'basketball', 'nba']
                  }
                }
              ]
            },
            {
              title: 'ESPORTS',
              items: [
                { 
                  id: 'league', 
                  label: 'League of Legends', 
                  count: 19, 
                  hot: true,
                  category: 'GAMING',
                  type: 'ESPORTS',
                  description: 'LoL tournament predictions',
                  meta: {
                    createdAt: Date.now() - 43200000,
                    updatedAt: Date.now(),
                    lastActiveAt: Date.now(),
                    engagementScore: 89,
                    verificationStatus: 'verified',
                    engagementStats: {
                      views: 18000,
                      participants: 1300,
                      totalVolume: '280000'
                    },
                    tags: ['gaming', 'esports', 'lol']
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  // Helper functions
  export const getMarketById = (id: string) => {
    for (const category of marketCategories) {
      for (const market of category.markets) {
        if ('sections' in market) {
          for (const section of market.sections) {
            const found = section.items.find(item => item.id === id);
            if (found) return found;
          }
        } else if (market.id === id) {
          return market;
        }
      }
    }
    return null;
  };
  
  export const getAllMarketItems = () => {
    const items = [];
    
    for (const category of marketCategories) {
      for (const market of category.markets) {
        if ('sections' in market) {
          for (const section of market.sections) {
            items.push(...section.items);
          }
        } else {
          items.push(market);
        }
      }
    }
    
    return items;
  };
  
  export const getPopularMarkets = () => 
    marketCategories
      .find(category => category.highlighted)
      ?.markets.filter(market => !('sections' in market)) ?? [];
  
  export const getTrendingMarkets = () =>
    getAllMarketItems()
      .sort((a, b) => b.meta.engagementScore - a.meta.engagementScore)
      .slice(0, 5);
  
  export const getMarketsByCategory = (category: MarketCategory) =>
    getAllMarketItems().filter(item => item.category === category);
  
  export const getMarketsByType = <C extends MarketCategory>(
    category: C,
    type: MarketTypeMap[C]
  ) => getAllMarketItems().filter(
    item => item.category === category && item.type === type
  );
  
  export const getTotalMarketVolume = () =>
    getAllMarketItems().reduce(
      (total, item) => total + parseInt(item.meta.engagementStats.totalVolume),
      0
    );
  
  export const getActiveParticipants = () =>
    getAllMarketItems().reduce(
      (total, item) => total + item.meta.engagementStats.participants,
      0
    );