// components/clan/ClanDashboard.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, Trophy, TrendingUp, Shield, Crown, 
  UserPlus, Settings, ArrowRight, Star, Flag 
} from 'lucide-react';
import type { UserProfile } from '@/types/user';
import { Clan, ClanUpdateInput } from '@/types/community';

interface ClanDashboardProps {
  clan: Clan;
  members: UserProfile[];
  onInviteMember: (address: string) => void;
  onRemoveMember: (address: string) => void;
  onPromoteMember: (address: string) => void;
  onUpdateSettings: (settings: ClanUpdateInput) => Promise<boolean>;
  onCreateEvent: () => void;
}

export const ClanDashboard: React.FC<ClanDashboardProps> = ({
  clan,
  members,
  onInviteMember,
  onRemoveMember,
  onPromoteMember,
  onUpdateSettings,
  onCreateEvent
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'members' | 'events' | 'settings'>(
    'overview'
  );
  const [inviteAddress, setInviteAddress] = React.useState('');

  const membersByRole = React.useMemo(() => {
    return members.reduce((acc, member) => {
      const role = member.clan?.role || 'member';
      acc[role] = [...(acc[role] || []), member];
      return acc;
    }, {} as Record<string, UserProfile[]>);
  }, [members]);

  return (
    <div className="space-y-8">
      {/* Clan Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Flag size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{clan.name}</h1>
              <p className="text-white/80">{clan.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{members.length}</div>
              <div className="text-white/80">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{clan.stats.totalWins}</div>
              <div className="text-white/80">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{clan.stats.averageRank}</div>
              <div className="text-white/80">Avg. Rank</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'members', label: 'Members', icon: Users2 },
            { id: 'events', label: 'Events', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Clan Stats */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-purple-900">Clan Stats</h3>
                <TrendingUp className="text-purple-600" size={24} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Win Rate</span>
                  <span className="font-bold text-purple-900">
                    {((clan.stats.totalWins / clan.stats.activePlayers) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Active Players</span>
                  <span className="font-bold text-purple-900">
                    {clan.stats.activePlayers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Average Rank</span>
                  <span className="font-bold text-purple-900">
                    #{clan.stats.averageRank}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-purple-900">Requirements</h3>
                <Shield className="text-purple-600" size={24} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Minimum Level</span>
                  <span className="font-bold text-purple-900">
                    {clan.requirements.minLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Minimum Win Rate</span>
                  <span className="font-bold text-purple-900">
                    {clan.requirements.minWinRate}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Invite Member */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Invite Member</h3>
                <UserPlus className="text-purple-600" size={24} />
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inviteAddress}
                  onChange={(e) => setInviteAddress(e.target.value)}
                  placeholder="Enter wallet address..."
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    onInviteMember(inviteAddress);
                    setInviteAddress('');
                  }}
                  className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium
                           hover:bg-purple-700 transition-colors"
                >
                  Invite
                </motion.button>
              </div>
            </div>

            {/* Member List */}
            <div className="space-y-6">
              {['owner', 'admin', 'member'].map((role) => (
                <div key={role} className="space-y-4">
                  <h4 className="text-lg font-medium text-purple-900 capitalize">
                    {role}s {membersByRole[role]?.length ? `(${membersByRole[role].length})` : ''}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {membersByRole[role]?.map((member) => (
                      <motion.div
                        key={member.address}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-4 shadow-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          {role === 'owner' && (
                            <Crown className="text-yellow-500" size={20} />
                          )}
                          <div>
                            <div className="font-medium text-purple-900">
                              {member.username}
                            </div>
                            <div className="text-sm text-purple-600">
                              Win Rate: {member.stats.winRate}%
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {role !== 'owner' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => onPromoteMember(member.address)}
                              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
                              title="Promote Member"
                            >
                              <Star size={20} />
                            </motion.button>
                          )}
                          
                          {role !== 'owner' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => onRemoveMember(member.address)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                              title="Remove Member"
                            >
                              <UserPlus size={20} />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue with Events and Settings tabs */}
      </AnimatePresence>
    </div>
  );
};
