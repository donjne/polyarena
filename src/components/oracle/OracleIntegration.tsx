import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, AlertCircle, CheckCircle, 
  RefreshCw, Shield, Link, Activity 
} from 'lucide-react';
import type { MarketOracle, Arena } from '../../types/arena';

interface OracleData {
  price?: number;
  value?: string | number | boolean;
  confidence: number;
  timestamp: number;
  source: string;
  signature?: string;
}

interface OracleIntegrationProps {
  arena: Arena;
  oracle: MarketOracle;
  onOracleData: (data: OracleData) => void;
  onOracleError: (error: string) => void;
}

export const OracleIntegration: React.FC<OracleIntegrationProps> = ({
  arena,
  oracle,
  onOracleData,
  onOracleError
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = React.useState<number>(Date.now());
  const [error, setError] = React.useState<string | null>(null);
  const [oracleData, setOracleData] = React.useState<OracleData | null>(null);
  const [updateCount, setUpdateCount] = React.useState<number>(0);

  const fetchOracleData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated oracle data fetch based on provider
      let data: OracleData;
      switch (oracle.provider) {
        case 'pyth':
          data = await fetchPythData(oracle.feedId);
          break;
        case 'chainlink':
          data = await fetchChainlinkData(oracle.feedId);
          break;
        case 'switchboard':
          data = await fetchSwitchboardData(oracle.feedId);
          break;
        default:
          throw new Error('Unsupported oracle provider');
      }

      setOracleData(data);
      setLastUpdate(Date.now());
      setUpdateCount(prev => prev + 1);
      onOracleData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch oracle data';
      setError(errorMessage);
      onOracleError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [oracle, onOracleData, onOracleError]);

  React.useEffect(() => {
    fetchOracleData();
    
    const interval = setInterval(fetchOracleData, oracle.updateFrequency * 1000);
    return () => clearInterval(interval);
  }, [fetchOracleData, oracle.updateFrequency]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="text-purple-600" size={24} />
          <h3 className="text-lg font-medium text-purple-900">Oracle Feed</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-purple-600">
            Updates every {oracle.updateFrequency}s
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchOracleData}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors
              ${isLoading 
                ? 'bg-purple-100 cursor-not-allowed' 
                : 'bg-purple-50 hover:bg-purple-100'
              }`}
          >
            <RefreshCw 
              className={`text-purple-600 ${isLoading ? 'animate-spin' : ''}`} 
              size={20} 
            />
          </motion.button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div className="text-red-700">{error}</div>
        </div>
      ) : oracleData && (
        <div className="space-y-6">
          {/* Current Value */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 mb-1">Current Value</div>
            <div className="text-2xl font-bold text-purple-900">
              {typeof oracleData.value === 'boolean'
                ? oracleData.value ? 'Yes' : 'No'
                : oracleData.value ?? oracleData.price}
            </div>
            <div className="flex items-center space-x-2 mt-2 text-sm text-purple-600">
              <Activity size={16} />
              <span>
                Confidence: {(oracleData.confidence * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Oracle Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 mb-1">Provider</div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-purple-900">
                  {oracle.provider.toUpperCase()}
                </span>
                <Link className="text-purple-400" size={16} />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 mb-1">Feed Updates</div>
              <div className="font-medium text-purple-900">
                {updateCount} updates
              </div>
            </div>
          </div>

          {/* Last Update */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-purple-600">
              Last updated: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="text-green-500" size={16} />
              <span className="text-green-600">Verified Source</span>
            </div>
          </div>

          {oracleData.signature && (
            <div className="text-xs font-mono text-purple-400 truncate">
              Signature: {oracleData.signature}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Mock functions for oracle data fetching
async function fetchPythData(feedId: string): Promise<OracleData> {
  // Implementation would use Pyth Network SDK
  return {
    price: 0,
    confidence: 0.95,
    timestamp: Date.now(),
    source: 'pyth'
  };
}

async function fetchChainlinkData(feedId: string): Promise<OracleData> {
  // Implementation would use Chainlink SDK
  return {
    price: 0,
    confidence: 0.95,
    timestamp: Date.now(),
    source: 'chainlink'
  };
}

async function fetchSwitchboardData(feedId: string): Promise<OracleData> {
  // Implementation would use Switchboard SDK
  return {
    price: 0,
    confidence: 0.95,
    timestamp: Date.now(),
    source: 'switchboard'
  };
}