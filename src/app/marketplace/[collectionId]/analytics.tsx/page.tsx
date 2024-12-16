// app/marketplace/[collectionId]/analytics/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TrendAnalysis } from '@/components/analytics/TrendAnalysis';
import { MarketplaceAnalytics } from '@/components/analytics/MarketAnalytics';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import type { NFTCollection } from '@/types/marketplace';
import type { TrendPoint, TrendIndicator, MarketStats, TimeSeriesData, CategoryPerformance } from '@/types/analytics';

export default function CollectionAnalyticsPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = React.useState<NFTCollection | null>(null);
  const [trendData, setTrendData] = React.useState<TrendPoint[]>([]);
  const [indicators, setIndicators] = React.useState<TrendIndicator[]>([]);
  const [marketStats, setMarketStats] = React.useState<MarketStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = React.useState<TimeSeriesData[]>([]);
  const [categoryData, setCategoryData] = React.useState<CategoryPerformance[]>([]);

  // Fetch collection and analytics data
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          collectionRes,
          trendRes,
          indicatorsRes,
          statsRes,
          timeSeriesRes,
          categoryRes
        ] = await Promise.all([
          fetch(`/api/marketplace/collections/${collectionId}`),
          fetch(`/api/marketplace/collections/${collectionId}/trends`),
          fetch(`/api/marketplace/collections/${collectionId}/indicators`),
          fetch(`/api/marketplace/collections/${collectionId}/stats`),
          fetch(`/api/marketplace/collections/${collectionId}/timeseries`),
          fetch(`/api/marketplace/collections/${collectionId}/categories`)
        ]);

        const [
          collectionData,
          trendData,
          indicatorsData,
          statsData,
          timeSeriesData,
          categoryData
        ] = await Promise.all([
          collectionRes.json(),
          trendRes.json(),
          indicatorsRes.json(),
          statsRes.json(),
          timeSeriesRes.json(),
          categoryRes.json()
        ]);

        setCollection(collectionData);
        setTrendData(trendData);
        setIndicators(indicatorsData);
        setMarketStats(statsData);
        setTimeSeriesData(timeSeriesData);
        setCategoryData(categoryData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    if (collectionId) {
      fetchAnalytics();
    }
  }, [collectionId]);

  const handleTimeframeChange = async (days: number) => {
    try {
      const [trendRes, timeSeriesRes] = await Promise.all([
        fetch(`/api/marketplace/collections/${collectionId}/trends?timeframe=${days}`),
        fetch(`/api/marketplace/collections/${collectionId}/timeseries?timeframe=${days}`)
      ]);

      const [trendData, timeSeriesData] = await Promise.all([
        trendRes.json(),
        timeSeriesRes.json()
      ]);

      setTrendData(trendData);
      setTimeSeriesData(timeSeriesData);
    } catch (error) {
      console.error('Error updating timeframe:', error);
    }
  };

  const handleIndicatorToggle = (type: TrendIndicator['type']) => {
    setIndicators(prev => 
      prev.map(indicator => 
        indicator.type === type 
          ? { ...indicator, enabled: !indicator.enabled }
          : indicator
      )
    );
  };

  if (!collection || !marketStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-purple-100 rounded-xl" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-purple-100 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-purple-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Market Trends */}
      <TrendAnalysis
        data={trendData}
        indicators={indicators}
        onTimeframeChange={handleTimeframeChange}
        onIndicatorToggle={handleIndicatorToggle}
      />

      {/* Market Statistics */}
      <MarketplaceAnalytics
        stats={marketStats}
        timeSeriesData={timeSeriesData}
        categoryData={categoryData}
        onTimeframeChange={timeframe => handleTimeframeChange(
          timeframe === 'day' ? 1 :
          timeframe === 'week' ? 7 :
          timeframe === 'month' ? 30 : 365
        )}
        onCategorySelect={() => {}}
      />

      {/* Category Analysis */}
      <CategoryBreakdown
        data={categoryData}
        onRefresh={() => {}}
        onCategorySelect={() => {}}
        lastUpdated={new Date()}
      />
    </div>
  );
}