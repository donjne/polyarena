// app/leaderboard/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Crown, Users, 
  TrendingUp, Calendar, Filter 
} from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = React.useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');
  const [category, setCategory] = React.useState<'global' | 'arena' | 'clan'>('global');
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);

  const categories = [
    { id: 'global', label: 'Global Rankings', icon: Trophy },
    { id: 'arena', label: 'Arena Rankings', icon: Medal },
    { id: 'clan', label: 'Clan Wars', icon: Users }
  ];

  const timeframes = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'all', label: 'All Time' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Leaderboard</h1>
          <p className="text-purple-600">Top performers and rankings</p>
        </div>

        {/* Timeframe Selection */}
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <motion.button
              key={tf.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setTimeframe(tf.id as typeof timeframe)}
              className={`px-4 py-2 rounded-lg transition-colors
                ${timeframe === tf.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
            >
              {tf.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-8">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCategory(cat.id as typeof category)}
            className={`px-6 py-3 rounded-xl flex items-center space-x-2
              ${category === cat.id
                ? 'bg-white shadow-lg text-purple-900'
                : 'bg-white/50 text-purple-600 hover:bg-white'
              }`}
          >
            <cat.icon size={20} />
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {entries.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.address}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl p-6 shadow-lg ${
              index === 0 ? 'ring-2 ring-yellow-400' :
              index === 1 ? 'ring-2 ring-gray-400' :
              'ring-2 ring-orange-400'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${
                index === 0 ? 'bg-yellow-100' :
                index === 1 ? 'bg-gray-100' :
                'bg-orange-100'
              }`}>
                {index === 0 ? (
                  <Crown className="text-yellow-600" size={32} />
                ) : (
                  <Medal className={index === 1 ? 'text-gray-600' : 'text-orange-600'} size={32} />
                )}
              </div>
              <div>
                <div className="font-bold text-purple-900 text-lg">
                  {entry.username}
                </div>
                <div className="text-purple-600">
                  Win Rate: {entry.winRate}%
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-purple-600">Total Prize</div>
                  <div className="font-bold text-purple-900">
                    {entry.totalPrize}
                  </div>
                </div>
                <div>
                  <div className="text-purple-600">Position Change</div>
                  <div className={`font-bold ${
                    entry.change > 0 ? 'text-green-600' :
                    entry.change < 0 ? 'text-red-600' :
                    'text-purple-900'
                  }`}>
                    {entry.change > 0 ? `+${entry.change}` :
                     entry.change < 0 ? entry.change :
                     'No change'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-purple-900">Player</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-purple-900">Win Rate</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-purple-900">Total Prize</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-purple-900">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {entries.slice(3).map((entry, index) => (
              <motion.tr
                key={entry.address}
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                className="transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-purple-900">#{index + 4}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-purple-900">{entry.username}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-purple-900">{entry.winRate}%</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-purple-900">{entry.totalPrize}</span>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex justify-center font-medium ${
                    entry.change > 0 ? 'text-green-600' :
                    entry.change < 0 ? 'text-red-600' :
                    'text-purple-900'
                  }`}>
                    {entry.change > 0 ? `+${entry.change}` :
                     entry.change < 0 ? entry.change :
                     '-'}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}