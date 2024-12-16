import React from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, Search, Grid, List,
  ChevronDown
} from 'lucide-react';
import type { NFTAsset, NFTCollection } from '../../types/marketplace';

interface NFTMarketplaceProps {
  collections: NFTCollection[];
  featuredAssets: NFTAsset[];
  onAssetSelect: (asset: NFTAsset) => void;
  onCollectionSelect: (collection: NFTCollection) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: MarketplaceFilters) => void;
}

export interface MarketplaceFilters {
  type?: NFTAsset['type'][];
  rarity?: NFTAsset['rarity'][];
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy: 'price_asc' | 'price_desc' | 'recent' | 'oldest';
  status?: 'listed' | 'unlisted' | 'sold';
}

export const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({
  collections,
  featuredAssets,
  onAssetSelect,
  onCollectionSelect,
  onSearch,
  onFilter
}) => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState<MarketplaceFilters>({
    sortBy: 'recent'
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (newFilters: Partial<MarketplaceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Marketplace Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">NFT Marketplace</h1>
          <p className="text-purple-600">Discover unique avatars and gaming assets</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="bg-purple-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${
                view === 'grid'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-purple-600'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${
                view === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-purple-600'
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2
              ${showFilters
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-600'
              }`}
          >
            <Filter size={20} />
            <span>Filters</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search assets..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
              size={20}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ 
                sortBy: e.target.value as MarketplaceFilters['sortBy']
              })}
              className="appearance-none px-4 py-2 pr-10 rounded-lg bg-white border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Recently Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Content will continue... */}
    </div>
  );
};