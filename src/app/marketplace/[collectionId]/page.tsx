'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CollectionsGrid } from '@/components/marketplace/CollectionsGrid';

import type { NFTCollection } from '@/types/marketplace';
import { BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = React.useState<NFTCollection | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {collection && (
        <>
          {/* Collection Header */}
          <div className="relative h-64 rounded-xl overflow-hidden mb-8">
            <img
              src={collection.coverImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {collection.name}
              </h1>
              <p className="text-white/80">{collection.description}</p>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-purple-600">Floor Price</div>
              <div className="text-2xl font-bold text-purple-900">
                {collection.floorPrice} SOL
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-purple-600">Items</div>
              <div className="text-2xl font-bold text-purple-900">
                {collection.items}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-purple-600">Volume</div>
              <div className="text-2xl font-bold text-purple-900">
                {collection.totalVolume} SOL
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-purple-600">Owners</div>
              <div className="text-2xl font-bold text-purple-900">
                {/* This would come from your data */}
                2.5K
              </div>
            </div>
          </div>

          {/* Collection Items */}
          <CollectionsGrid
            collections={[collection]}
            onCollectionSelect={() => {}}
          />

          {/* Collection Analytics */}
          <div className="mt-8 flex justify-end">
            <Link 
              href={`/marketplace/${collectionId}/analytics`}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
            >
              <BarChart2 size={20} />
              View Detailed Analytics
            </Link>
          </div>
        </>
      )}
    </div>
  );
}