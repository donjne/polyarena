// data/matchTypes.ts
import { Sword, Trophy, Users, Brackets } from 'lucide-react';
import type { MatchType } from '@/types/arena';

export const matchTypes: MatchType[] = [
  {
    id: 'standard',
    label: 'Standard',
    icon: Sword,
    description: 'Head-to-head prediction battles',
    rounds: 'fixed',
    eliminationRules: 'single elimination',
    scoringMechanism: 'elimination',
    winners: 'single winner',
    minPlayers: 2,
    maxPlayers: 2
  },
  {
    id: 'tournament',
    label: 'Tournament',
    icon: Trophy,
    description: 'Bracketed tournament format',
    rounds: 'variable',
    eliminationRules: 'bracket elimination',
    scoringMechanism: 'bracket',
    winners: 'tiered prizes',
    minPlayers: 8,
    maxPlayers: 32
  },
  {
    id: 'group',
    label: 'Group',
    icon: Users,
    description: 'Group-based competitions',
    rounds: 'fixed',
    eliminationRules: 'group stage',
    scoringMechanism: 'group_points',
    winners: 'top performers',
    minPlayers: 4,
    maxPlayers: 16
  },
  {
    id: 'double_elim',
    label: 'Double Elimination',
    icon: Brackets,
    description: 'Double elimination tournament',
    rounds: 'variable',
    eliminationRules: 'double elimination',
    scoringMechanism: 'double_chance',
    winners: 'bracket winner',
    minPlayers: 4,
    maxPlayers: 16
  }
];