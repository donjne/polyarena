// components/market/MarketCategorySection.tsx
import React from 'react';
import { Flame } from 'lucide-react';
import { MarketListItem } from './MarketListItem';
import { PopularMarketItem } from './PopularMarketItem';
import type { MarketCategoryGroup, Market, PopularMarket } from '@/types/market';

interface MarketCategorySectionProps {
  category: MarketCategoryGroup;
  favorites: Set<string>;
  onFavoriteToggle: (id: string, e: React.MouseEvent) => void;
  onMarketSelect: (id: string) => void;
}

export const MarketCategorySection: React.FC<MarketCategorySectionProps> = ({
  category,
  favorites,
  onFavoriteToggle,
  onMarketSelect,
}) => {
  const isPopularMarket = (market: Market | PopularMarket): market is PopularMarket => {
    return !('sections' in market);
  };

  return (
    <div className={`space-y-4 ${category.highlighted ? 'bg-purple-50/50 p-4 rounded-xl' : ''}`}>
      <h3 className="font-['Russo_One'] text-purple-900 text-sm px-2 flex items-center space-x-2">
        {category.highlighted && <Flame className="text-orange-500" size={16} />}
        <span>{category.title}</span>
      </h3>

      {category.markets.map(market => (
        <div key={market.id} className="space-y-3">
          {isPopularMarket(market) ? (
            <PopularMarketItem
              market={market}
              isFavorite={favorites.has(market.id)}
              onFavoriteToggle={onFavoriteToggle}
              onSelect={onMarketSelect}
            />
          ) : (
            market.sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-2">
                <h4 className="text-purple-700 text-xs font-bold px-2">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map(item => (
                    <MarketListItem
                      key={item.id}
                      item={item}
                      isFavorite={favorites.has(item.id)}
                      onFavoriteToggle={onFavoriteToggle}
                      onSelect={onMarketSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};