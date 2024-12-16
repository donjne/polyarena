import { create } from 'zustand';
import { UserProfile } from './user';
import { Arena } from './arena';
import { Leaderboard } from './leaderboard';

interface StoreState {
  user: UserProfile | null;
  activeArenas: Arena[];
  leaderboards: Leaderboard[];
  selectedArena: Arena | null;
  actions: {
    setUser: (user: UserProfile | null) => void;
    updateArenas: (arenas: Arena[]) => void;
    selectArena: (arena: Arena | null) => void;
    updateLeaderboards: (leaderboards: Leaderboard[]) => void;
  };
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  activeArenas: [],
  leaderboards: [],
  selectedArena: null,
  actions: {
    setUser: (user) => set({ user }),
    updateArenas: (arenas) => set({ activeArenas: arenas }),
    selectArena: (arena) => set({ selectedArena: arena }),
    updateLeaderboards: (leaderboards) => set({ leaderboards })
  }
}));