// components/marketplace/listing/ListingCreation.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Clock, Eye, Shield, Info,
  DollarSign, Calendar, AlertCircle,
  CheckCircle, Lock
} from 'lucide-react';
import type { NFTAsset } from '../../../types/marketplace';

interface ListingCreationProps {
  asset: NFTAsset;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listingData: ListingData) => Promise<void>;
  minPrice: string;
  maxPrice: string;
}

interface ListingData {
  price: string;
  currency: 'SOL' | 'USDC';
  duration: number;
  instantBuyEnabled: boolean;
  allowOffers: boolean;
  private: boolean;
  reservePrice?: string;
}

export const ListingCreation: React.FC<ListingCreationProps> = ({
  asset,
  isOpen,
  onClose,
  onSubmit,
  minPrice,
  maxPrice
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState<ListingData>({
    price: '',
    currency: 'SOL',
    duration: 7, // 7 days default
    instantBuyEnabled: true,
    allowOffers: true,
    private: false
  });

  const durationOptions = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' }
  ];

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.price) {
        throw new Error('Please enter a listing price');
      }

      const price = parseFloat(formData.price);
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      if (price < min || price > max) {
        throw new Error(`Price must be between ${minPrice} and ${maxPrice}`);
      }

      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center space-x-3 text-white">
            <Tag size={24} />
            <h2 className="text-xl font-bold">Create Listing</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Preview */}
          <div className="flex items-center space-x-4">
            <img
              src={asset.preview}
              alt={asset.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-purple-900">{asset.name}</h3>
              <div className="text-sm text-purple-600 capitalize">{asset.type}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Shield className="text-green-500" size={16} />
                <span className="text-sm text-green-600">Verified Asset</span>
              </div>
            </div>
          </div>

          {/* Price Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-purple-900">Listing Price</h4>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <DollarSign 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                    size={18}
                  />
                </div>
                <div className="text-sm text-purple-600 mt-1">
                  Min: {minPrice} - Max: {maxPrice}
                </div>
              </div>
              
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currency: e.target.value as 'SOL' | 'USDC'
                })}
                className="w-32 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="SOL">SOL</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-4">
            <h4 className="font-medium text-purple-900">Listing Duration</h4>
            <div className="grid grid-cols-3 gap-4">
              {durationOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setFormData({ ...formData, duration: option.value })}
                  className={`p-3 rounded-lg border-2 transition-colors
                    ${formData.duration === option.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                    }`}
                >
                  <div className="font-medium text-purple-900">{option.label}</div>
                  <div className="text-sm text-purple-600">
                    Ends {new Date(Date.now() + option.value * 24 * 60 * 60 * 1000)
                      .toLocaleDateString()}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-purple-900">Listing Options</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Enable Instant Buy</div>
                  <div className="text-sm text-purple-600">
                    Allow buyers to purchase immediately at list price
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.instantBuyEnabled}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    instantBuyEnabled: e.target.checked 
                  })}
                  className="rounded border-purple-300 text-purple-600 
                           focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Allow Offers</div>
                  <div className="text-sm text-purple-600">
                    Let buyers make custom offers
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowOffers}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    allowOffers: e.target.checked 
                  })}
                  className="rounded border-purple-300 text-purple-600 
                           focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Private Listing</div>
                  <div className="text-sm text-purple-600">
                    Only visible to specific addresses
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.private}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    private: e.target.checked 
                  })}
                  className="rounded border-purple-300 text-purple-600 
                           focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <div className="text-green-800">
                Listing created successfully!
              </div>
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium
                       hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};