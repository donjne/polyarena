import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, Users, Trophy, Wallet, ChevronDown,
  ArrowRight, Clock, Shield, Info, AlertTriangle
} from 'lucide-react';
import type { Arena, MatchType } from '../types/arena';
import type { UserProfile } from '../types/user';

interface ArenaDetailsProps {
  arena: Arena;
  matchType: MatchType;
  currentUser?: UserProfile;
  onEnterArena: (arena: Arena) => void;
  onViewLeaderboard: (arenaId: string) => void;
  onViewRules: (arenaId: string) => void;
}

export const ArenaDetails: React.FC<ArenaDetailsProps> = ({
  arena,
  matchType,
  currentUser,
  onEnterArena,
  onViewLeaderboard,
  onViewRules
}) => {
  const [showRules, setShowRules] = React.useState<boolean>(false);
  
  const canEnter = React.useMemo(() => {
    if (!currentUser) return false;
    if (arena.players.current >= arena.players.maximum) return false;
    if (arena.status !== 'active') return false;
    return true;
  }, [arena, currentUser]);

  const timeRemaining = React.useMemo(() => {
    const now = Date.now();
    const roundEndTime = arena.timestamp + (arena.rounds.timePerRound * 1000);
    const diff = roundEndTime - now;
    
    if (diff <= 0) return 'Round ended';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }, [arena.timestamp, arena.rounds.timePerRound]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-xl">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 p-6">
        <div className="absolute inset-0 bg-[url('/arena-pattern.svg')] opacity-10" />
        
        <div className="relative flex justify-between">
          <div>
            <h2 className="text-2xl font-['Russo_One'] text-white mb-2">{arena.name}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 rounded-lg bg-white/20 text-white">
                {matchType.label}
              </span>
              <span className="text-white/90">
                Round {arena.rounds.current}/{arena.rounds.total}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Timer size={18} />
              <span>Round ends in {timeRemaining}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/80 mb-1">Prize Pool</div>
            <div className="text-2xl font-bold text-white">
              {arena.prizeStructure.totalPool}
            </div>
            <div className="text-white/60 text-sm mt-1">
              {arena.players.current} players joined
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm mb-1">Entry Fee</div>
            <div className="text-xl font-bold text-purple-900">{arena.entryFee}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm mb-1">Time per Round</div>
            <div className="text-xl font-bold text-purple-900">
              {arena.rounds.timePerRound / 60}m
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm mb-1">Min Players</div>
            <div className="text-xl font-bold text-purple-900">
              {arena.players.minimum}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm mb-1">Max Players</div>
            <div className="text-xl font-bold text-purple-900">
              {arena.players.maximum}
            </div>
          </div>
        </div>

        {/* Rules and Info */}
        <motion.div className="mb-8">
          <motion.button
            onClick={() => setShowRules(!showRules)}
            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg text-purple-900"
          >
            <div className="flex items-center space-x-2">
              <Shield size={20} />
              <span className="font-medium">Arena Rules & Information</span>
            </div>
            <ChevronDown 
              className={`transform transition-transform duration-300 ${showRules ? 'rotate-180' : ''}`} 
            />
          </motion.button>

          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-4 text-purple-900"
              >
                <div className="bg-purple-50/50 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Elimination Rules</h4>
                  <p>{matchType.eliminationRules}</p>
                </div>
                
                <div className="bg-purple-50/50 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Scoring Mechanism</h4>
                  <p>{matchType.scoringMechanism}</p>
                </div>
                
                <div className="bg-purple-50/50 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Prize Distribution</h4>
                  <div className="space-y-2">
                    {arena.prizeStructure.distribution.map((tier) => (
                      <div key={tier.position} className="flex justify-between">
                        <span>Position #{tier.position}</span>
                        <span>{tier.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50/50 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Validation Rules</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Minimum Stake</span>
                      <span>{arena.validationRules.minimumStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum Stake</span>
                      <span>{arena.validationRules.maximumStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prediction Window</span>
                      <span>{arena.validationRules.predictionWindow / 60}m</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            disabled={!canEnter}
            onClick={() => onEnterArena(arena)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium shadow-lg 
              ${canEnter
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/20 hover:shadow-purple-500/40'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } transition-all duration-300`}
          >
            {canEnter ? 'Enter Arena' : 'Arena Full'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onViewLeaderboard(arena.id)}
            className="py-3 px-6 rounded-lg border-2 border-purple-500/20 text-purple-600
                     hover:border-purple-500/40 transition-colors"
          >
            View Leaderboard
          </motion.button>
        </div>

        {/* Warnings/Info */}
        {!currentUser && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
            <div className="text-yellow-700">
              Connect your wallet to participate in this arena
            </div>
          </div>
        )}
      </div>
    </div>
  );
};