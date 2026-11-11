// Mutable singleton store for high-performance 60fps/120fps animation loop
// Continuous values (progress, velocity, cursor) are read directly inside useFrame()
// Discrete states (stage, serveMode, drawer) support lightweight subscription callbacks

export type ServeMode = 'neat' | 'ice';
export type AllocationTier = 'single' | 'ritual' | 'vault';

export interface ScrollStore {
  // Continuous 60/120fps values (NO React setState on scroll tick)
  progress: number;
  velocity: number;
  cursor: { x: number; y: number };
  
  // Discrete state
  stage: number;
  serveMode: ServeMode;
  isDrawerOpen: boolean;
  selectedTier: AllocationTier;
  
  // Listeners for UI state transitions
  listeners: Set<() => void>;
  subscribe: (fn: () => void) => () => void;
  notify: () => void;
  setServeMode: (mode: ServeMode) => void;
  setStage: (stage: number) => void;
  setDrawerOpen: (open: boolean) => void;
  setSelectedTier: (tier: AllocationTier) => void;
}

export const scrollStore: ScrollStore = {
  progress: 0,
  velocity: 0,
  cursor: { x: 0, y: 0 },
  stage: 1,
  serveMode: 'neat',
  isDrawerOpen: false,
  selectedTier: 'ritual',
  
  listeners: new Set(),
  
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  },
  
  notify() {
    this.listeners.forEach((fn) => fn());
  },
  
  setServeMode(mode: ServeMode) {
    if (this.serveMode !== mode) {
      this.serveMode = mode;
      this.notify();
    }
  },
  
  setStage(stage: number) {
    if (this.stage !== stage) {
      this.stage = stage;
      this.notify();
    }
  },
  
  setDrawerOpen(open: boolean) {
    this.isDrawerOpen = open;
    this.notify();
  },
  
  setSelectedTier(tier: AllocationTier) {
    this.selectedTier = tier;
    this.notify();
  }
};

