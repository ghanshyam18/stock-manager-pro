import { create } from 'zustand';

export type ActiveTab = 'inventory' | 'add';

interface UIState {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  isSafeToExit: boolean; // Flag to bypass the "Prevent Exit" logic
  setSafeToExit: (safe: boolean) => void;
}

const useUIStoreBase = create<UIState>((set) => ({
  activeTab: 'inventory',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  isSafeToExit: false,
  setSafeToExit: (safe) => set({ isSafeToExit: safe }),
}));

// World-class practice: Exporting selectors to prevent unnecessary re-renders
export const useActiveTab = () => useUIStoreBase((state) => state.activeTab);
export const useSetActiveTab = () => useUIStoreBase((state) => state.setActiveTab);
export const useIsAddModalOpen = () => useUIStoreBase((state) => state.isAddModalOpen);
export const useSetAddModalOpen = () => useUIStoreBase((state) => state.setAddModalOpen);
export const useIsSafeToExit = () => useUIStoreBase((state) => state.isSafeToExit);
export const useSetSafeToExit = () => useUIStoreBase((state) => state.setSafeToExit);

export const useUIStore = useUIStoreBase;
