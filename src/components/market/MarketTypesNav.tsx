// components/market/MarketTypesNav.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Flame, Globe, History } from 'lucide-react';
import { SearchBar } from './Searchbar';
import { NavigationTabs } from './NavigationTabs';
import { MarketCategorySection } from './MarketCategorySection';
import type { 
  NavigationTab, 
  NavigationTabId, 
  MarketCategoryGroup,
  SearchResult,
  MarketFilter
} from '@/types/market';

// Import your market categories data
import { marketCategories } from './marketCategories';

export const MarketTypesNav: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMarket, setSelectedMarket] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = React.useState<NavigationTabId>('all');
  const [filters, setFilters] = React.useState<MarketFilter>({});

  const navigationTabs: NavigationTab[] = [
    { id: 'all', label: 'All Markets', icon: Globe },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recent', label: 'Recent', icon: History }
  ];

  // Filter markets based on search query and active tab
  const getFilteredMarkets = React.useCallback((): SearchResult => {
    if (!searchQuery && activeTab === 'all' && !Object.keys(filters).length) {
      return { 
        categories: marketCategories, 
        totalResults: marketCategories.length,
        filters 
      };
    }

    const filtered = marketCategories.map(category => ({
      ...category,
      markets: category.markets.map(market => {
        if ('sections' in market) {
          return {
            ...market,
            sections: market.sections.map(section => ({
              ...section,
              items: section.items.filter(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (activeTab !== 'favorites' || favorites.has(item.id)) &&
                (!filters.category || item.category === filters.category) &&
                (!filters.type || item.type === filters.type)
              )
            })).filter(section => section.items.length > 0)
          };
        }
        return market;
      }).filter(market => 
        'sections' in market 
          ? market.sections.some(section => section.items.length > 0)
          : market.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (activeTab !== 'favorites' || favorites.has(market.id))
      )
    })).filter(category => category.markets.length > 0);

    const totalResults = filtered.reduce((acc, cat) => 
      acc + cat.markets.reduce((mAcc, m) => 
        'sections' in m 
          ? mAcc + m.sections.reduce((sAcc, s) => sAcc + s.items.length, 0)
          : mAcc + 1
      , 0)
    , 0);

    return { 
      categories: filtered, 
      totalResults,
      filters 
    };
  }, [searchQuery, activeTab, favorites, filters]);

  const handleFavoriteToggle = React.useCallback((itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  }, []);

  const handleMarketSelect = React.useCallback((marketId: string) => {
    setSelectedMarket(marketId);
    setIsOpen(false);
  }, []);

  const { categories, totalResults } = getFilteredMarkets();

  return (
    <div className="relative">
      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 rounded-lg bg-white/90 backdrop-blur-sm border 
                 border-purple-500/20 hover:border-purple-500/30 text-purple-900 
                 flex items-center justify-between font-['Orbitron'] 
                 transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <Globe className="text-purple-600" size={20} />
          <span className="font-bold">
            {selectedMarket === 'all' ? 'ALL MARKETS' : selectedMarket.toUpperCase()}
          </span>
        </div>
        <ChevronDown 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md 
                     rounded-xl border border-purple-500/20 shadow-2xl z-50 
                     max-h-[70vh] overflow-hidden"
          >
            <NavigationTabs
              tabs={navigationTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {searchQuery && (
              <div className="px-4 py-2 text-sm text-purple-600">
                Found {totalResults} results
              </div>
            )}

            <div className="overflow-auto max-h-[calc(70vh-120px)]">
              <div className="p-4 space-y-6">
                {categories.map((category, idx) => (
                  <MarketCategorySection
                    key={idx}
                    category={category}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                    onMarketSelect={handleMarketSelect}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketTypesNav;