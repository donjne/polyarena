// components/marketplace/FilterPanel.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, X, ChevronDown, ChevronUp,
  Check, RefreshCw
} from 'lucide-react';
import type { NFTAsset } from '../../types/marketplace';
import { MarketplaceFilters } from './NFTMarketplace';

interface FilterPanelProps {
  filters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
  onReset: () => void;
  stats: {
    priceRange: {
      min: number;
      max: number;
    };
    typeCounts: Record<NFTAsset['type'], number>;
    rarityCounts: Record<NFTAsset['rarity'], number>;
  };
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  stats
}) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>('type');

  const assetTypes: NFTAsset['type'][] = [
    'avatar',
    'skin',
    'accessory',
    'effect',
    'badge'
  ];

  const rarityLevels: NFTAsset['rarity'][] = [
    'legendary',
    'epic',
    'rare',
    'common'
  ];

  const handleTypeToggle = (type: NFTAsset['type']) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFilterChange({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleRarityToggle = (rarity: NFTAsset['rarity']) => {
    const currentRarities = filters.rarity || [];
    const newRarities = currentRarities.includes(rarity)
      ? currentRarities.filter(r => r !== rarity)
      : [...currentRarities, rarity];

    onFilterChange({
      ...filters,
      rarity: newRarities.length > 0 ? newRarities : undefined
    });
  };

  const FilterSection: React.FC<{
    title: string;
    id: string;
    children: React.ReactNode;
  }> = ({ title, id, children }) => (
    <div className="border-b border-purple-200 last:border-0">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full px-4 py-3 flex items-center justify-between text-purple-900 hover:bg-purple-50"
      >
        <span className="font-medium">{title}</span>
        {expandedSection === id ? (
          <ChevronUp size={20} className="text-purple-600" />
        ) : (
          <ChevronDown size={20} className="text-purple-600" />
        )}
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-purple-600" />
          <span className="font-medium text-purple-900">Filters</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onReset}
          className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-purple-200">
        {/* Asset Type */}
        <FilterSection title="Asset Type" id="type">
          <div className="space-y-2">
            {assetTypes.map((type) => (
              <label
                key={type}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(type) || false}
                    onChange={() => handleTypeToggle(type)}
                    className="rounded border-purple-300 text-purple-600 
                             focus:ring-purple-500"
                  />
                  <span className="text-purple-900 capitalize">{type}</span>
                </div>
                <span className="text-sm text-purple-600">
                  {stats.typeCounts[type]}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rarity */}
        <FilterSection title="Rarity" id="rarity">
          <div className="space-y-2">
            {rarityLevels.map((rarity) => (
              <label
                key={rarity}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.rarity?.includes(rarity) || false}
                    onChange={() => handleRarityToggle(rarity)}
                    className="rounded border-purple-300 text-purple-600 
                             focus:ring-purple-500"
                  />
                  <span className={`text-purple-900 capitalize ${
                    rarity === 'legendary' ? 'text-yellow-600' :
                    rarity === 'epic' ? 'text-purple-600' :
                    rarity === 'rare' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {rarity}
                  </span>
                </div>
                <span className="text-sm text-purple-600">
                  {stats.rarityCounts[rarity]}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" id="price">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-purple-600 mb-1">Min</label>
                <input
                  type="number"
                  min={stats.priceRange.min}
                  max={filters.priceRange?.max || stats.priceRange.max}
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    priceRange: {
                        min: parseFloat(e.target.value),
                        max: filters.priceRange?.max ?? stats.priceRange.max
                      }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-600 mb-1">Max</label>
                <input
                  type="number"
                  min={filters.priceRange?.min || stats.priceRange.min}
                  max={stats.priceRange.max}
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    priceRange: {
                        min: filters.priceRange?.min ?? stats.priceRange.min,
                        max: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Price Range Slider could be added here */}
          </div>
        </FilterSection>

        {/* Status */}
        <FilterSection title="Listing Status" id="status">
          <div className="space-y-2">
            {['listed', 'unlisted', 'sold'].map((status) => (
              <label
                key={status}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={filters.status === status}
                  onChange={() => onFilterChange({
                    ...filters,
                    status: status as MarketplaceFilters['status']
                  })}
                  className="rounded-full border-purple-300 text-purple-600 
                           focus:ring-purple-500"
                />
                <span className="text-purple-900 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};