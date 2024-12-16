// components/achievements/UnlockModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Gift, Crown, 
  X, Sparkles, Award
} from 'lucide-react';
import type { Achievement } from './AchievementSystem';

interface UnlockModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  achievement,
  onClose
}) => {
  // Confetti animation ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    // Simulate confetti animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Confetti animation implementation would go here
    // Using a library like canvas-confetti in production
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-purple-600 
                   hover:bg-purple-100 transition-colors z-10"
        >
          <X size={20} />
        </motion.button>

        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            {/* Animated Sparkles */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-4 text-yellow-400"
            >
              <Sparkles size={64} />
            </motion.div>

            <div className="relative">
              <achievement.icon size={64} />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mt-4">Achievement Unlocked!</h2>
            <p className="text-white/80 mt-2">{achievement.title}</p>
          </motion.div>
        </div>

        {/* Achievement Details */}
        <div className="p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Description */}
            <div className="text-center">
              <div className="inline-block px-3 py-1 rounded-full text-sm font-medium
                           bg-purple-100 text-purple-600 capitalize">
                {achievement.rarity}
              </div>
              <p className="mt-2 text-purple-900">{achievement.description}</p>
            </div>

            {/* Rewards */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-purple-900 mb-4">Rewards Earned</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* XP Reward */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-4 flex items-center space-x-3"
                >
                  <Star className="text-yellow-500" size={24} />
                  <div>
                    <div className="font-medium text-purple-900">
                      {achievement.rewards.xp} XP
                    </div>
                    <div className="text-sm text-purple-600">
                      Experience Points
                    </div>
                  </div>
                </motion.div>

                {/* Title Reward */}
                {achievement.rewards.title && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-4 flex items-center space-x-3"
                  >
                    <Crown className="text-purple-500" size={24} />
                    <div>
                      <div className="font-medium text-purple-900">
                        New Title
                      </div>
                      <div className="text-sm text-purple-600">
                        {achievement.rewards.title}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Badge Reward */}
                {achievement.rewards.badge && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-4 flex items-center space-x-3"
                  >
                    <Award className="text-blue-500" size={24} />
                    <div>
                      <div className="font-medium text-purple-900">
                        New Badge
                      </div>
                      <div className="text-sm text-purple-600">
                        {achievement.rewards.badge}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Multiplier Reward */}
                {achievement.rewards.multiplier && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-4 flex items-center space-x-3"
                  >
                    <Gift className="text-green-500" size={24} />
                    <div>
                      <div className="font-medium text-purple-900">
                        {achievement.rewards.multiplier}x Multiplier
                      </div>
                      <div className="text-sm text-purple-600">
                        Reward Boost
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Claim Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600
                       text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Awesome!
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};