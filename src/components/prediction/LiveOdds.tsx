import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Timer } from 'lucide-react';
import type { Arena } from '../../types/arena';

interface OddsData {
  value: number;
  timestamp: number;
  totalStaked: string;
  participants: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

type OddsOption = string | number | 'yes' | 'no';

interface LiveOddsProps {
  arena: Arena;
  currentOdds: Record<OddsOption, OddsData>;
  updateInterval: number;
  onOddsUpdate: (odds: Record<OddsOption, OddsData>) => void;
}

export const LiveOdds: React.FC<LiveOddsProps> = ({
  arena,
  currentOdds,
  updateInterval,
  onOddsUpdate
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = React.useState<number>(Date.now());
  const [error, setError] = React.useState<string | null>(null);

  const formatOdds = (odds: number): string => {
    return odds.toFixed(2) + 'x';
  };

  const getChangeClass = (trend: OddsData['trend']): string => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-purple-600';
    }
  };

  const getTrendIcon = (trend: OddsData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-600" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-purple-900">Live Odds</h3>
        <div className="flex items-center space-x-2 text-sm text-purple-600">
          <Timer size={16} />
          <span>Updated {((Date.now() - lastUpdate) / 1000).toFixed(0)}s ago</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(currentOdds).map(([option, data]) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-purple-900">
                {typeof option === 'boolean' ? (option ? 'Yes' : 'No') : option}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-purple-900">
                  {formatOdds(data.value)}
                </span>
                {getTrendIcon(data.trend)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-purple-600">Change</div>
                <div className={getChangeClass(data.trend)}>
                  {data.percentageChange >= 0 ? '+' : ''}
                  {data.percentageChange.toFixed(2)}%
                </div>
              </div>
              
              <div>
                <div className="text-purple-600">Total Staked</div>
                <div className="text-purple-900">{data.totalStaked}</div>
              </div>
              
              <div>
                <div className="text-purple-600">Participants</div>
                <div className="text-purple-900">{data.participants}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div className="text-red-700">{error}</div>
        </div>
      )}
    </div>
  );
};