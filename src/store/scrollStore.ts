// Mutable singleton store for high-performance 60fps/120fps animation loop
// Handles both continuous scroll metrics and interactive bespoke mocktail alchemy state

export type BaseDistillate = 'yuzu' | 'blood_orange' | 'juniper';
export type NootropicStack = 'alpha' | 'social' | 'euphoria';
export type ChillMode = 'ice' | 'neat';
export type SealColor = 'gold' | 'noir' | 'copper';

export interface BespokeFormula {
  base: BaseDistillate;
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

export interface ScrollStore {
  // Continuous scroll telemetry
  progress: number;
  velocity: number;
  cursor: { x: number; y: number };
  stage: number;

  // Bespoke Formulation Alchemy State
  formula: BespokeFormula;
  order: CustomerOrder;

  // Reactivity listeners
  listeners: Set<() => void>;
  subscribe: (fn: () => void) => () => void;
  notify: () => void;

  // Mutation actions
  setBase: (base: BaseDistillate) => void;
  setNootropic: (stack: NootropicStack) => void;
  setChill: (chill: ChillMode) => void;
  setSeal: (seal: SealColor) => void;
  setCustomName: (name: string) => void;
  setEngravedInitials: (initials: string) => void;
  setCustomerOrder: (order: Partial<CustomerOrder>) => void;
  confirmOrder: () => void;
}

export const scrollStore: ScrollStore = {
  progress: 0,
  velocity: 0,
  cursor: { x: 0, y: 0 },
  stage: 1,

  formula: {
    base: 'yuzu',
    nootropic: 'alpha',
    chill: 'ice',
    seal: 'gold',
    customName: 'AETHER // BESPOKE',
    engravedInitials: 'AT',
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

  setBase(base: BaseDistillate) {
    this.formula.base = base;
    this.notify();
  },

  setNootropic(stack: NootropicStack) {
    this.formula.nootropic = stack;
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
