import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, Tag, TrendingUp, TrendingDown,
  Activity, ArrowRight, Clock
} from 'lucide-react';
import type { NFTAsset } from '../../types/marketplace';

interface ActivityEvent {
  type: 'sale' | 'listing' | 'offer' | 'transfer';
  price?: string;
  from: string;
  to: string;
  timestamp: number;
  txHash: string;
}

// History Tab Component
export const HistoryTab: React.FC<{ asset: NFTAsset }> = ({ asset }) => {
  const activities: ActivityEvent[] = asset.saleHistory.map(sale => ({
    type: 'sale',
    price: sale.price,
    from: sale.from,
    to: sale.to,
    timestamp: sale.timestamp,
    txHash: '0x...' // Would come from actual blockchain data
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Price History Graph would go here */}
      <div className="h-64 bg-purple-50 rounded-xl p-4 mb-6">
        {/* Would implement chart using Recharts or similar */}
        <div className="text-center text-purple-600">Price History Graph</div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'sale' ? 'bg-green-100' :
                  activity.type === 'listing' ? 'bg-blue-100' :
                  activity.type === 'offer' ? 'bg-yellow-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'sale' ? <TrendingUp className="text-green-600" size={20} /> :
                   activity.type === 'listing' ? <Tag className="text-blue-600" size={20} /> :
                   activity.type === 'offer' ? <TrendingDown className="text-yellow-600" size={20} /> :
                   <Activity className="text-purple-600" size={20} />}
                </div>
                <div>
                  <div className="font-medium text-purple-900 capitalize">
                    {activity.type}
                  </div>
                  <div className="text-sm text-purple-600">
                    From {activity.from.slice(0, 6)}...{activity.from.slice(-4)} to{' '}
                    {activity.to.slice(0, 6)}...{activity.to.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {activity.price && (
                  <div className="font-medium text-purple-900">
                    {activity.price} SOL
                  </div>
                )}
                <div className="text-sm text-purple-600">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Attributes Tab Component
export const AttributesTab: React.FC<{ asset: NFTAsset }> = ({ asset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 gap-4"
    >
      {Object.entries(asset.attributes).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-purple-50 rounded-lg p-4"
        >
          <div className="text-sm text-purple-600 capitalize">
            {key.replace(/_/g, ' ')}
          </div>
          <div className="font-medium text-purple-900 mt-1">
            {value.toString()}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};