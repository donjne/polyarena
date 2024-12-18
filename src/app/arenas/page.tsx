// app/arenas/page.tsx
'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavigationTabs } from '@/components/market/NavigationTabs';
import { MarketCategories } from '@/components/market/MarketCategories';
import { MatchTypeFilters } from '@/components/market/MatchTypeFilters';
import { ArenaGrid } from '@/components/ArenaGrid';
import { LoadingSpinner } from '@/components/market/LoadingSpinner';
import { EmptyState } from '@/components/market/EmptyState';
import { marketCategories, getAllMarketItems } from '@/data/marketCategories';
import { matchTypes } from '@/data/matchTypes';
import { mapMarketItemsToArenas } from '@/utils/arenaMappers';
import type { Arena, MatchTypeId } from '@/types/arena';
import type { NavigationTab } from '@/types/navigation';

export default function ArenasPage() {
  // State management
  const [activeTab, setActiveTab] = React.useState<NavigationTab['id']>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedMatchType, setSelectedMatchType] = React.useState<MatchTypeId | null>(null);
  const [favoritedArenas, setFavoritedArenas] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentArenas] = React.useState<Set<string>>(new Set());

  // Filter arenas based on active filters
  const filteredArenas = React.useMemo(() => {
    // Start with base arenas mapped from market items
    let arenas = mapMarketItemsToArenas(getAllMarketItems());
    
    // Apply filters based on active tab
    switch (activeTab) {
      case 'trending':
        arenas = arenas
          .sort((a, b) => b.players.current - a.players.current)
          .slice(0, 10);
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
  const handleArenaEnter = React.useCallback((arena: Arena) => {
    window.location.href = `/arenas/${arena.id}`;
  }, []);

  const handleArenaFavorite = React.useCallback((arenaId: string) => {
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

  const handleArenaShare = React.useCallback((arenaId: string) => {
    // Implement share functionality
    console.log('Share arena:', arenaId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <NavigationTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritedCount={favoritedArenas.size}
        recentCount={recentArenas.size}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Prediction Arenas</h1>
          <p className="text-lg text-purple-600">Compete in prediction challenges and win rewards</p>
        </div>

        {/* Categories and Filters */}
        <div className="space-y-6 mb-8">
          <MarketCategories 
            categories={marketCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <MatchTypeFilters
            selectedType={selectedMatchType}
            onTypeSelect={setSelectedMatchType}
            matchTypes={matchTypes}
          />
        </div>

        {/* Arenas Grid with Loading */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSpinner />
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
                <EmptyState />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}