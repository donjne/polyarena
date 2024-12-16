import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Trophy, Target, Clock, 
  DollarSign, BarChart2, PieChart, Activity 
} from 'lucide-react';
import type { Arena } from '../../types/arena';

interface PredictionDistribution {
    option: string | number | boolean;
    percentage: number;
    count: number;
    totalStaked: string;
    confidence: number;
  }
  
  interface CommunityPredictionsProps {
    arena: Arena;
    distributions: PredictionDistribution[];
    onDistributionSelect?: (distribution: PredictionDistribution) => void;
    topPredictors?: {
      address: string;
      username: string;
      winRate: number;
      prediction: string | number | boolean;
    }[];
  }
  
  export const CommunityPredictions: React.FC<CommunityPredictionsProps> = ({
    arena,
    distributions,
    onDistributionSelect,
    topPredictors
  }) => {
    const totalPredictions = React.useMemo(() => {
      return distributions.reduce((sum, dist) => sum + dist.count, 0);
    }, [distributions]);
  
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg p-6">
        <h3 className="text-lg font-medium text-purple-900 mb-6">Community Predictions</h3>
  
        {/* Distribution Chart */}
        <div className="space-y-4 mb-8">
          {distributions.map((dist) => (
            <motion.div
              key={String(dist.option)}
              whileHover={{ scale: 1.01 }}
              onClick={() => onDistributionSelect?.(dist)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-purple-900">
                  {typeof dist.option === 'boolean' 
                    ? (dist.option ? 'Yes' : 'No') 
                    : dist.option}
                </div>
                <div className="text-sm text-purple-600">
                  {dist.count} predictions
                </div>
              </div>
  
              <div className="relative h-4 bg-purple-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dist.percentage}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-blue-600"
                />
              </div>
  
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="text-purple-900 font-medium">
                  {dist.percentage.toFixed(1)}%
                </div>
                <div className="text-purple-600">
                  {dist.totalStaked} staked
                </div>
              </div>
            </motion.div>
          ))}
        </div>
  
        {/* Top Predictors */}
        {topPredictors && (
          <div>
            <h4 className="font-medium text-purple-900 mb-4">Top Predictors</h4>
            <div className="space-y-3">
              {topPredictors.map((predictor, index) => (
                <div 
                  key={predictor.address}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 
                                  flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-purple-900">
                        {predictor.username}
                      </div>
                      <div className="text-sm text-purple-600">
                        {predictor.winRate.toFixed(1)}% win rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-600">Prediction</div>
                    <div className="font-medium text-purple-900">
                      {typeof predictor.prediction === 'boolean'
                        ? predictor.prediction ? 'Yes' : 'No'
                        : predictor.prediction
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };