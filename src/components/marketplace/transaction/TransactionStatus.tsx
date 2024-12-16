// components/marketplace/transaction/TransactionStatus.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, CheckCircle, Clock, 
  Loader, ExternalLink, XCircle,
  RefreshCw
} from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'purchase' | 'listing' | 'offer' | 'transfer';
  status: 'pending' | 'processing' | 'complete' | 'failed';
  timestamp: number;
  txHash?: string;
  assetId: string;
  amount?: string;
  error?: string;
}

interface TransactionStatusProps {
  transaction: Transaction;
  onRetry?: () => void;
  onClose: () => void;
  showInExplorer?: (txHash: string) => void;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  transaction,
  onRetry,
  onClose,
  showInExplorer
}) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      text: 'Transaction Pending',
      subtext: 'Waiting for confirmation...'
    },
    processing: {
      icon: Loader,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      text: 'Processing Transaction',
      subtext: 'Please wait while we process your transaction...'
    },
    complete: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50',
      text: 'Transaction Complete',
      subtext: 'Your transaction has been confirmed!'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      text: 'Transaction Failed',
      subtext: 'Something went wrong with your transaction.'
    }
  };

  const config = statusConfig[transaction.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${config.bg} rounded-lg p-6 shadow-lg max-w-md mx-auto`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className={config.color} size={24} />
          <div>
            <h3 className="font-medium text-gray-900">{config.text}</h3>
            <p className="text-sm text-gray-600">{config.subtext}</p>
          </div>
        </div>
        {transaction.status === 'processing' && (
          <RefreshCw className="animate-spin text-blue-500" size={20} />
        )}
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Transaction Type</span>
          <span className="text-gray-900 capitalize">{transaction.type}</span>
        </div>
        {transaction.amount && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount</span>
            <span className="text-gray-900">{transaction.amount} SOL</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time</span>
          <span className="text-gray-900">
            {new Date(transaction.timestamp).toLocaleString()}
          </span>
        </div>
        {transaction.txHash && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Transaction Hash</span>
            <button
              onClick={() => showInExplorer?.(transaction.txHash!)}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
            >
              <span className="font-mono">
                {transaction.txHash.slice(0, 6)}...{transaction.txHash.slice(-4)}
              </span>
              <ExternalLink size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {transaction.status === 'failed' && transaction.error && (
        <div className="mb-4 p-3 bg-red-100 rounded-lg flex items-start space-x-2">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
          <span className="text-sm text-red-700">{transaction.error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        {transaction.status === 'failed' && onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium
                     hover:bg-purple-700 transition-colors"
          >
            Retry Transaction
          </motion.button>
        )}
        {transaction.status === 'complete' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium
                     hover:bg-purple-700 transition-colors"
          >
            Close
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};