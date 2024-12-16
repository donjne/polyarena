'use client';

import React from 'react';
import { NFTMarketplace } from '@/components/marketplace/NFTMarketplace';
import { MarketplaceAnalytics } from '@/components/analytics/MarketAnalytics';
import type { NFTCollection, NFTAsset } from '@/types/marketplace';

export default function MarketplacePage() {
  // This would come from your data fetching layer
  const [collections, setCollections] = React.useState<NFTCollection[]>([]);
  const [featuredAssets, setFeaturedAssets] = React.useState<NFTAsset[]>([]);

  const handleAssetSelect = (asset: NFTAsset) => {
    // Navigate to asset detail page
  };

  const handleCollectionSelect = (collection: NFTCollection) => {
    // Navigate to collection page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NFTMarketplace
        collections={collections}
        featuredAssets={featuredAssets}
        onAssetSelect={handleAssetSelect}
        onCollectionSelect={handleCollectionSelect}
        onSearch={() => {}}
        onFilter={() => {}}
      />
    </div>
  );
}