import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, 
  DollarSign, Activity, 
  XCircle
} from 'lucide-react';
import type { Arena } from '../../types/arena';

interface StatsPeriod {
  timeframe: 'day' | 'week' | 'month' | 'all';
  label: string;
}

interface CategoryPerformance {
  category: string;
  winRate: number;
  totalPredictions: number;
  profitLoss: number;
  averageStake: number;
}

interface PredictionStatsProps {
  userAddress: string;
  stats: {
    overall: {
      totalPredictions: number;
      winRate: number;
      profitLoss: number;
      averageStake: number;
      bestStreak: number;
      currentStreak: number;
      totalStaked: number;
      totalReturns: number;
      averageReturnRate: number;
    };
    categoryPerformance: CategoryPerformance[];
    recentActivity: {
      timestamp: number;
      result: 'win' | 'loss';
      amount: number;
      arena: Arena;
    }[];
  };
  onPeriodChange: (period: StatsPeriod['timeframe']) => void;
  selectedPeriod: StatsPeriod['timeframe'];
}

export const PredictionStats: React.FC<PredictionStatsProps> = ({
  stats,
  onPeriodChange,
  selectedPeriod
}) => {
  const periods: StatsPeriod[] = [
    { timeframe: 'day', label: '24H' },
    { timeframe: 'week', label: '7D' },
    { timeframe: 'month', label: '30D' },
    { timeframe: 'all', label: 'All Time' }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-900">Prediction Stats</h2>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <motion.button
              key={period.timeframe}
              whileHover={{ scale: 1.05 }}
              onClick={() => onPeriodChange(period.timeframe)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${selectedPeriod === period.timeframe
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="text-purple-600" size={24} />
            <div className="text-purple-900">Win Rate</div>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {stats.overall.winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600 mt-2">
            {stats.overall.totalPredictions} total predictions
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="text-purple-600" size={24} />
            <div className="text-purple-900">Total P&L</div>
          </div>
          <div className={`text-3xl font-bold ${
            stats.overall.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(stats.overall.profitLoss)}
          </div>
          <div className="text-sm text-purple-600 mt-2">
            {stats.overall.averageReturnRate.toFixed(1)}% avg. return
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="text-purple-600" size={24} />
            <div className="text-purple-900">Best Streak</div>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {stats.overall.bestStreak}
          </div>
          <div className="text-sm text-purple-600 mt-2">
            Current streak: {stats.overall.currentStreak}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className="text-purple-600" size={24} />
            <div className="text-purple-900">Avg Stake</div>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {formatCurrency(stats.overall.averageStake)}
          </div>
          <div className="text-sm text-purple-600 mt-2">
            {formatCurrency(stats.overall.totalStaked)} total staked
          </div>
        </motion.div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-purple-900 mb-6">
          Category Performance
        </h3>
        <div className="space-y-4">
          {stats.categoryPerformance.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium text-purple-900">
                  {category.category}
                </div>
                <div className="text-sm text-purple-600">
                  {category.totalPredictions} predictions
                </div>
              </div>
              
              <div className="relative h-3 bg-purple-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.winRate}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-blue-600"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-purple-900">
                  {category.winRate.toFixed(1)}% win rate
                </div>
                <div className={`font-medium ${
                  category.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(category.profitLoss)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-purple-900 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {activity.result === 'win' ? (
                  <Trophy className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-600" size={20} />
                )}
                <div>
                  <div className="font-medium text-purple-900">
                    {activity.arena.name}
                  </div>
                  <div className="text-sm text-purple-600">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`font-medium ${
                activity.result === 'win' ? 'text-green-600' : 'text-red-600'
              }`}>
                {activity.result === 'win' ? '+' : '-'}
                {formatCurrency(activity.amount)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};