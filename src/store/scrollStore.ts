// Mutable singleton store for high-performance 60fps/120fps animation loop
// Handles continuous scroll metrics and factual 500mL proportional mocktail formulation
import { audioSystem } from '../utils/audioSystem';

export type BaseDistillate = 'yuzu' | 'blood_orange' | 'juniper';
export type NootropicStack = 'alpha' | 'social' | 'restoration';
export type BotanicalModifier = 'rosemary' | 'vetiver' | 'shiso';
export type ChillMode = 'glacial' | 'cellar';
export type SealColor = 'brass' | 'noir' | 'copper' | 'silver' | 'gold';
export type GlassTint = 'clear' | 'obsidian' | 'amber' | 'frosted';
export type LabelPaper = 'ivory' | 'noir' | 'washi';
export type WaxDip = 'none' | 'crimson' | 'black' | 'gold';

export interface BespokeFormula {
  base: BaseDistillate | null;       // 320mL (64%)
  nootropic: NootropicStack | null;  // 80mL  (16%)
  modifier: BotanicalModifier | null;// 60mL  (12%)
  chill: ChillMode;                  // 40mL  (8%)
  seal: SealColor;
  glassTint: GlassTint;
  labelPaper: LabelPaper;
  waxDip: WaxDip;
  customName: string;
  engravedInitials: string;
  batchYear: string;
}

export interface CustomerOrder {
  fullName: string;
  address: string;
  city: string;
  email: string;
  confirmed: boolean;
  serialNumber: string;
  quantity: 1 | 2 | 6;
  currency: 'USD' | 'EUR' | 'GBP';
  memberCode: string;
  totalPrice: number;
}

export interface PourState {
  fillLevel: number;        // Continuous 0.0 to 1.0 (read by Three.js in useFrame)
  targetFillLevel: number;  // Driven by cumulative volume (320mL -> 400mL -> 460mL -> 500mL)
  isPouring: boolean;       // Active fluid stream from neck
  isDraining: boolean;      // Active rotational drainage vortex
  currentVolumeMl: number;  // Factual volume in mL (0 to 500)
  targetVolumeMl: number;
  activeBase: BaseDistillate | null;
  pendingBase: BaseDistillate | null;
  statusText: string;
  waveTurbulence: number;   // Surface ripple intensity
}

export interface ScrollStore {
  // Continuous scroll telemetry (read directly in useFrame, zero React overhead)
  progress: number;
  velocity: number;
  cursor: { x: number; y: number };
  stage: number;

  // Factual Formulation Alchemy State
  formula: BespokeFormula;
  order: CustomerOrder;
  pour: PourState;

  // Reactivity listeners (discrete UI updates only)
  listeners: Set<() => void>;
  subscribe: (fn: () => void) => () => void;
  notify: () => void;

  // Interactive Actions
  selectBase: (base: BaseDistillate) => void;
  selectNootropic: (stack: NootropicStack) => void;
  selectModifier: (mod: BotanicalModifier) => void;
  setChill: (chill: ChillMode) => void;
  setSeal: (seal: SealColor) => void;
  setGlassTint: (tint: GlassTint) => void;
  setLabelPaper: (paper: LabelPaper) => void;
  setWaxDip: (wax: WaxDip) => void;
  setCustomName: (name: string) => void;
  setEngravedInitials: (initials: string) => void;
  setBatchYear: (year: string) => void;
  setCustomerOrder: (order: Partial<CustomerOrder>) => void;
  recalculatePrice: () => void;
  confirmOrder: () => void;
  updatePourPhysics: (delta: number) => void;
  recalculateTargetVolume: () => void;
}

export const scrollStore: ScrollStore = {
  progress: 0,
  velocity: 0,
  cursor: { x: 0, y: 0 },
  stage: 1,

  formula: {
    base: null,
    nootropic: null,
    modifier: null,
    chill: 'glacial',
    seal: 'brass',
    glassTint: 'clear',
    labelPaper: 'ivory',
    waxDip: 'none',
    customName: 'AETHER // BESPOKE',
    engravedInitials: 'AT',
    batchYear: '2026 // CASK 01',
  },

  pour: {
    fillLevel: 0.0,
    targetFillLevel: 0.0,
    isPouring: false,
    isDraining: false,
    currentVolumeMl: 0,
    targetVolumeMl: 0,
    activeBase: null,
    pendingBase: null,
    statusText: 'Vessel Unfilled (0 / 500mL)',
    waveTurbulence: 0,
  },

  order: {
    fullName: 'Abhayjeet Tomar',
    address: '740 Park Avenue, Residence 4B',
    city: 'New York, NY 10021',
    email: 'atelier@aether.luxury',
    confirmed: false,
    serialNumber: '',
    quantity: 1,
    currency: 'USD',
    memberCode: '',
    totalPrice: 173,
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

  // Calculate factual cumulative target volume based on selections
  recalculateTargetVolume() {
    let vol = 0;
    if (this.formula.base) vol += 320;
    if (this.formula.nootropic) vol += 80;
    if (this.formula.modifier) vol += 60;
    if (this.formula.chill === 'glacial' && this.progress >= 0.56) {
      vol += 40;
    }

    this.pour.targetVolumeMl = vol;
    this.pour.targetFillLevel = Math.min(1.0, vol / 500);
  },

  // Selecting Base Distillate (320mL Foundation)
  selectBase(base: BaseDistillate) {
    const p = this.pour;

    if (p.activeBase === base && !p.isDraining) {
      return;
    }

    if (p.isDraining) {
      p.pendingBase = base;
      this.notify();
      return;
    }

    if (!p.activeBase || p.fillLevel < 0.05) {
      // Pour foundation directly into empty vessel
      this.formula.base = base;
      p.activeBase = base;
      p.pendingBase = null;
      p.isPouring = true;
      p.isDraining = false;
      p.waveTurbulence = 1.0;
      this.recalculateTargetVolume();
      p.statusText = 'Pouring 320mL primary distillation...';
      audioSystem.playPour();
      this.notify();
    } else {
      // Drain vessel smoothly first to clear old blend
      p.pendingBase = base;
      p.isDraining = true;
      p.isPouring = false;
      p.targetFillLevel = 0.0;
      p.statusText = 'Purifying vessel for fresh distillation...';
      audioSystem.playDrain();
      this.notify();
    }
  },

  // Selecting Bioactive Adaptogen Stack (+80mL)
  selectNootropic(stack: NootropicStack) {
    if (!this.formula.base) {
      this.selectBase('yuzu');
    }
    this.formula.nootropic = stack;
    this.recalculateTargetVolume();
    this.pour.isPouring = true;
    this.pour.waveTurbulence = 1.0;
    this.pour.statusText = 'Infusing 80mL bioactive adaptogen extract...';
    audioSystem.playPour();
    this.notify();
  },

  // Selecting Botanical Modifier Cordial (+60mL)
  selectModifier(mod: BotanicalModifier) {
    if (!this.formula.base) this.selectBase('yuzu');
    if (!this.formula.nootropic) this.selectNootropic('alpha');

    this.formula.modifier = mod;
    this.recalculateTargetVolume();
    this.pour.isPouring = true;
    this.pour.waveTurbulence = 0.8;
    this.pour.statusText = 'Blending 60mL botanical modifier hydrosol...';
    audioSystem.playPour();
    this.notify();
  },

  setChill(chill: ChillMode) {
    this.formula.chill = chill;
    this.recalculateTargetVolume();
    if (chill === 'glacial') {
      audioSystem.playClink();
      this.pour.isPouring = true;
      this.pour.waveTurbulence = 0.6;
      this.pour.statusText = 'Chilled over artisanal crystal ice (+40mL melt volume)';
    } else {
      audioSystem.playClick(750);
      this.pour.statusText = 'Cellar serve: 16°C ambient botanical expression';
    }
    this.notify();
  },

  setSeal(seal: SealColor) {
    this.formula.seal = seal;
    this.notify();
  },

  setGlassTint(tint: GlassTint) {
    this.formula.glassTint = tint;
    this.notify();
  },

  setLabelPaper(paper: LabelPaper) {
    this.formula.labelPaper = paper;
    this.notify();
  },

  setWaxDip(wax: WaxDip) {
    this.formula.waxDip = wax;
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

  setBatchYear(year: string) {
    this.formula.batchYear = year;
    this.notify();
  },

  setCustomerOrder(order: Partial<CustomerOrder>) {
    Object.assign(this.order, order);
    this.recalculatePrice();
    this.notify();
  },

  recalculatePrice() {
    const qty = this.order.quantity || 1;
    let baseUsd = 145;
    let engravingUsd = 28;
    if (qty === 2) {
      baseUsd = 260;
      engravingUsd = 50;
    } else if (qty === 6) {
      baseUsd = 720;
      engravingUsd = 100;
    }

    let discountUsd = 0;
    const cleanCode = (this.order.memberCode || '').trim().toUpperCase();
    if (cleanCode === 'VIP-AETHER' || cleanCode === 'ATELIER15' || cleanCode === 'ABHAYJEET') {
      discountUsd = 15 * qty;
    }

    const subtotalUsd = Math.max(0, baseUsd + engravingUsd - discountUsd);

    let rate = 1.0;
    if (this.order.currency === 'EUR') rate = 0.92;
    else if (this.order.currency === 'GBP') rate = 0.79;

    this.order.totalPrice = Math.round(subtotalUsd * rate);
  },

  confirmOrder() {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    this.order.serialNumber = `AETH-BESPOKE-${randomHex}`;
    this.order.confirmed = true;
    this.notify();
  },

  // High-precision fluid physics tick (runs in useFrame at 60/120fps)
  updatePourPhysics(delta: number) {
    const p = this.pour;
    let needsNotification = false;

    // Automatic smooth proportional pours as user scrolls through stages (if not manually chosen)
    if (this.progress >= 0.18 && !this.formula.base && !p.isPouring && !p.isDraining && !p.pendingBase && p.fillLevel === 0) {
      this.selectBase('yuzu');
      return;
    }

    if (this.progress >= 0.38 && !this.formula.nootropic && !p.isPouring && !p.isDraining) {
      this.selectNootropic('alpha');
      return;
    }

    if (this.progress >= 0.58 && !this.formula.modifier && !p.isPouring && !p.isDraining) {
      this.selectModifier('rosemary');
      return;
    }

    if (p.isDraining) {
      // Liquid drains down with vortex swirl
      p.fillLevel = Math.max(0, p.fillLevel - delta * 1.8);
      p.currentVolumeMl = Math.round(p.fillLevel * 500);

      if (p.fillLevel <= 0.01) {
        p.fillLevel = 0.0;
        p.currentVolumeMl = 0;
        p.isDraining = false;

        // Switch to pending base and commence fresh proportional pour
        if (p.pendingBase) {
          const nextBase = p.pendingBase;
          this.formula.base = nextBase;
          p.activeBase = nextBase;
          p.pendingBase = null;
          p.isPouring = true;
          p.waveTurbulence = 1.0;
          this.recalculateTargetVolume();
          p.statusText = 'Pouring 320mL primary distillation...';
          audioSystem.playPour();
          needsNotification = true;
        } else {
          p.statusText = 'Vessel Empty (0 / 500mL)';
          needsNotification = true;
        }
      }
    } else if (p.isPouring) {
      // Liquid rises steadily toward target proportional level
      if (p.fillLevel < p.targetFillLevel) {
        p.fillLevel = Math.min(p.targetFillLevel, p.fillLevel + delta * 0.55);
        p.currentVolumeMl = Math.round(p.fillLevel * 500);
      } else {
        p.fillLevel = p.targetFillLevel;
        p.currentVolumeMl = p.targetVolumeMl;
        p.isPouring = false;
        p.statusText = `Formulation active at ${p.currentVolumeMl}mL / 500mL`;
        needsNotification = true;
      }
    }

    // Decay fluid wave turbulence
    if (p.waveTurbulence > 0) {
      p.waveTurbulence = Math.max(0, p.waveTurbulence - delta * 0.6);
    }

    if (needsNotification) {
      this.notify();
    }
  }
};
