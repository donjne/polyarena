// components/monitoring/OracleTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Activity, AlertCircle, CheckCircle,
  TrendingUp, Terminal, RefreshCw, Clock
} from 'lucide-react';
import type { MarketOracle } from '@/types/arena';

interface OracleUpdate {
  timestamp: number;
  value: number | string | boolean;
  confidence: number;
  latency: number;
  signature: string;
  status: 'success' | 'error';
  error?: string;
}

interface OracleTabProps {
  oracle: MarketOracle;
  health: {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    lastUpdate: number;
    confidence: number;
    errors?: string[];
    updates: OracleUpdate[];
  };
  onRefreshOracle: () => Promise<void>;
  onUpdateConfig: (config: Partial<MarketOracle>) => Promise<void>;
}

export const OracleTab: React.FC<OracleTabProps> = ({
  oracle,
  health,
  onRefreshOracle,
  onUpdateConfig
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showConfig, setShowConfig] = React.useState(false);
  const [configForm, setConfigForm] = React.useState(oracle);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshOracle();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfigSubmit = async () => {
    try {
      await onUpdateConfig(configForm);
      setShowConfig(false);
    } catch (error) {
      console.error('Failed to update oracle config:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Oracle Status Overview */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-purple-900">Oracle Status</h3>
              <p className="text-purple-600">{oracle.provider} Data Feed</p>
            </div>
            <motion.div
              animate={{
                backgroundColor: health.status === 'healthy' 
                  ? '#10B981' 
                  : health.status === 'degraded' 
                  ? '#F59E0B' 
                  : '#EF4444'
              }}
              className="w-3 h-3 rounded-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Current Latency</span>
              <span className={`font-bold ${
                health.latency < 100 
                  ? 'text-green-600' 
                  : health.latency < 500 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {health.latency}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Confidence Score</span>
              <span className="font-bold text-purple-900">
                {(health.confidence * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Last Update</span>
              <span className="font-bold text-purple-900">
                {new Date(health.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-purple-900">Performance</h3>
              <p className="text-purple-600">Last 24 Hours</p>
            </div>
            <Activity className="text-purple-600" size={24} />
          </div>

          {/* Mini Performance Graph */}
          <div className="h-32 mb-4">
            {/* Implement performance graph here */}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-purple-600">Uptime</div>
              <div className="font-bold text-purple-900">99.9%</div>
            </div>
            <div>
              <div className="text-sm text-purple-600">Avg Latency</div>
              <div className="font-bold text-purple-900">85ms</div>
            </div>
            <div>
              <div className="text-sm text-purple-600">Updates</div>
              <div className="font-bold text-purple-900">1,245</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-purple-900">Recent Updates</h3>
            <p className="text-purple-600">Latest oracle data feed updates</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
          >
            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={20} />
          </motion.button>
        </div>

        <div className="space-y-4">
          {health.updates.map((update, index) => (
            <motion.div
              key={update.timestamp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg flex items-center justify-between
                ${update.status === 'success'
                  ? 'bg-green-50'
                  : 'bg-red-50'
                }`}
            >
              <div className="flex items-center space-x-4">
                {update.status === 'success' ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <AlertCircle className="text-red-500" size={20} />
                )}
                <div>
                  <div className="font-medium text-purple-900">
                    {typeof update.value === 'boolean'
                      ? update.value ? 'True' : 'False'
                      : update.value}
                  </div>
                  <div className="text-sm text-purple-600">
                    Confidence: {(update.confidence * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-purple-600">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-purple-600">
                  Latency: {update.latency}ms
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Oracle Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-purple-900">Configuration</h3>
            <p className="text-purple-600">Oracle feed settings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 rounded-lg bg-purple-100 text-purple-600
                     hover:bg-purple-200 transition-colors"
          >
            {showConfig ? 'Hide Config' : 'Show Config'}
          </motion.button>
        </div>

        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Update Frequency (seconds)
              </label>
              <input
                type="number"
                value={configForm.updateFrequency}
                onChange={(e) => setConfigForm({
                  ...configForm,
                  updateFrequency: parseInt(e.target.value)
                })}
                className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Minimum Confidence
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={configForm.minimumConfidence}
                onChange={(e) => setConfigForm({
                  ...configForm,
                  minimumConfidence: parseFloat(e.target.value)
                })}
                className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleConfigSubmit}
              className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium
                       hover:bg-purple-700 transition-colors"
            >
              Save Configuration
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};