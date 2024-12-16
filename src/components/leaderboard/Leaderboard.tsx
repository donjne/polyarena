// components/leaderboard/Leaderboard.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Crown, TrendingUp, 
  ChevronUp, ChevronDown, Users, Filter, 
  Clock, ArrowRight, Star
} from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard';
import type { MatchType } from '@/types/arena';

interface LeaderboardProps {
  type: 'global' | 'arena' | 'match_type' | 'weekly' | 'monthly';
  data: LeaderboardEntry[];
  matchTypes?: MatchType[];
  onPeriodChange?: (period: 'weekly' | 'monthly' | 'all-time') => void;
  onMatchTypeChange?: (matchType: MatchType['id']) => void;
  onViewProfile: (address: string) => void;
}

interface LeaderboardFilter {
  period: 'weekly' | 'monthly' | 'all-time';
  matchType?: MatchType['id'];
  minWinRate?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  type,
  data,
  matchTypes,
  onPeriodChange,
  onMatchTypeChange,
  onViewProfile
}) => {
  const [filter, setFilter] = React.useState<LeaderboardFilter>({
    period: 'all-time'
  });

  const [showFilters, setShowFilters] = React.useState(false);

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return {
          icon: Crown,
          className: 'text-yellow-500 bg-yellow-100',
          size: 24
        };
      case 2:
        return {
          icon: Medal,
          className: 'text-gray-400 bg-gray-100',
          size: 20
        };
      case 3:
        return {
          icon: Medal,
          className: 'text-orange-500 bg-orange-100',
          size: 20
        };
      default:
        return null;
    }
  };

  const getRankChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ChevronUp size={16} />
          <span>{change}</span>
        </div>
      );
    }
    if (change < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ChevronDown size={16} />
          <span>{Math.abs(change)}</span>
        </div>
      );
    }
    return <span className="text-purple-600">-</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Trophy className="text-purple-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-purple-900">
                {type === 'global' ? 'Global Rankings' :
                 type === 'arena' ? 'Arena Rankings' :
                 type === 'match_type' ? 'Match Type Rankings' :
                 'Time Period Rankings'}
              </h2>
              <p className="text-purple-600">
                {filter.period === 'weekly' ? 'This Week' :
                 filter.period === 'monthly' ? 'This Month' :
                 'All Time'}
              </p>
            </div>
          </div>

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

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-purple-100"
            >
              <div className="grid grid-cols-3 gap-6">
                {/* Time Period */}
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">
                    Time Period
                  </label>
                  <select
                    value={filter.period}
                    onChange={(e) => {
                      const period = e.target.value as LeaderboardFilter['period'];
                      setFilter({ ...filter, period });
                      onPeriodChange?.(period);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>

                {/* Match Type Filter */}
                {matchTypes && (
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Match Type
                    </label>
                    <select
                      value={filter.matchType || ''}
                      onChange={(e) => {
                        const matchType = e.target.value as MatchType['id'] | undefined;
                        setFilter({ ...filter, matchType });
                        onMatchTypeChange?.(matchType as MatchType['id']);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Types</option>
                      {matchTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Min Win Rate */}
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">
                    Minimum Win Rate
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filter.minWinRate || ''}
                    onChange={(e) => setFilter({
                      ...filter,
                      minWinRate: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Min %"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">Player</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-purple-900">Win Rate</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-purple-900">Total Prize</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-purple-900">Change</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-purple-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {data.map((entry) => {
              const positionStyle = getPositionStyle(entry.rank);
              return (
                <motion.tr
                  key={entry.address}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {positionStyle ? (
                        <div className={`p-1 rounded-lg ${positionStyle.className}`}>
                          <positionStyle.icon size={positionStyle.size} />
                        </div>
                      ) : (
                        <span className="text-purple-900 font-medium">#{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-purple-900">{entry.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-purple-900">
                      {entry.winRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-purple-900">
                      {entry.totalPrize}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {getRankChange(entry.change)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onViewProfile(entry.address)}
                        className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
                      >
                        <ArrowRight size={20} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};