'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArenaDetails } from '@/components/ArenaDetails';
import { PredictionInterface } from '@/components/prediction/PredictionInterface';
import { LiveOdds } from '@/components/prediction/LiveOdds';
import { CommunityPredictions } from '@/components/prediction/CommunityPredictions';
import type { Arena, MatchType } from '@/types/arena';

export default function ArenaDetailPage() {
  const { arenaId } = useParams();
  const [arena, setArena] = React.useState<Arena | null>(null);
  const [matchType, setMatchType] = React.useState<MatchType | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {arena && matchType && (
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Arena Details & Community */}
          <div className="col-span-2 space-y-8">
            <ArenaDetails
              arena={arena}
              matchType={matchType}
              onEnterArena={() => {}}
              onViewLeaderboard={() => {}}
              onViewRules={() => {}}
            />

            <CommunityPredictions
              arena={arena}
              distributions={[]} // This would come from your data
              topPredictors={[]} // This would come from your data
            />
          </div>

          {/* Right Column - Prediction Interface & Odds */}
          <div className="space-y-8">
            <PredictionInterface
              arena={arena}
              onSubmitPrediction={() => Promise.resolve(true)}
              timeRemaining={300} // This would come from your data
              currentOdds={{
                forOption: {},
                totalStaked: "0"
              }}
            />
            <LiveOdds
              arena={arena}
              currentOdds={{
                // Example structure matching Record<OddsOption, OddsData>:
                'yes': {
                  value: 2.5,
                  timestamp: Date.now(),
                  totalStaked: "1000",
                  participants: 50,
                  trend: 'up',
                  percentageChange: 5.2
                },
                'no': {
                  value: 1.8,
                  timestamp: Date.now(),
                  totalStaked: "800",
                  participants: 35,
                  trend: 'down',
                  percentageChange: -3.1
                }
              }}
              updateInterval={5000}
              onOddsUpdate={(odds) => {
                // Handle odds updates here
                console.log('Odds updated:', odds);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}