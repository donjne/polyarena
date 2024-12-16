'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { NFTViewer } from '@/components/marketplace/viewer/NFTViewer';
import { PurchaseConfirmation } from '@/components/marketplace/purchase/PurchaseConfirmation';
import { Comments } from '@/components/social/Comments';
import type { NFTAsset } from '@/types/marketplace';

export default function AssetPage() {
  const { assetId } = useParams();
  const [asset, setAsset] = React.useState<NFTAsset | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {asset && (
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column - Asset Preview */}
          <div className="col-span-2">
            <NFTViewer
              asset={asset}
              modelUrl={asset.preview}
              onScreenshot={() => {}}
            />
          </div>

          {/* Right Column - Asset Details */}
          <div className="col-span-3 space-y-8">
            {/* Asset Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-purple-900 mb-2">
                {asset.name}
              </h1>
              <p className="text-purple-600">{asset.description}</p>
            </div>

            {/* Purchase Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {/* Purchase info implementation */}
            </div>

            {/* Comments Section */}
            <Comments
              comments={[]} // This would come from your data
              onAddComment={() => Promise.resolve()}
              onEditComment={() => Promise.resolve()}
              onDeleteComment={() => Promise.resolve()}
              onLikeComment={() => Promise.resolve()}
              onReportComment={() => Promise.resolve()}
            />
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && asset && (
        <PurchaseConfirmation
          asset={asset}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={() => Promise.resolve()}
          walletBalance="100"
        />
      )}
    </div>
  );
}