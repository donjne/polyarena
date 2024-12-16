// components/marketplace/transaction/TransactionHistory.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, CheckCircle, Clock, 
  Loader, ExternalLink, XCircle,
  RefreshCw
} from 'lucide-react';
import type { Transaction } from './TransactionStatus';

interface TransactionHistoryProps {
    transactions: Transaction[];
    onRetry: (transactionId: string) => void;
    onViewDetails: (transaction: Transaction) => void;
  }
  
  export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    transactions,
    onRetry,
    onViewDetails
  }) => {
    return (
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow
              ${transaction.status === 'complete' ? 'bg-green-50' :
                transaction.status === 'failed' ? 'bg-red-50' :
                transaction.status === 'processing' ? 'bg-blue-50' : 'bg-yellow-50'
              }`}
            onClick={() => onViewDetails(transaction)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {transaction.status === 'complete' && <CheckCircle className="text-green-500" size={20} />}
                {transaction.status === 'failed' && <XCircle className="text-red-500" size={20} />}
                {transaction.status === 'processing' && <Loader className="text-blue-500 animate-spin" size={20} />}
                {transaction.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                
                <div>
                  <div className="font-medium text-gray-900 capitalize">
                    {transaction.type}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
  
              {transaction.amount && (
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {transaction.amount} SOL
                  </div>
                  {transaction.status === 'failed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetry(transaction.id);
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Retry
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };