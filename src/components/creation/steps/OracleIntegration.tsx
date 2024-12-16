import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Shield, Activity, RefreshCw, 
  Check, AlertTriangle, Link, Settings 
} from 'lucide-react';
import type { MarketOracle } from '@/types/arena';

interface OracleIntegrationProps {
    value: {
      oracle?: MarketOracle;
      settings?: {
        autoUpdate: boolean;
        minimumConfidence: number;
        updateThreshold: number;
        fallbackOracle?: MarketOracle;
      };
    };
    onChange: (value: OracleIntegrationProps['value']) => void;
    availableOracles: Array<{
      provider: MarketOracle['provider'];
      feeds: Array<{
        id: string;
        name: string;
        description: string;
        updateFrequency: number;
        confidence: number;
      }>;
    }>;
    errors?: Record<string, string>;
  }

export const OracleIntegration: React.FC<OracleIntegrationProps> = ({
  value,
  onChange,
  availableOracles,
  errors
}) => {
  const [selectedProvider, setSelectedProvider] = React.useState<MarketOracle['provider'] | null>(
    value.oracle?.provider || null
  );

  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const testOracleConnection = async () => {
    if (!value.oracle) return;

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      // Simulate oracle connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTestResult({
        success: true,
        message: 'Successfully connected to oracle feed'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to connect to oracle feed'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Oracle Provider Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-purple-900">Oracle Provider</h3>
          <Database className="text-purple-600" size={24} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {availableOracles.map((oracle) => (
            <motion.button
              key={oracle.provider}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedProvider(oracle.provider);
                onChange({
                  ...value,
                  oracle: {
                    provider: oracle.provider,
                    feedId: '',
                    updateFrequency: 0,
                    minimumConfidence: 0.95
                  }
                });
              }}
              className={`p-6 rounded-xl border-2 transition-all
                ${selectedProvider === oracle.provider
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-purple-200 hover:border-purple-300'
                }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="font-bold text-purple-900 mb-2">
                  {oracle.provider.toUpperCase()}
                </div>
                <div className="text-sm text-purple-600">
                  {oracle.feeds.length} available feeds
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Data Feed Selection */}
      {selectedProvider && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-purple-900">Data Feed</h3>
              <Activity className="text-purple-600" size={24} />
            </div>

            <div className="space-y-4">
              {availableOracles
                .find(o => o.provider === selectedProvider)
                ?.feeds.map((feed) => (
                  <motion.button
                    key={feed.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onChange({
                      ...value,
                      oracle: {
                        ...value.oracle!,
                        feedId: feed.id,
                        updateFrequency: feed.updateFrequency,
                        minimumConfidence: feed.confidence
                      }
                    })}
                    className={`w-full p-4 rounded-lg text-left transition-all
                      ${value.oracle?.feedId === feed.id
                        ? 'bg-purple-100 border border-purple-300'
                        : 'bg-purple-50 border border-purple-200 hover:border-purple-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-purple-900">{feed.name}</div>
                      <div className="text-sm text-purple-600">
                        Updates every {feed.updateFrequency}s
                      </div>
                    </div>
                    <div className="text-sm text-purple-700">{feed.description}</div>
                  </motion.button>
                ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Oracle Settings */}
      {value.oracle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-purple-900">Oracle Settings</h3>
            <Settings className="text-purple-600" size={24} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Minimum Confidence
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={value.settings?.updateThreshold !== undefined ? value.settings.updateThreshold : ''}
                  onChange={(e) => onChange({
                    ...value,
                    settings: {
                      ...(value.settings || { autoUpdate: false, minimumConfidence: 0.95, updateThreshold: 60 }),
                      updateThreshold: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Update Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={value.settings?.updateThreshold !== undefined ? value.settings.updateThreshold : ''}
                  onChange={(e) => onChange({
                    ...value,
                    settings: {
                      ...(value.settings || { autoUpdate: false, minimumConfidence: 0.95, updateThreshold: 60 }),
                      updateThreshold: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                  seconds
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.settings?.autoUpdate || false}
                onChange={(e) => onChange({
                  ...value,
                  settings: {
                    ...(value.settings || { autoUpdate: false, minimumConfidence: 0.95, updateThreshold: 60 }),
                    autoUpdate: e.target.checked
                  }
                })}
                className="rounded border-purple-300 text-purple-600 
                         focus:ring-purple-500"
              />
              <span className="text-purple-900">Enable automatic updates</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Connection Test */}
      {value.oracle?.feedId && (
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={testOracleConnection}
            disabled={isTestingConnection}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2
              ${isTestingConnection
                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Testing Connection...</span>
              </>
            ) : (
              <>
                <Link size={20} />
                <span>Test Oracle Connection</span>
              </>
            )}
          </motion.button>

          {testResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 p-4 rounded-lg flex items-start space-x-3
                ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}
            >
              {testResult.success ? (
                <Check className="text-green-500 flex-shrink-0" size={20} />
              ) : (
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              )}
              <span className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                {testResult.message}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};