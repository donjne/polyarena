// app/clan/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users2, Trophy, Star, TrendingUp,
  Shield, Plus, Search, Filter 
} from 'lucide-react';
import type { Clan } from '@/types/community';

export default function ClansPage() {
  const [clans, setClans] = React.useState<Clan[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Clans</h1>
          <p className="text-purple-600">Join a clan or create your own</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {}}
          className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium 
                   flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Clan</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clans..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-purple-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
            size={20}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {}}
          className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
        >
          <Filter size={20} />
        </motion.button>
      </div>

      {/* Clans Grid */}
      <div className="grid grid-cols-3 gap-6">
        {clans.map((clan) => (
          <motion.div
            key={clan.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Clan Banner */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
              {clan.verified && (
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg">
                  <Shield className="text-blue-500" size={20} />
                </div>
              )}
            </div>

            {/* Clan Info */}
            <div className="px-6 pb-6">
              <div className="relative flex items-center -mt-8 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white p-2">
                  <div className="w-full h-full rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users2 className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-purple-900">{clan.name}</h3>
                  <div className="text-sm text-purple-600">
                    {clan.members.length} members
                  </div>
                </div>
              </div>

              <p className="text-purple-600 text-sm mb-4 line-clamp-2">
                {clan.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-purple-600">Win Rate</div>
                  <div className="font-bold text-purple-900">
                    {clan.stats.winRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-600">Total Wins</div>
                  <div className="font-bold text-purple-900">
                    {clan.stats.totalWins}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-purple-600">Rank</div>
                  <div className="font-bold text-purple-900">
                    #{clan.rank}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-purple-600">
                  <Trophy size={16} />
                  <span>Level {clan.requirements.minLevel}+</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <Star size={16} />
                  <span>{clan.requirements.minWinRate}% Win Rate</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}