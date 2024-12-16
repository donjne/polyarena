import { NFTAsset } from "@/types/marketplace";
import { motion } from 'framer-motion';

interface AssetCardProps {
    asset: NFTAsset;
    view: 'grid' | 'list';
    onSelect: (asset: NFTAsset) => void;
  }
  
  export const AssetCard: React.FC<AssetCardProps> = ({
    asset,
    view,
    onSelect
  }) => {
    const getRarityColor = (rarity: NFTAsset['rarity']) => {
      switch (rarity) {
        case 'legendary':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'epic':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'rare':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };
  
    if (view === 'list') {
      return (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => onSelect(asset)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4
                   flex items-center space-x-4 cursor-pointer"
        >
          {/* Preview */}
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={asset.preview}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold text-purple-900 truncate">
                {asset.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                getRarityColor(asset.rarity)
              }`}>
                {asset.rarity}
              </span>
            </div>
            <p className="text-purple-600 text-sm line-clamp-2 mb-2">
              {asset.description}
            </p>
            <div className="text-sm text-purple-600">
              Type: {asset.type}
            </div>
          </div>
  
          {/* Price */}
          <div className="text-right">
            <div className="font-bold text-purple-900">
              {asset.price} {asset.currency}
            </div>
            {asset.lastSalePrice && (
              <div className="text-sm text-purple-600">
                Last: {asset.lastSalePrice} {asset.currency}
              </div>
            )}
          </div>
        </motion.div>
      );
    }
  
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelect(asset)}
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      >
        {/* Preview */}
        <div className="relative aspect-square">
          <img
            src={asset.preview}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              getRarityColor(asset.rarity)
            }`}>
              {asset.rarity}
            </span>
          </div>
        </div>
  
        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-purple-900 truncate">
              {asset.name}
            </h3>
            <div className="text-sm text-purple-600 capitalize">
              {asset.type}
            </div>
          </div>
  
          <p className="text-purple-600 text-sm line-clamp-2 mb-4">
            {asset.description}
          </p>
  
          {/* Price & Stats */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600">Price</div>
              <div className="font-bold text-purple-900">
                {asset.price} {asset.currency}
              </div>
            </div>
            {asset.saleHistory.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-purple-600">Last Sale</div>
                <div className="font-medium text-purple-900">
                  {asset.saleHistory[0].price} {asset.currency}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };