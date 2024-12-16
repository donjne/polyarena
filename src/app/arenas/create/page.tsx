'use client';

import React from 'react';
import { ArenaCreationWizard } from '@/components/creation/ArenaCreationWizard';
import type { Arena, MatchType } from '@/types/arena';
import { 
  Trophy, Flag, Users, Target, 
  GitBranch, Award, BarChart2, Zap 
} from 'lucide-react';

export default function CreateArenaPage() {
  const availableMatchTypes: MatchType[] = [
    {
      id: 'standard',
      label: 'Standard Match',
      description: 'Simple prediction match with direct winners',
      rounds: 'fixed',
      eliminationRules: 'single',
      scoringMechanism: 'elimination',
      winners: 'top_3',
      icon: Trophy,
      minPlayers: 2,
      maxPlayers: 100
    },
    {
      id: 'tournament',
      label: 'Tournament',
      description: 'Multi-round bracket tournament with eliminations',
      rounds: 'variable',
      eliminationRules: 'bracket',
      scoringMechanism: 'bracket',
      winners: 'bracket_winner',
      icon: GitBranch,
      minPlayers: 8,
      maxPlayers: 64
    },
    {
      id: 'survivor',
      label: 'Survivor Pool',
      description: 'Last player standing wins it all',
      rounds: 'variable',
      eliminationRules: 'progressive',
      scoringMechanism: 'elimination',
      winners: 'last_standing',
      icon: Target,
      minPlayers: 10,
      maxPlayers: 1000
    },
    {
      id: 'points_based',
      label: 'Points Race',
      description: 'Accumulate points across multiple predictions',
      rounds: 'fixed',
      eliminationRules: 'none',
      scoringMechanism: 'cumulative',
      winners: 'top_scores',
      icon: BarChart2,
      minPlayers: 2,
      maxPlayers: 500
    }
  ];

  const availableOracles = [
    {
      provider: 'pyth' as const,
      feeds: [
        {
          id: 'crypto.btc.usd',
          name: 'BTC/USD',
          description: 'Bitcoin price feed with 15s updates',
          updateFrequency: 15,
          confidence: 0.95
        },
        {
          id: 'crypto.eth.usd',
          name: 'ETH/USD',
          description: 'Ethereum price feed with 15s updates',
          updateFrequency: 15,
          confidence: 0.95
        }
      ]
    },
    {
      provider: 'chainlink' as const,
      feeds: [
        {
          id: 'eth.usd.price',
          name: 'ETH/USD',
          description: 'Ethereum price with high precision',
          updateFrequency: 30,
          confidence: 0.98
        },
        {
          id: 'btc.usd.price',
          name: 'BTC/USD',
          description: 'Bitcoin price with high precision',
          updateFrequency: 30,
          confidence: 0.98
        }
      ]
    },
    {
      provider: 'switchboard' as const,
      feeds: [
        {
          id: 'sol.usd.spot',
          name: 'SOL/USD',
          description: 'Solana price aggregated from CEXs',
          updateFrequency: 10,
          confidence: 0.96
        },
        {
          id: 'matic.usd.spot',
          name: 'MATIC/USD',
          description: 'Polygon price aggregated from CEXs',
          updateFrequency: 10,
          confidence: 0.96
        }
      ]
    }
  ];

  const handleSubmit = async (arena: Arena) => {
    try {
      // Add API call to create arena
      console.log('Creating arena:', arena);
      
      // Example API call:
      // const response = await fetch('/api/arenas', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(arena),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create arena');
      // }
      // 
      // const data = await response.json();
      // return data;
      
    } catch (error) {
      console.error('Error creating arena:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to create arena');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-900">Create Arena</h1>
        <p className="text-purple-600">Configure your prediction competition</p>
      </div>

      <ArenaCreationWizard
        availableMatchTypes={availableMatchTypes}
        availableOracles={availableOracles}
        onSubmit={handleSubmit}
        minStake="0.1"
        maxStake="1000"
      />

      {/* Optional: Add additional information or help text */}
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">
          Need Help?
        </h3>
        <p className="text-purple-600">
          Join our Discord community for support or check out our documentation
          for detailed guides on creating and managing arenas.
        </p>
      </div>
    </div>
  );
}