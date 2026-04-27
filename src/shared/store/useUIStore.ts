import { create } from 'zustand';

export type ActiveTab = 'inventory' | 'add';

interface UIState {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'inventory',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
}));
