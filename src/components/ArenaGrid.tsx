import React from "react";
import { motion } from 'framer-motion';
import type { Arena, MatchTypeId, MarketStatus, PredictionScope } from '../types/arena';
import { ArenaCard } from "./ArenaCard";

interface ArenaGridProps {
    arenas: Arena[];
    onArenaEnter: (arena: Arena) => void;
    onArenaFavorite: (arenaId: string) => void;
    onArenaShare: (arenaId: string) => void;
    favoritedArenas: Set<string>;
    filter?: {
      matchType?: MatchTypeId;
      status?: MarketStatus;
      predictionScope?: PredictionScope;
    };
  }
  
  export const ArenaGrid: React.FC<ArenaGridProps> = ({
    arenas,
    onArenaEnter,
    onArenaFavorite,
    onArenaShare,
    favoritedArenas,
    filter
  }) => {
    const filteredArenas = React.useMemo(() => {
      return arenas.filter(arena => {
        if (filter?.matchType && arena.matchType !== filter.matchType) return false;
        if (filter?.status && arena.status !== filter.status) return false;
        if (filter?.predictionScope && arena.predictionScope !== filter.predictionScope) return false;
        return true;
      });
    }, [arenas, filter]);
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredArenas.map(arena => (
          <ArenaCard
            key={arena.id}
            arena={arena}
            onEnter={onArenaEnter}
            onFavorite={onArenaFavorite}
            onShare={onArenaShare}
            isFavorited={favoritedArenas.has(arena.id)}
          />
        ))}
      </motion.div>
    );
  };