import React from 'react';
import { motion } from 'framer-motion';
import { 
  Verified, TrendingUp, Users, 
  ExternalLink, Star
} from 'lucide-react';
import type { NFTCollection } from '../../types/marketplace';

interface CollectionsGridProps {
  collections: NFTCollection[];
  onCollectionSelect: (collection: NFTCollection) => void;
}

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({
  collections,
  onCollectionSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          whileHover={{ scale: 1.02 }}
          onClick={() => onCollectionSelect(collection)}
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
        >
          {/* Collection Cover */}
          <div className="relative h-48">
            <img
              src={collection.coverImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            {collection.verified && (
              <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg">
                <Verified className="text-blue-500" size={20} />
              </div>
            )}
          </div>

          {/* Collection Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-900">
                {collection.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-purple-400" />
                <span className="text-purple-600">{collection.items}</span>
              </div>
            </div>

            <p className="text-purple-600 text-sm mb-4 line-clamp-2">
              {collection.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-purple-600">Floor Price</div>
                <div className="font-bold text-purple-900">
                  {collection.floorPrice} SOL
                </div>
              </div>
              <div>
                <div className="text-sm text-purple-600">Volume</div>
                <div className="font-bold text-purple-900">
                  {collection.totalVolume} SOL
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};