// components/marketplace/offers/OfferManagement.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, DollarSign, Clock, Users, 
  ThumbsUp, ThumbsDown, ArrowRight,
  MessageCircle, RefreshCw
} from 'lucide-react';
import type { NFTAsset } from '@/types/marketplace';
import { CounterOfferModal } from './CounterOfferModal';

export interface Offer {
  id: string;
  assetId: string;
  bidder: {
    address: string;
    username: string;
    avatar?: string;
  };
  amount: string;
  currency: 'SOL' | 'USDC';
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'countered';
  expiresAt: number;
  createdAt: number;
  message?: string;
  counterOffer?: {
    amount: string;
    expiresAt: number;
  };
}

interface OfferManagementProps {
  asset: NFTAsset;
  offers: Offer[];
  isOwner: boolean;
  onAcceptOffer: (offer: Offer) => Promise<void>;
  onRejectOffer: (offer: Offer) => Promise<void>;
  onCounterOffer: (offer: Offer, amount: string) => Promise<void>;
  onMakeOffer: (amount: string, message?: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const OfferManagement: React.FC<OfferManagementProps> = ({
  asset,
  offers,
  isOwner,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
  onMakeOffer,
  onRefresh
}) => {
  const [newOffer, setNewOffer] = React.useState('');
  const [offerMessage, setOfferMessage] = React.useState('');
  const [counterAmount, setCounterAmount] = React.useState('');
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmitOffer = async () => {
    if (!newOffer) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await onMakeOffer(newOffer, offerMessage);
      setNewOffer('');
      setOfferMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Make New Offer Section */}
      {!isOwner && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-purple-900 mb-4">Make an Offer</h3>
          
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Offer Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={newOffer}
                  onChange={(e) => setNewOffer(e.target.value)}
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

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-purple-900 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Add a message to the seller..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleSubmitOffer}
              disabled={isSubmitting || !newOffer}
              className={`w-full py-2 rounded-lg font-medium
                ${isSubmitting || !newOffer
                  ? 'bg-purple-200 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </motion.button>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-purple-900">
            {isOwner ? 'Received Offers' : 'All Offers'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onRefresh}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw size={20} />
          </motion.button>
        </div>

        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="text-center py-8 text-purple-600">
              No offers yet
            </div>
          ) : (
            offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-purple-200 rounded-lg p-4 hover:border-purple-300
                         transition-colors"
              >
                <div className="flex items-start justify-between">
                  {/* Bidder Info */}
                  <div className="flex items-center space-x-3">
                    {offer.bidder.avatar ? (
                      <img
                        src={offer.bidder.avatar}
                        alt={offer.bidder.username}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="text-purple-600" size={20} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-purple-900">
                        {offer.bidder.username}
                      </div>
                      <div className="text-sm text-purple-600">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Offer Amount */}
                  <div className="text-right">
                    <div className="font-bold text-purple-900">
                      {offer.amount} {offer.currency}
                    </div>
                    <div className="text-sm text-purple-600">
                      Expires in {Math.ceil((offer.expiresAt - Date.now()) / (1000 * 60 * 60))}h
                    </div>
                  </div>
                </div>

                {/* Message */}
                {offer.message && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm text-purple-600">
                    {offer.message}
                  </div>
                )}

                {/* Actions */}
                {isOwner && offer.status === 'pending' && (
                  <div className="mt-4 flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onAcceptOffer(offer)}
                      className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium
                               hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onRejectOffer(offer)}
                      className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium
                               hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedOffer(offer)}
                      className="flex-1 py-2 rounded-lg border-2 border-purple-600 text-purple-600
                               font-medium hover:bg-purple-50 transition-colors"
                    >
                      Counter
                    </motion.button>
                  </div>
                )}

                {/* Status Badge */}
                {offer.status !== 'pending' && (
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${offer.status === 'accepted' 
                      ? 'bg-green-100 text-green-800'
                      : offer.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : offer.status === 'expired'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Counter Offer Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <CounterOfferModal
            offer={selectedOffer}
            onClose={() => setSelectedOffer(null)}
            onSubmit={onCounterOffer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};