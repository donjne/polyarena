// app/arenas/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArenaGrid } from '@/components/ArenaGrid';
import { MatchTypeFilters } from '@/components/MatchTypeFilters';
import { MarketTypesNav } from '@/components/market/MarketTypesNav';
import type { Arena, MatchType } from '@/types/arena';

export default function ArenasPage() {
  const [arenas, setArenas] = React.useState<Arena[]>([]);
  const [selectedMatchType, setSelectedMatchType] = React.useState<MatchType['id'] | null>(null);
  const [favoritedArenas, setFavoritedArenas] = React.useState<Set<string>>(new Set());

  const handleArenaEnter = (arena: Arena) => {
    // Navigate to arena detail page
    window.location.href = `/arenas/${arena.id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Prediction Arenas</h1>
          <p className="text-purple-600">Compete in prediction challenges and win rewards</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-6">
          <MarketTypesNav />
          <MatchTypeFilters
            selectedType={selectedMatchType}
            onTypeSelect={setSelectedMatchType}
            matchTypes={[]} // This would come from your data
          />
        </div>

        {/* Arenas Grid */}
        <ArenaGrid
          arenas={arenas}
          onArenaEnter={handleArenaEnter}
          onArenaFavorite={(arenaId) => {
            const newFavorites = new Set(favoritedArenas);
            if (newFavorites.has(arenaId)) {
              newFavorites.delete(arenaId);
            } else {
              newFavorites.add(arenaId);
            }
            setFavoritedArenas(newFavorites);
          }}
          onArenaShare={() => {}}
          favoritedArenas={favoritedArenas}
        />
      </div>
    </div>
  );
}