import { create } from 'zustand';

interface CopilotContextState {
  type: 'incident' | 'service' | 'infrastructure' | 'general';
  id?: string | number;
  name?: string;
}

interface UiStore {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  isCopilotOpen: boolean;
  copilotContext: CopilotContextState;
  openCopilot: (context?: CopilotContextState) => void;
  closeCopilot: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  
  isCopilotOpen: false,
  copilotContext: { type: 'general' },
  openCopilot: (context) => set({
    isCopilotOpen: true,
    copilotContext: context || { type: 'general' }
  }),
  closeCopilot: () => set({ isCopilotOpen: false })
}));
