// components/analytics/MarketplaceAnalytics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart2, PieChart, 
  DollarSign, Activity, Users, Clock,
  Calendar 
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface MarketStats {
  totalVolume: string;
  dailyVolume: string;
  activeListings: number;
  uniqueTraders: number;
  averagePrice: string;
  volumeChange: number;
  priceChange: number;
}

interface TimeSeriesData {
  timestamp: number;
  volume: number;
  price: number;
  transactions: number;
}

interface CategoryPerformance {
  category: string;
  volume: number;
  transactions: number;
  averagePrice: number;
  change: number;
}

interface MarketplaceAnalyticsProps {
  stats: MarketStats;
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryPerformance[];
  onTimeframeChange: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
  onCategorySelect: (category: string) => void;
}

export const MarketplaceAnalytics: React.FC<MarketplaceAnalyticsProps> = ({
  stats,
  timeSeriesData,
  categoryData,
  onTimeframeChange,
  onCategorySelect
}) => {
  const [timeframe, setTimeframe] = React.useState<'day' | 'week' | 'month' | 'year'>('day');
  const [selectedMetric, setSelectedMetric] = React.useState<'volume' | 'price' | 'transactions'>('volume');

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    onTimeframeChange(newTimeframe);
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Volume</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalVolume}
          </div>
          <div className={`text-sm mt-1 flex items-center space-x-1
            ${stats.volumeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp size={16} />
            <span>{stats.volumeChange}% last 24h</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="text-purple-600" size={24} />
            <span className="text-purple-600">Average Price</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.averagePrice}
          </div>
          <div className={`text-sm mt-1 flex items-center space-x-1
            ${stats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp size={16} />
            <span>{stats.priceChange}% last 24h</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <BarChart2 className="text-purple-600" size={24} />
            <span className="text-purple-600">Active Listings</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.activeListings}
          </div>
          <div className="text-sm text-purple-600 mt-1">
            Updated just now
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Users className="text-purple-600" size={24} />
            <span className="text-purple-600">Unique Traders</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.uniqueTraders}
          </div>
          <div className="text-sm text-purple-600 mt-1">
            Last 24 hours
          </div>
        </motion.div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-purple-900">Market Activity</h3>
          
          <div className="flex items-center space-x-4">
            {/* Metric Selection */}
            <div className="flex items-center space-x-2">
              {[
                { id: 'volume', label: 'Volume', icon: DollarSign },
                { id: 'price', label: 'Price', icon: TrendingUp },
                { id: 'transactions', label: 'Transactions', icon: Activity }
              ].map((metric) => (
                <motion.button
                  key={metric.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedMetric(metric.id as typeof selectedMetric)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2
                    ${selectedMetric === metric.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                >
                  <metric.icon size={16} />
                  <span>{metric.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Timeframe Selection */}
            <div className="flex items-center space-x-2">
              {[
                { id: 'day', label: '24H' },
                { id: 'week', label: '7D' },
                { id: 'month', label: '30D' },
                { id: 'year', label: '1Y' }
              ].map((period) => (
                <motion.button
                  key={period.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleTimeframeChange(period.id as typeof timeframe)}
                  className={`px-4 py-2 rounded-lg
                    ${timeframe === period.id
                      ? 'bg-purple-100 text-purple-600 font-medium'
                      : 'text-purple-600 hover:bg-purple-50'
                    }`}
                >
                  {period.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                stroke="#6B7280"
              />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => 
                  selectedMetric === 'volume' || selectedMetric === 'price'
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString()
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-100">
                        <div className="text-sm text-purple-600">
                          {new Date(data.timestamp).toLocaleString()}
                        </div>
                        <div className="font-medium text-purple-900 mt-1">
                          {selectedMetric === 'volume' || selectedMetric === 'price'
                            ? `$${data[selectedMetric].toLocaleString()}`
                            : data[selectedMetric].toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-purple-900 mb-6">Category Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-100">
                          <div className="font-medium text-purple-900">
                            {data.category}
                          </div>
                          <div className="text-sm text-purple-600 mt-1">
                            Volume: ${data.volume.toLocaleString()}
                          </div>
                          <div className="text-sm text-purple-600">
                            Transactions: {data.transactions}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="volume" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continue with more analytics components... */}
      </div>
    </div>
  );
};