import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend
}) => {
  const isPositiveTrend = trend?.startsWith('+');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Icon size={20} className="text-purple-600" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm
            ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPositiveTrend ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-sm text-purple-600">{title}</div>
        <div className="text-2xl font-bold text-purple-900">{value}</div>
      </div>
    </motion.div>
  );
};