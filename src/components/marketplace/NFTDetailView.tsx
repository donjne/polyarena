// components/marketplace/NFTDetailView.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Heart, Share2, History,
  Eye, ArrowUpRight, ShieldCheck, Tag,
  TrendingUp, ArrowLeft, RefreshCw
} from 'lucide-react';
import type { NFTAsset } from '../../types/marketplace';

interface NFTDetailViewProps {
  asset: NFTAsset;
  onBack: () => void;
  onPurchase: (asset: NFTAsset) => void;
  onMakeOffer: (asset: NFTAsset, price: string) => void;
  onFavorite: (assetId: string) => void;
  isFavorited: boolean;
  viewCount: number;
  favoriteCount: number;
}

interface PriceHistory {
  timestamp: number;
  price: string;
  type: 'sale' | 'listing' | 'offer';
}

export const NFTDetailView: React.FC<NFTDetailViewProps> = ({
  asset,
  onBack,
  onPurchase,
  onMakeOffer,
  onFavorite,
  isFavorited,
  viewCount,
  favoriteCount
}) => {
  const [activeTab, setActiveTab] = React.useState<'details' | 'history' | 'attributes'>('details');
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [offerPrice, setOfferPrice] = React.useState('');

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="flex items-center justify-between text-white">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Marketplace</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onFavorite(asset.id)}
              className={`p-2 rounded-lg ${
                isFavorited ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Heart size={20} fill={isFavorited ? 'white' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-8 p-8">
        {/* Left Column - Preview */}
        <div className="col-span-2 space-y-6">
          <div className="relative">
            <motion.div
              whileHover={{ scale: isZoomed ? 1 : 1.02 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer ${
                isZoomed ? 'fixed inset-8 z-50 bg-black/90' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={asset.preview}
                alt={asset.name}
                className={`w-full h-full ${isZoomed ? 'object-contain' : 'object-cover'}`}
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>{viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={16} />
                  <span>{favoriteCount}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600">Last Sale</div>
              <div className="font-bold text-purple-900">
                {asset.lastSalePrice || 'No sales yet'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600">Listed</div>
              <div className="font-bold text-purple-900">
                {formatDate(asset.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="col-span-3 space-y-8">
          {/* Title and Basic Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-purple-900">{asset.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-purple-600">Owned by</span>
                  <a href="#" className="text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                    <span>{asset.owner || 'Unowned'}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  asset.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  asset.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  asset.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {asset.rarity}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium capitalize">
                  {asset.type}
                </span>
              </div>
            </div>

            <p className="mt-4 text-purple-600">
              {asset.description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-purple-200">
            <div className="flex space-x-8">
              {(['details', 'history', 'attributes'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-purple-400 hover:text-purple-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Current Price */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-purple-600">Current Price</div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="text-green-500" size={20} />
                      <span className="text-green-600">Verified Listing</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-900">
                        {asset.price} {asset.currency}
                      </div>
                      <div className="text-sm text-purple-600 mt-1">
                        ≈ ${parseFloat(asset.price) * 20} USD
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onPurchase(asset)}
                      className="px-8 py-3 rounded-lg bg-purple-600 text-white font-medium
                               hover:bg-purple-700 transition-colors"
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>

                {/* Make Offer */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-purple-900 mb-4">
                    Make an Offer
                  </h3>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter offer amount"
                      className="flex-1 px-4 py-2 rounded-lg bg-white border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onMakeOffer(asset, offerPrice)}
                      disabled={!offerPrice}
                      className="px-6 py-2 rounded-lg bg-white text-purple-600 font-medium
                               border-2 border-purple-600 hover:bg-purple-50 disabled:opacity-50
                               disabled:cursor-not-allowed"
                    >
                      Make Offer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Continue with History and Attributes tabs */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};