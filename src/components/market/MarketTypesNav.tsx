import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Star, Flame, Globe, History, Binary, Trophy, Users, 
  Gamepad, TrendingUp, Target, Sword, Brackets 
} from 'lucide-react';
import { marketCategories, getAllMarketItems, getTrendingMarkets } from '../../data/marketCategories';
import { ArenaGrid } from '@/components/ArenaGrid';
import type { Arena, MatchType } from '@/types/arena';
import { useCallback, useMemo } from 'react';

// Navigation tab type with counter
interface NavigationTab {
  id: 'all' | 'trending' | 'favorites' | 'recent';
  label: string;
  icon: React.ElementType;
  count?: number;
}

// Match types with proper categorization
const matchTypes: MatchType[] = [
  {
    id: 'standard',
    label: 'Standard',
    icon: Sword,
    description: 'Head-to-head prediction battles',
    rounds: 'fixed',
    eliminationRules: 'single elimination',
    scoringMechanism: 'elimination',
    winners: 'single winner',
    minPlayers: 2,
    maxPlayers: 2
  },
  {
    id: 'tournament',
    label: 'Tournament',
    icon: Trophy,
    description: 'Bracketed tournament format',
    rounds: 'variable',
    eliminationRules: 'bracket elimination',
    scoringMechanism: 'bracket',
    winners: 'tiered prizes',
    minPlayers: 8,
    maxPlayers: 32
  },
  {
    id: 'group',
    label: 'Group',
    icon: Users,
    description: 'Group-based competitions',
    rounds: 'fixed',
    eliminationRules: 'group stage',
    scoringMechanism: 'group_points',
    winners: 'top performers',
    minPlayers: 4,
    maxPlayers: 16
  },
  {
    id: 'double_elim',
    label: 'Double Elimination',
    icon: Brackets,
    description: 'Double elimination tournament',
    rounds: 'variable',
    eliminationRules: 'double elimination',
    scoringMechanism: 'double_chance',
    winners: 'bracket winner',
    minPlayers: 4,
    maxPlayers: 16
  }
];

export default function ArenasPage() {
  // State management
  const [activeTab, setActiveTab] = React.useState<NavigationTab['id']>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedMatchType, setSelectedMatchType] = React.useState<string | null>(null);
  const [favoritedArenas, setFavoritedArenas] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentArenas] = React.useState<Set<string>>(new Set()); // Would normally be persisted

  // Navigation tabs with dynamic counts
  const navigationTabs: NavigationTab[] = useMemo(() => [
    { id: 'all', label: 'All Markets', icon: Globe },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoritedArenas.size },
    { id: 'recent', label: 'Recent', icon: History, count: recentArenas.size }
  ], [favoritedArenas.size, recentArenas.size]);

  // Get main categories from market categories data
  const mainCategories = useMemo(() => marketCategories.map(category => ({
    id: category.title.toLowerCase().replace(/\s+/g, '-'),
    title: category.title,
    count: category.markets.length,
    highlighted: category.highlighted
  })), []);

  // Filter arenas based on active filters
// Filter arenas based on active filters
const filteredArenas = useMemo(() => {
  let arenas: Arena[] = getAllMarketItems().map(item => ({
    id: item.id,
    name: item.label,
    matchType: 'standard' as const,  // Using const assertion
    predictionScope: item.category === 'FINANCIAL' ? 'crypto_price' : 
                    item.category === 'SPORTS' ? 'sports_outcome' : 
                    'event_result',   // Properly mapping categories to predictionScope
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
      type: item.category === 'FINANCIAL' ? 'numeric' as const : 
            'binary' as const  // Using const assertion and proper type based on category
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

  // Apply filters based on active tab
  switch (activeTab) {
    case 'trending':
      arenas = arenas.sort((a, b) => 
        b.players.current - a.players.current
      ).slice(0, 10);
      break;
    case 'favorites':
      arenas = arenas.filter(arena => favoritedArenas.has(arena.id));
      break;
    case 'recent':
      arenas = arenas.filter(arena => recentArenas.has(arena.id));
      break;
  }

  // Apply category and match type filters
  if (selectedCategory) {
    arenas = arenas.filter(arena => 
      arena.predictionScope.toLowerCase().includes(selectedCategory)
    );
  }
  if (selectedMatchType) {
    arenas = arenas.filter(arena => arena.matchType === selectedMatchType);
  }

  return arenas;
}, [activeTab, selectedCategory, selectedMatchType, favoritedArenas, recentArenas]);

  // Event handlers
  const handleArenaEnter = useCallback((arena: Arena) => {
    window.location.href = `/arenas/${arena.id}`;
  }, []);

  const handleArenaFavorite = useCallback((arenaId: string) => {
    setFavoritedArenas(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(arenaId)) {
        newFavorites.delete(arenaId);
      } else {
        newFavorites.add(arenaId);
      }
      return newFavorites;
    });
  }, []);

  const handleArenaShare = useCallback((arenaId: string) => {
    // Implement share functionality
    console.log('Share arena:', arenaId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Main Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 overflow-x-auto hide-scrollbar">
            <div className="flex items-center space-x-8">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-600 text-white">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Prediction Arenas</h1>
          <p className="text-lg text-purple-600">Compete in prediction challenges and win rewards</p>
        </div>

        {/* Market Categories */}
        <div className="mb-6">
          <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="min-w-max">
              <div className="flex space-x-4">
                {mainCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
                      ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : category.highlighted 
                          ? 'bg-white text-purple-600 shadow-md hover:shadow-lg'
                          : 'bg-white/50 text-purple-600 hover:bg-white'
                      }`}
                  >
                    <span>{category.title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full 
                      ${selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Match Type Filters */}
        <div className="mb-8">
          <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="min-w-max">
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMatchType(null)}
                  className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
                    ${!selectedMatchType
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white/50 text-purple-600 hover:bg-white'
                    }`}
                >
                  <span>ALL TYPES</span>
                </motion.button>

                {matchTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMatchType(
                      selectedMatchType === type.id ? null : type.id
                    )}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
                      ${selectedMatchType === type.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/50 text-purple-600 hover:bg-white'
                      }`}
                  >
                    <type.icon size={20} />
                    <span>{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Arenas Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ArenaGrid
                arenas={filteredArenas}
                onArenaEnter={handleArenaEnter}
                onArenaFavorite={handleArenaFavorite}
                onArenaShare={handleArenaShare}
                favoritedArenas={favoritedArenas}
              />
              
              {filteredArenas.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">No arenas found</h3>
                  <p className="text-purple-600">Try adjusting your filters or check back later</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}