// components/marketplace/offers/CounterOfferModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, DollarSign, Clock, 
  AlertCircle, X, Info 
} from 'lucide-react';
import type { Offer } from './OfferManagement';

interface CounterOfferModalProps {
  offer: Offer;
  onClose: () => void;
  onSubmit: (offer: Offer, amount: string) => Promise<void>;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  offer,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = React.useState('');
  const [duration, setDuration] = React.useState(24); // hours
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const durationOptions = [
    { value: 12, label: '12 Hours' },
    { value: 24, label: '24 Hours' },
    { value: 48, label: '2 Days' },
    { value: 72, label: '3 Days' },
    { value: 168, label: '1 Week' }
  ];

  const handleSubmit = async () => {
    if (!amount) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      const newAmount = parseFloat(amount);
      const originalAmount = parseFloat(offer.amount);

      if (newAmount <= originalAmount) {
        throw new Error('Counter offer must be lower than the original offer');
      }

      await onSubmit(offer, amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit counter offer');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <ArrowLeftRight size={24} />
              <h2 className="text-xl font-bold">Make Counter Offer</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Original Offer Info */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600">Original Offer</span>
              <span className="font-bold text-purple-900">
                {offer.amount} {offer.currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-600">From</span>
              <span className="text-purple-900">{offer.bidder.username}</span>
            </div>
          </div>

          {/* Counter Amount */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Counter Offer Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <DollarSign 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                size={18}
              />
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Offer Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {durationOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setDuration(option.value)}
                  className={`p-2 rounded-lg text-sm border-2 transition-colors
                    ${duration === option.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                    }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start space-x-3 bg-blue-50 rounded-lg p-4">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-sm text-blue-700">
              Your counter offer will expire in {duration} hours if not accepted.
              The original offer will be automatically rejected upon submitting this counter offer.
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 bg-red-50 rounded-lg p-4">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-purple-600 text-purple-600
                       font-medium hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !amount}
              className="flex-1 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium
                       hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Counter Offer'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};