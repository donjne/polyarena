// components/leaderboard/LeaderboardStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Users, Target, 
  DollarSign 
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { LeaderboardEntry } from '@/types/leaderboard';
import type { MatchType } from '@/types/arena';

interface LeaderboardStats {
  totalParticipants: number;
  totalPrizePool: string;
  averageWinRate: number;
  topPerformers: {
    matchType: MatchType['id'];
    count: number;
    averageReturn: number;
  }[];
  timeline: {
    date: string;
    participants: number;
    averageWinRate: number;
    totalPrize: number;
  }[];
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

interface LeaderboardStatsProps {
  stats: LeaderboardStats;
  period: 'weekly' | 'monthly' | 'all-time';
  onPeriodChange: (period: 'weekly' | 'monthly' | 'all-time') => void;
}

export const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({
  stats,
  period,
  onPeriodChange
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Users className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Participants</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalParticipants.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Prize Pool</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalPrizePool}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Target className="text-purple-600" size={24} />
            <span className="text-purple-600">Average Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.averageWinRate.toFixed(1)}%
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="text-purple-600" size={24} />
            <span className="text-purple-600">Best Performing Type</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.topPerformers[0]?.matchType}
          </div>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-purple-900">Performance Timeline</h3>
            <p className="text-purple-600">Participation and win rates over time</p>
          </div>
          <div className="flex space-x-2">
            {(['weekly', 'monthly', 'all-time'] as const).map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.05 }}
                onClick={() => onPeriodChange(p)}
                className={`px-4 py-2 rounded-lg font-medium
                  ${period === p
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-600'
                  }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="participants"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                name="Participants"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageWinRate"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Win Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-purple-900">Win Rate Distribution</h3>
            <p className="text-purple-600">Player performance breakdown</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="range" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip />
              <Bar
                dataKey="percentage"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                name="Players %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Match Type Performance */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-purple-900 mb-6">Match Type Performance</h3>
        <div className="space-y-4">
          {stats.topPerformers.map((performer, index) => (
            <div
              key={performer.matchType}
              className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${index === 0 ? 'bg-yellow-100' :
                    index === 1 ? 'bg-gray-100' :
                    index === 2 ? 'bg-orange-100' : 'bg-purple-100'}`}
                >
                  <span className="font-bold text-purple-900">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-purple-900">{performer.matchType}</div>
                  <div className="text-sm text-purple-600">
                    {performer.count} players
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-purple-900">
                  {performer.averageReturn.toFixed(1)}x
                </div>
                <div className="text-sm text-purple-600">
                  Avg. Return
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};