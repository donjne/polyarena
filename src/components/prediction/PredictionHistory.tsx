import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, Clock, TrendingUp, 
  TrendingDown, ArrowRight, Filter 
} from 'lucide-react';
import type { Arena } from '../../types/arena';

interface PredictionRecord {
  id: string;
  arenaId: string;
  timestamp: number;
  predictedValue: string | number | boolean;
  actualValue: string | number | boolean;
  stake: string;
  reward: string;
  status: 'won' | 'lost' | 'pending';
  type: Arena['predictions']['type'];
}

interface PredictionHistoryProps {
  predictions: PredictionRecord[];
  onViewArena: (arenaId: string) => void;
  onFilterChange: (filter: PredictionHistoryFilter) => void;
}

interface PredictionHistoryFilter {
  status?: 'won' | 'lost' | 'pending';
  timeRange?: 'today' | 'week' | 'month' | 'all';
  predictionType?: Arena['predictions']['type'];
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  predictions,
  onViewArena,
  onFilterChange
}) => {
  const [filter, setFilter] = React.useState<PredictionHistoryFilter>({
    timeRange: 'all'
  });

  const stats = React.useMemo(() => {
    const total = predictions.length;
    const won = predictions.filter(p => p.status === 'won').length;
    const totalStake = predictions.reduce((sum, p) => sum + parseFloat(p.stake), 0);
    const totalReward = predictions
      .filter(p => p.status === 'won')
      .reduce((sum, p) => sum + parseFloat(p.reward), 0);

    return {
      total,
      winRate: total ? (won / total) * 100 : 0,
      totalStake,
      totalReward,
      profit: totalReward - totalStake
    };
  }, [predictions]);

  const filteredPredictions = React.useMemo(() => {
    return predictions.filter(prediction => {
      if (filter.status && prediction.status !== filter.status) return false;
      if (filter.predictionType && prediction.type !== filter.predictionType) return false;
      
      if (filter.timeRange) {
        const now = Date.now();
        const predictionTime = prediction.timestamp;
        switch (filter.timeRange) {
          case 'today':
            return (now - predictionTime) < 24 * 60 * 60 * 1000;
          case 'week':
            return (now - predictionTime) < 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return (now - predictionTime) < 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [predictions, filter]);

  const handleFilterChange = (newFilter: Partial<PredictionHistoryFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-purple-600 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white/90 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-purple-600 mb-1">Total Predictions</div>
          <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
        </div>

        <div className="bg-white/90 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-purple-600 mb-1">Total Staked</div>
          <div className="text-2xl font-bold text-purple-900">
            ${stats.totalStake.toFixed(2)}
          </div>
        </div>

        <div className="bg-white/90 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-purple-600 mb-1">Total Profit</div>
          <div className={`text-2xl font-bold ${
            stats.profit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${stats.profit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-white/90 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-purple-600" />
          <span className="font-medium text-purple-900">Filters</span>
        </div>

        <select
          value={filter.status || ''}
          onChange={(e) => handleFilterChange({ 
            status: e.target.value as PredictionHistoryFilter['status'] 
          })}
          className="px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="">All Status</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={filter.timeRange}
          onChange={(e) => handleFilterChange({ 
            timeRange: e.target.value as PredictionHistoryFilter['timeRange'] 
          })}
          className="px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/90 rounded-lg p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {prediction.status === 'won' && (
                <CheckCircle className="text-green-500" size={24} />
              )}
              {prediction.status === 'lost' && (
                <XCircle className="text-red-500" size={24} />
              )}
              {prediction.status === 'pending' && (
                <Clock className="text-yellow-500" size={24} />
              )}

              <div>
                <div className="font-medium text-purple-900">
                  {typeof prediction.predictedValue === 'boolean'
                    ? prediction.predictedValue ? 'Yes' : 'No'
                    : prediction.predictedValue
                  }
                </div>
                <div className="text-sm text-purple-600">
                  Staked ${prediction.stake}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              {prediction.status !== 'pending' && (
                <div className="text-right">
                  <div className={`font-medium ${
                    prediction.status === 'won' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.status === 'won' 
                      ? `+$${prediction.reward}`
                      : `-$${prediction.stake}`
                    }
                  </div>
                  <div className="text-sm text-purple-600">
                    {new Date(prediction.timestamp).toLocaleDateString()}
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => onViewArena(prediction.arenaId)}
                className="p-2 rounded-lg bg-purple-100 text-purple-600
                         hover:bg-purple-200 transition-colors"
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
