// components/profile/tabs/HistoryTab.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Trophy, Target, TrendingUp, Filter,
  Calendar, ChevronDown, ArrowRight, Shield,
  CheckCircle, XCircle
} from 'lucide-react';
import type { Arena, MatchType } from '@/types/arena';

interface ArenaHistory extends Arena {
  result: 'win' | 'loss';
  position: number;
  reward?: string;
  predictions: {
    type: 'binary' | 'numeric' | 'multi_choice';
    options?: string[];
    range?: {
      min: number;
      max: number;
    };
  }
}

interface HistoryTabProps {
  arenas: ArenaHistory[];
  stats: {
    totalArenas: number;
    winRate: number;
    averagePosition: number;
    totalRewards: string;
    bestStreak: number;
    predictionAccuracy: number;
    matchTypePerformance: Record<MatchType['id'], {
      played: number;
      winRate: number;
      averageReward: string;
    }>;
  };
  onViewArena: (arenaId: string) => void;
}

interface HistoryFilter {
  matchType?: MatchType['id'];
  result?: 'win' | 'loss';
  timeRange?: 'day' | 'week' | 'month' | 'all';
  minReward?: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  arenas,
  stats,
  onViewArena
}) => {
  const [filter, setFilter] = React.useState<HistoryFilter>({
    timeRange: 'all'
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedArena, setSelectedArena] = React.useState<string | null>(null);

  const filteredArenas = React.useMemo(() => {
    return arenas.filter(arena => {
      if (filter.matchType && arena.matchType !== filter.matchType) return false;
      if (filter.result && arena.result !== filter.result) return false;
      if (filter.minReward && arena.reward && 
          parseFloat(arena.reward) < filter.minReward) return false;
      
      if (filter.timeRange) {
        const now = Date.now();
        const arenaTime = arena.timestamp;
        switch (filter.timeRange) {
          case 'day':
            return (now - arenaTime) < 24 * 60 * 60 * 1000;
          case 'week':
            return (now - arenaTime) < 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return (now - arenaTime) < 30 * 24 * 60 * 60 * 1000;
        }
      }
      
      return true;
    });
  }, [arenas, filter]);

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="text-purple-600" size={24} />
            <span className="text-purple-600">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600 mt-1">
            {stats.totalArenas} total arenas
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Target className="text-purple-600" size={24} />
            <span className="text-purple-600">Prediction Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.predictionAccuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600 mt-1">
            Best streak: {stats.bestStreak}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="text-purple-600" size={24} />
            <span className="text-purple-600">Average Position</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            #{stats.averagePosition}
          </div>
          <div className="text-sm text-purple-600 mt-1">
            Top 3 finishes: {arenas.filter(a => a.position <= 3).length}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Rewards</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalRewards}
          </div>
          <div className="text-sm text-purple-600 mt-1">
            Average per win: {(parseFloat(stats.totalRewards) / 
              arenas.filter(a => a.result === 'win').length).toFixed(2)}
          </div>
        </motion.div>
      </div>

      {/* Match Type Performance */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-purple-900 mb-6">Performance by Match Type</h3>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(stats.matchTypePerformance).map(([type, performance]) => (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-purple-50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-purple-900 capitalize">{type}</span>
                <span className="text-sm text-purple-600">
                  {performance.played} played
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Win Rate</span>
                  <span className="font-medium text-purple-900">
                    {performance.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Avg. Reward</span>
                  <span className="font-medium text-purple-900">
                    {performance.averageReward}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Arena History */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-purple-900">Arena History</h3>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2
                ${showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-600'
                }`}
            >
              <Filter size={20} />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 pb-6 border-b border-purple-100"
            >
              {/* Filter implementation continues... */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arena List */}
        <div className="space-y-4">
          {filteredArenas.map((arena) => (
            <motion.div
              key={arena.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border-2 transition-colors
                ${arena.result === 'win'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {arena.result === 'win' ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                  <div>
                    <div className="font-medium text-purple-900">
                      {arena.name}
                    </div>
                    <div className="text-sm text-purple-600">
                      {new Date(arena.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="font-medium text-purple-900">
                      Position #{arena.position}
                    </div>
                    {arena.reward && (
                      <div className={`text-sm ${
                        arena.result === 'win' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {arena.result === 'win' ? '+' : '-'}{arena.reward}
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onViewArena(arena.id)}
                    className="p-2 rounded-lg bg-purple-100 text-purple-600
                             hover:bg-purple-200 transition-colors"
                  >
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};