// components/marketplace/purchase/PurchaseConfirmation.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Wallet, AlertCircle,
  CheckCircle, Loader, ExternalLink
} from 'lucide-react';
import type { NFTAsset } from '../../../types/marketplace';

interface PurchaseConfirmationProps {
  asset: NFTAsset;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  walletBalance: string;
}

export const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  asset,
  isOpen,
  onClose,
  onConfirm,
  walletBalance
}) => {
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [txHash, setTxHash] = React.useState<string | null>(null);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setError(null);
    try {
      await onConfirm();
      setTxHash('0x...'); // Would be actual transaction hash
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  const hasEnoughBalance = parseFloat(walletBalance) >= parseFloat(asset.price);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center space-x-3 text-white">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">Complete Purchase</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Preview */}
          <div className="flex items-center space-x-4">
            <img
              src={asset.preview}
              alt={asset.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-purple-900">{asset.name}</h3>
              <div className="text-sm text-purple-600 capitalize">{asset.type}</div>
            </div>
          </div>

          {/* Price & Balance */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Price</span>
              <span className="font-bold text-purple-900">
                {asset.price} {asset.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600">Your Balance</span>
              <span className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                {walletBalance} {asset.currency}
              </span>
            </div>
            {!hasEnoughBalance && (
              <div className="flex items-start space-x-2 text-sm text-red-600">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>Insufficient balance for this purchase</span>
              </div>
            )}
          </div>

          {/* Transaction Status */}
          {txHash && (
            <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <div>
                <div className="font-medium text-green-800">
                  Purchase Successful!
                </div>
                <a
                  href={`https://explorer.solana.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 flex items-center space-x-1 hover:text-green-700"
                >
                  <span>View transaction</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onClose}
              disabled={isPurchasing}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-purple-600 text-purple-600
                       font-medium hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handlePurchase}
              disabled={isPurchasing || !hasEnoughBalance}
              className="flex-1 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium
                       hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2"
            >
              {isPurchasing ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Wallet size={20} />
                  <span>Confirm Purchase</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};