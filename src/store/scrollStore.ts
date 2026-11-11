// Mutable singleton store for high-performance 60fps/120fps animation loop
// Handles both continuous scroll metrics and interactive bespoke mocktail alchemy state
import { audioSystem } from '../utils/audioSystem';

export type BaseDistillate = 'yuzu' | 'blood_orange' | 'juniper';
export type NootropicStack = 'alpha' | 'social' | 'euphoria';
export type ChillMode = 'ice' | 'neat';
export type SealColor = 'gold' | 'noir' | 'copper';

export interface BespokeFormula {
  base: BaseDistillate | null; // null = vessel currently empty
  nootropic: NootropicStack;
  chill: ChillMode;
  seal: SealColor;
  customName: string;
  engravedInitials: string;
}

export interface CustomerOrder {
  fullName: string;
  address: string;
  city: string;
  email: string;
  confirmed: boolean;
  serialNumber: string;
}

export interface PourState {
  fillLevel: number;        // 0.0 (empty) to 1.0 (full)
  targetFillLevel: number;
  isPouring: boolean;       // true when stream pours in from top
  isDraining: boolean;      // true when vessel empties
  activeBase: BaseDistillate | null;
  pendingBase: BaseDistillate | null;
  statusText: string;
  infusionPulse: number;    // bumps up on stage 3 nootropic selection
}

export interface ScrollStore {
  // Continuous scroll telemetry (read in useFrame / GSAP, never causes React re-renders)
  progress: number;
  velocity: number;
  cursor: { x: number; y: number };
  stage: number;

  // Bespoke Formulation Alchemy State
  formula: BespokeFormula;
  order: CustomerOrder;
  pour: PourState;

  // Reactivity listeners (strictly for discrete UI updates: clicks, stage crossing, inputs)
  listeners: Set<() => void>;
  subscribe: (fn: () => void) => () => void;
  notify: () => void;

  // Interactive Actions
  selectBase: (base: BaseDistillate) => void;
  setNootropic: (stack: NootropicStack) => void;
  setChill: (chill: ChillMode) => void;
  setSeal: (seal: SealColor) => void;
  setCustomName: (name: string) => void;
  setEngravedInitials: (initials: string) => void;
  setCustomerOrder: (order: Partial<CustomerOrder>) => void;
  confirmOrder: () => void;
  updatePourPhysics: (delta: number) => void;
}

export const scrollStore: ScrollStore = {
  progress: 0,
  velocity: 0,
  cursor: { x: 0, y: 0 },
  stage: 1,

  formula: {
    base: null, // Starts completely empty!
    nootropic: 'alpha',
    chill: 'ice',
    seal: 'gold',
    customName: 'AETHER // BESPOKE',
    engravedInitials: 'AT',
  },

  pour: {
    fillLevel: 0.0, // Empty vessel at genesis
    targetFillLevel: 0.0,
    isPouring: false,
    isDraining: false,
    activeBase: null,
    pendingBase: null,
    statusText: 'Vessel Unfilled',
    infusionPulse: 0,
  },

  order: {
    fullName: '',
    address: '',
    city: '',
    email: '',
    confirmed: false,
    serialNumber: '',
  },

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

  // Robust, bug-free liquid pouring and draining state machine
  selectBase(base: BaseDistillate) {
    const p = this.pour;

    // If already active or queued for this base and not currently draining, ignore duplicate click
    if ((p.activeBase === base || p.pendingBase === base) && !p.isDraining) {
      return;
    }

    // If currently draining, smoothly switch the pending destination
    if (p.isDraining) {
      p.pendingBase = base;
      this.notify();
      return;
    }

    if (!p.activeBase || p.fillLevel < 0.05) {
      // Bottle is empty -> Pour directly
      this.formula.base = base;
      p.activeBase = base;
      p.pendingBase = null;
      p.isPouring = true;
      p.isDraining = false;
      p.targetFillLevel = 1.0;
      p.statusText = 'Infusing distillation stream...';
      audioSystem.playPour();
      this.notify();
    } else {
      // Bottle already has liquid -> Drain smoothly first, then pour the new selection
      p.pendingBase = base;
      p.isDraining = true;
      p.isPouring = false;
      p.targetFillLevel = 0.0;
      p.statusText = 'Clearing vessel for new distillation...';
      audioSystem.playDrain();
      this.notify();
    }
  },

  // Ticked every frame in useFrame (60fps) to smoothly advance fillLevel without React overhead
  updatePourPhysics(delta: number) {
    const p = this.pour;
    let needsNotification = false;

    // Gracefully commence initial pour if user scrolls into Stage 2 without manual click
    if (this.progress >= 0.22 && !this.formula.base && !p.isPouring && !p.isDraining && !p.pendingBase) {
      this.selectBase('yuzu');
    }

    if (p.isDraining) {
      // Drain smoothly down to 0
      p.fillLevel = Math.max(0, p.fillLevel - delta * 1.5);
      if (p.fillLevel <= 0.01) {
        p.fillLevel = 0.0;
        p.isDraining = false;
        // Switch formula base to pending base and commence pour
        if (p.pendingBase) {
          const nextBase = p.pendingBase;
          this.formula.base = nextBase;
          p.activeBase = nextBase;
          p.pendingBase = null;
          p.isPouring = true;
          p.targetFillLevel = 1.0;
          p.statusText = 'Infusing fresh distillation stream...';
          audioSystem.playPour();
          needsNotification = true;
        } else {
          p.statusText = 'Vessel Empty';
          needsNotification = true;
        }
      }
    } else if (p.isPouring) {
      // Rise smoothly up to 1.0 with fluid easing
      p.fillLevel = Math.min(1.0, p.fillLevel + delta * 1.0);
      if (p.fillLevel >= 0.99) {
        p.fillLevel = 1.0;
        p.isPouring = false;
        p.statusText = 'Vessel at capacity';
        needsNotification = true;
      }
    }

    if (p.infusionPulse > 0) {
      p.infusionPulse = Math.max(0, p.infusionPulse - delta * 0.8);
    }

    if (needsNotification) {
      this.notify();
    }
  },

  setNootropic(stack: NootropicStack) {
    this.formula.nootropic = stack;
    this.pour.infusionPulse = 1.0; // Trigger botanical particulate bloom in WebGL
    this.notify();
  },

  setChill(chill: ChillMode) {
    this.formula.chill = chill;
    this.notify();
  },

  setSeal(seal: SealColor) {
    this.formula.seal = seal;
    this.notify();
  },

  setCustomName(name: string) {
    this.formula.customName = name;
    this.notify();
  },

  setEngravedInitials(initials: string) {
    this.formula.engravedInitials = initials;
    this.notify();
  },

  setCustomerOrder(order: Partial<CustomerOrder>) {
    Object.assign(this.order, order);
    this.notify();
  },

  confirmOrder() {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    this.order.serialNumber = `AETH-BESPOKE-${randomHex}`;
    this.order.confirmed = true;
    this.notify();
  }
};
