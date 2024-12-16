import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import type { CategoryPerformance } from '@/types/analytics';

interface CategoryBreakdownProps {
  data: CategoryPerformance[];
  onRefresh: () => void;
  onCategorySelect: (category: string) => void;
  lastUpdated: Date;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  onRefresh,
  onCategorySelect,
  lastUpdated
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-purple-900">Category Breakdown</h3>
          <p className="text-sm text-purple-600">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onRefresh}
          className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="marketShare"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onCategorySelect(entry.category)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CategoryPerformance;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-100">
                        <div className="font-medium text-purple-900">
                          {data.category}
                        </div>
                        <div className="text-sm text-purple-600 mt-1">
                          Market Share: {(data.marketShare * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-purple-600">
                          Volume: ${data.volume.toLocaleString()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                formatter={(value: string) => (
                  <span className="text-sm text-purple-900">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="space-y-4">
          {data.map((category) => (
            <motion.div
              key={category.category}
              whileHover={{ scale: 1.02 }}
              onClick={() => onCategorySelect(category.category)}
              className="p-4 bg-purple-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-purple-900">
                    {category.category}
                  </span>
                </div>
                <div className={`flex items-center space-x-1
                  ${category.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {category.change >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{Math.abs(category.change)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-purple-600">Volume</div>
                  <div className="font-medium text-purple-900">
                    ${category.volume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-purple-600">Transactions</div>
                  <div className="font-medium text-purple-900">
                    {category.transactions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-purple-600">Avg. Price</div>
                  <div className="font-medium text-purple-900">
                    ${category.averagePrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};