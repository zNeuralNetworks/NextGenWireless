import { create } from 'zustand';
import type { ScenarioId } from './constants';

type Mode = 'executive' | 'architect';

// Subset of AppState that setSandboxConfig is allowed to patch
export type SandboxConfigPatch = Partial<{
  sandboxArchitecture: 'centralized' | 'edge';
  sandboxStandard: 'wifi6' | 'wifi7';
  sandboxInterference: 'low' | 'high';
  sandboxAPs: number;
  sandboxLatencyBudget: number;
  sandboxFailure: 'none' | 'cloud' | 'wan' | 'controller';
  currentScenario: ScenarioId | null;
}>;

interface AppState {
  mode: Mode;
  activeView: 'landing' | 'sandbox';
  currentScenario: ScenarioId | null; // null = free-form, otherwise = guided mode
  sandboxArchitecture: 'centralized' | 'edge';
  sandboxStandard: 'wifi6' | 'wifi7';
  sandboxInterference: 'low' | 'high';
  sandboxAPs: number;
  sandboxLatencyBudget: number;
  sandboxFailure: 'none' | 'cloud' | 'wan' | 'controller';
  activeSection: string;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
  setActiveView: (view: 'landing' | 'sandbox') => void;
  setSandboxConfig: (config: SandboxConfigPatch) => void;
  setActiveSection: (id: string) => void;
  setCurrentScenario: (id: ScenarioId | null) => void;
  
  // Hero
  heroModel: 'controller' | 'system';
  setHeroModel: (model: 'controller' | 'system') => void;
  showWired: boolean;
  toggleWired: () => void;
  
  // Simulations
  stressTestValue: number;
  setStressTestValue: (val: number) => void;
  
  packetPathType: 'tunnel' | 'native';
  setPacketPathType: (type: 'tunnel' | 'native') => void;

  rogueView: 'rf-only' | 'correlated';
  setRogueView: (view: 'rf-only' | 'correlated') => void;

  failureMode: 'none' | 'mgmt' | 'ap' | 'wan';
  setFailureMode: (mode: 'none' | 'mgmt' | 'ap' | 'wan') => void;

  // ROI Calculator
  roiAPs: number;
  roiSites: number;
  roiRate: number; // $/hr
  roiTickets: number; // per week
  roiWips: boolean;
  roiTravel: boolean;
  
  setRoiAPs: (n: number) => void;
  setRoiSites: (n: number) => void;
  setRoiRate: (n: number) => void;
  setRoiTickets: (n: number) => void;
  toggleRoiWips: () => void;
  toggleRoiTravel: () => void;

  // UI Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
  copyToClipboard: (text: string, label?: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  mode: 'executive',
  activeView: 'landing',
  currentScenario: null,
  sandboxArchitecture: 'centralized',
  sandboxStandard: 'wifi6',
  sandboxInterference: 'low',
  sandboxAPs: 50,
  sandboxLatencyBudget: 50,
  sandboxFailure: 'none',
  activeSection: 'hero',
  toggleMode: () => set((state) => ({ mode: state.mode === 'executive' ? 'architect' : 'executive' })),
  setMode: (mode) => set({ mode }),
  setActiveView: (view) => set({ activeView: view }),
  setSandboxConfig: (config) => set(config),
  setActiveSection: (id) => set({ activeSection: id }),
  setCurrentScenario: (id) => set({ currentScenario: id }),

  heroModel: 'controller',
  setHeroModel: (model) => set({ heroModel: model }),
  showWired: false,
  toggleWired: () => set((state) => ({ showWired: !state.showWired })),

  stressTestValue: 50,
  setStressTestValue: (val) => set({ stressTestValue: val }),

  packetPathType: 'tunnel',
  setPacketPathType: (type) => set({ packetPathType: type }),

  rogueView: 'rf-only',
  setRogueView: (view) => set({ rogueView: view }),

  failureMode: 'none',
  setFailureMode: (mode) => set({ failureMode: mode }),

  // ROI Defaults
  roiAPs: 100,
  roiSites: 5,
  roiRate: 85,
  roiTickets: 10,
  roiWips: false,
  roiTravel: true,

  setRoiAPs: (n) => set({ roiAPs: n }),
  setRoiSites: (n) => set({ roiSites: n }),
  setRoiRate: (n) => set({ roiRate: n }),
  setRoiTickets: (n) => set({ roiTickets: n }),
  toggleRoiWips: () => set((state) => ({ roiWips: !state.roiWips })),
  toggleRoiTravel: () => set((state) => ({ roiTravel: !state.roiTravel })),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    // Use a unique timeout for each toast to avoid race conditions
    const timeoutId = setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2000);
  },
  copyToClipboard: (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      get().showToast(label ? `Copied ${label}` : `Copied: "${text}"`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}));
