import type { LucideIcon } from 'lucide-react';

// Base Types
export type MatchTypeId = 
  | 'standard' 
  | 'tournament' 
  | 'survivor' 
  | 'group' 
  | 'points_based' 
  | 'double_elim';

export type ScoringMechanism = 
  | 'elimination' 
  | 'bracket' 
  | 'threshold' 
  | 'group_points' 
  | 'cumulative' 
  | 'double_chance';

export type PredictionScope = 
  | 'crypto_price' 
  | 'sports_outcome' 
  | 'event_result' 
  | 'binary_outcome';

export type MarketStatus = 'active' | 'pending' | 'completed' | 'cancelled';

export interface MatchType {
  id: MatchTypeId;
  label: string;
  description: string;
  rounds: 'variable' | 'fixed';
  eliminationRules: string;
  scoringMechanism: ScoringMechanism;
  winners: string;
  icon: LucideIcon;
  minPlayers: number;
  maxPlayers?: number;
}

export interface MarketOracle {
  provider: 'pyth' | 'chainlink' | 'switchboard';
  feedId: string;
  updateFrequency: number;
  minimumConfidence: number;
}

export interface PrizeStructure {
  totalPool: string;
  distribution: {
    position: number;
    percentage: number;
  }[];
  platformFee: number;
  referralReward: number;
  communityIncentive: number;
}

export interface Arena {
  id: string;
  name: string;
  matchType: MatchTypeId;
  predictionScope: PredictionScope;
  status: MarketStatus;
  creator: string;
  timestamp: number;
  rounds: {
    current: number;
    total: number;
    timePerRound: number;
  };
  oracle: MarketOracle;
  prizeStructure: PrizeStructure;
  entryFee: string;
  players: {
    current: number;
    minimum: number;
    maximum: number;
  };
  predictions: {
    type: 'binary' | 'numeric' | 'multi_choice';
    options?: string[];
    range?: {
      min: number;
      max: number;
    };
  };
  validationRules: {
    minimumStake: string;
    maximumStake: string;
    predictionWindow: number;
    disputePeriod: number;
  };
}

// Component Props Interfaces
export interface ArenaCreationWizardProps {
  availableMatchTypes: MatchType[];
  availableOracles: Array<{
    provider: MarketOracle['provider'];
    feeds: Array<{
      id: string;
      name: string;
      description: string;
      updateFrequency: number;
      confidence: number;
    }>;
  }>;
  onSubmit: (arena: Arena) => Promise<void>;
  minStake: string;
  maxStake: string;
}

export interface PrizeStructureStepProps {
  value: Pick<Arena, 'prizeStructure'>;
  onChange: (updates: Partial<Pick<Arena, 'prizeStructure'>>) => void;
  errors?: Record<string, string>;
}

export interface PlayerSettingsStepProps {
  value: Pick<Arena, 'players' | 'entryFee' | 'validationRules'>;
  onChange: (updates: Partial<Pick<Arena, 'players' | 'entryFee' | 'validationRules'>>) => void;
  errors?: Record<string, string>;
}

export interface OracleIntegrationStepProps {
  value: Pick<Arena, 'oracle'>;
  onChange: (updates: Partial<Pick<Arena, 'oracle'>>) => void;
  availableOracles: ArenaCreationWizardProps['availableOracles'];
  errors?: Record<string, string>;
}

export interface BasicInformationStepProps {
  value: Pick<Arena, 'name' | 'matchType' | 'predictionScope'>;
  onChange: (updates: Partial<Pick<Arena, 'name' | 'matchType' | 'predictionScope'>>) => void;
  availableMatchTypes: MatchType[];
  errors?: Record<string, string>;
}

export interface MatchConfigurationStepProps {
  value: Pick<Arena, 'rounds' | 'predictions'>;
  onChange: (updates: Partial<Pick<Arena, 'rounds' | 'predictions'>>) => void;
  errors?: Record<string, string>;
}

// Wizard Step Configuration
export interface CreationStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isValid: (data: Partial<Arena>) => boolean;
}