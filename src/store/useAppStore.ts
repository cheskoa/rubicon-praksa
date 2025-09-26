import { create } from 'zustand';

export type ViewType = 'movies' | 'tv';

type AppState = {
  view: ViewType;
  searchQuery: string;
  setView: (v: ViewType) => void;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  view: 'movies',
  searchQuery: '',
  setView: (v) => set({ view: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: '' }),
}));


