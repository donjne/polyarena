// components/analytics/TrendAnalysis.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Activity, AlertCircle, Clock,
  ChevronDown, ArrowRight, Zap, BarChart2 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface TrendPoint {
  timestamp: number;
  value: number;
  movingAverage: number;
  volatility: number;
  volume: number;
  sentiment: number;
}

interface TrendIndicator {
  type: 'support' | 'resistance' | 'breakout' | 'reversal';
  value: number;
  confidence: number;
  description: string;
}

interface TrendAnalysisProps {
  data: TrendPoint[];
  indicators: TrendIndicator[];
  onTimeframeChange: (days: number) => void;
  onIndicatorToggle: (type: TrendIndicator['type']) => void;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  data,
  indicators,
  onTimeframeChange,
  onIndicatorToggle
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(7);
  const [showIndicators, setShowIndicators] = React.useState<Record<TrendIndicator['type'], boolean>>({
    support: true,
    resistance: true,
    breakout: true,
    reversal: true
  });

  const timeframes = [
    { days: 1, label: '24H' },
    { days: 7, label: '7D' },
    { days: 30, label: '30D' },
    { days: 90, label: '90D' }
  ];

  const handleTimeframeChange = (days: number) => {
    setSelectedTimeframe(days);
    onTimeframeChange(days);
  };

  return (
    <div className="space-y-6">
      {/* Main Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-purple-900">Market Trends</h3>

          <div className="flex items-center space-x-4">
            {/* Timeframe Selection */}
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <motion.button
                  key={tf.days}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleTimeframeChange(tf.days)}
                  className={`px-4 py-2 rounded-lg transition-colors
                    ${selectedTimeframe === tf.days
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                >
                  {tf.label}
                </motion.button>
              ))}
            </div>

            {/* Indicator Toggle Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {}}
                className="px-4 py-2 rounded-lg bg-purple-100 text-purple-600 
                         hover:bg-purple-200 flex items-center space-x-2"
              >
                <Activity size={20} />
                <span>Indicators</span>
                <ChevronDown size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                stroke="#6B7280"
              />
              <YAxis stroke="#6B7280" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-100">
                        <div className="text-sm text-purple-600">
                          {new Date(data.timestamp).toLocaleString()}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <div className="text-sm text-purple-600">Price</div>
                            <div className="font-medium text-purple-900">
                              ${data.value.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-purple-600">MA</div>
                            <div className="font-medium text-purple-900">
                              ${data.movingAverage.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-purple-600">Volume</div>
                            <div className="font-medium text-purple-900">
                              ${data.volume.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-purple-600">Volatility</div>
                            <div className="font-medium text-purple-900">
                              {(data.volatility * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Main Price Line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={false}
              />

              {/* Moving Average */}
              <Line
                type="monotone"
                dataKey="movingAverage"
                stroke="#60A5FA"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />

              {/* Technical Indicators */}
              {indicators.map((indicator, index) => (
                showIndicators[indicator.type] && (
                  <ReferenceLine
                    key={index}
                    y={indicator.value}
                    stroke={
                      indicator.type === 'support' ? '#10B981' :
                      indicator.type === 'resistance' ? '#EF4444' :
                      indicator.type === 'breakout' ? '#F59E0B' :
                      '#8B5CF6'
                    }
                    strokeDasharray="3 3"
                    label={{
                      value: indicator.type.charAt(0).toUpperCase() + indicator.type.slice(1),
                      position: 'right',
                      fill: '#6B7280',
                      fontSize: 12
                    }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Indicators */}
      <div className="grid grid-cols-2 gap-6">
        {indicators.map((indicator) => (
          <motion.div
            key={indicator.type}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  indicator.type === 'support' ? 'bg-green-100 text-green-600' :
                  indicator.type === 'resistance' ? 'bg-red-100 text-red-600' :
                  indicator.type === 'breakout' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-purple-900 capitalize">
                    {indicator.type} Level
                  </h4>
                  <div className="text-sm text-purple-600">
                    Confidence: {(indicator.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-purple-900">
                  ${indicator.value.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="text-sm text-purple-600">
              {indicator.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};