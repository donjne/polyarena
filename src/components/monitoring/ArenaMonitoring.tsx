// components/monitoring/ArenaMonitoring.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, Terminal,
  Database, RefreshCw 
} from 'lucide-react';
import type { Arena } from '@/types/arena';

interface ArenaMetrics {
  participants: number;
  predictions: number;
  totalStaked: string;
  avgConfidence: number;
  responseTime: number;
  uptime: number;
}

interface OracleHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastUpdate: number;
  confidence: number;
  errors?: string[];
}

interface ArenaMonitoringProps {
  arena: Arena;
  metrics: ArenaMetrics;
  oracleHealth: OracleHealth;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onRefreshOracle: () => Promise<void>;
  refreshInterval?: number;
}

export const ArenaMonitoring: React.FC<ArenaMonitoringProps> = ({
  arena,
  metrics,
  oracleHealth,
  onPause,
  onResume,
  onRefreshOracle,
  refreshInterval = 5000
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<'overview' | 'oracle' | 'logs'>('overview');

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        handleRefresh();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isRefreshing, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshOracle();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatUptime = (uptime: number): string => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-purple-900">{arena.name}</h2>
            <p className="text-purple-600">Arena Monitoring Dashboard</p>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={arena.status === 'active' ? onPause : onResume}
              className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2
                ${arena.status === 'active'
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
            >
              {arena.status === 'active' ? 'Pause Arena' : 'Resume Arena'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
            >
              <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'oracle', label: 'Oracle Health', icon: Database },
          { id: 'logs', label: 'Logs & Events', icon: Terminal }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-medium
              ${selectedTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 hover:bg-purple-50'
              }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 gap-6"
          >
            {/* Participant Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Participants</h3>
                <Users className="text-purple-600" size={24} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Active Players</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {metrics.participants}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Total Predictions</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {metrics.predictions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Total Staked</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {metrics.totalStaked}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Performance</h3>
                <Activity className="text-purple-600" size={24} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Response Time</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {metrics.responseTime}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Uptime</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {formatUptime(metrics.uptime)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Avg. Confidence</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {metrics.avgConfidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Oracle Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Oracle Status</h3>
                <Database className="text-purple-600" size={24} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${oracleHealth.status === 'healthy'
                      ? 'bg-green-100 text-green-600'
                      : oracleHealth.status === 'degraded'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                    }`}>
                    {oracleHealth.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Latency</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {oracleHealth.latency}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">Last Update</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {new Date(oracleHealth.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue with Oracle and Logs tabs */}
      </AnimatePresence>
    </div>
  );
};