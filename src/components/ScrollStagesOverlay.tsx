import React, { useEffect, useState } from 'react';
import { 
  Snowflake, 
  Flame, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Droplet,
  Layers,
  Award,
  Sparkles,
  Printer,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { 
  scrollStore, 
  BaseDistillate, 
  NootropicStack, 
  BotanicalModifier,
  ChillMode, 
  SealColor,
  GlassTint,
  LabelPaper,
  WaxDip
} from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function ScrollStagesOverlay() {
  const [scrollProgress, setScrollProgress] = useState(scrollStore.progress);
  const [formula, setFormula] = useState({ ...scrollStore.formula });
  const [order, setOrder] = useState({ ...scrollStore.order });
  const [pourState, setPourState] = useState({ ...scrollStore.pour });
  const [promoInput, setPromoInput] = useState(order.memberCode || '');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Listen to discrete store updates
    const unsub = scrollStore.subscribe(() => {
      setFormula({ ...scrollStore.formula });
      setOrder({ ...scrollStore.order });
      setPourState({ ...scrollStore.pour });
    });
    return unsub;
  }, []);

  // High-performance RAF listener for smooth continuous card interpolation and scrubber bars
  useEffect(() => {
    let animId: number;
    let lastP = -1;
    const checkScroll = () => {
      const curP = scrollStore.progress;
      if (Math.abs(curP - lastP) > 0.002) {
        lastP = curP;
        setScrollProgress(curP);
      }
      animId = requestAnimationFrame(checkScroll);
    };
    animId = requestAnimationFrame(checkScroll);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSelectBase = (baseId: BaseDistillate) => {
    audioSystem.playClick(920);
    scrollStore.selectBase(baseId);
  };

  const handleSelectNootropic = (stackId: NootropicStack) => {
    audioSystem.playClick(1050);
    scrollStore.selectNootropic(stackId);
  };

  const handleSelectModifier = (modId: BotanicalModifier) => {
    audioSystem.playClick(960);
    scrollStore.selectModifier(modId);
  };

  const handleSelectChill = (mode: ChillMode) => {
    scrollStore.setChill(mode);
  };

  const handleSelectSeal = (seal: SealColor) => {
    audioSystem.playClick(880);
    scrollStore.setSeal(seal);
  };

  const handleSelectGlassTint = (tint: GlassTint) => {
    audioSystem.playClick(890);
    scrollStore.setGlassTint(tint);
  };

  const handleSelectLabelPaper = (paper: LabelPaper) => {
    audioSystem.playClick(910);
    scrollStore.setLabelPaper(paper);
  };

  const handleSelectWaxDip = (wax: WaxDip) => {
    audioSystem.playClick(870);
    scrollStore.setWaxDip(wax);
  };

  const handleSelectQuantity = (qty: 1 | 2 | 6) => {
    audioSystem.playClick(930);
    scrollStore.setCustomerOrder({ quantity: qty });
  };

  const handleSelectCurrency = (curr: 'USD' | 'EUR' | 'GBP') => {
    audioSystem.playClick(950);
    scrollStore.setCustomerOrder({ currency: curr });
  };

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'VIP-AETHER' || clean === 'ATELIER15' || clean === 'ABHAYJEET') {
      audioSystem.playClink();
      scrollStore.setCustomerOrder({ memberCode: clean });
      setPromoFeedback('Privilege Key Authenticated (-$15/vessel)');
    } else if (clean === '') {
      scrollStore.setCustomerOrder({ memberCode: '' });
      setPromoFeedback(null);
    } else {
      audioSystem.playClick(440);
      setPromoFeedback('Unrecognized Atelier Key');
    }
  };

  // 1. Factual 320mL Base Distillates (64% of 500mL)
  const bases: { id: BaseDistillate; name: string; subtitle: string; color: string; notes: string; vol: string }[] = [
    {
      id: 'yuzu',
      name: 'Japanese Yuzu & Bitter Chinotto',
      subtitle: 'Cold-distilled Tokushima yuzu peel, charred bergamot, chinotto leaf',
      color: '#D97706',
      notes: 'Golden Amber · High monoterpenes · Dry mineral finish',
      vol: '320mL (64%)',
    },
    {
      id: 'blood_orange',
      name: 'Smoked Sicilian Orange & Gentian',
      subtitle: 'Torched Moro orange rind, sun-dried mission fig, alpine gentian root',
      color: '#991B1B',
      notes: 'Smoked Ruby · Amaro bitterness · Velvety mouthfeel',
      vol: '320mL (64%)',
    },
    {
      id: 'juniper',
      name: 'Wild Alpine Juniper & Silver Fir',
      subtitle: 'Sub-zero vacuum-extracted juniper cones, silver fir, green coriander',
      color: '#065F46',
      notes: 'Forest Emerald · Resinous cedar · Crisp mountain rain',
      vol: '320mL (64%)',
    },
  ];

  // 2. Factual 80mL Bioactive Nootropics (16% of 500mL)
  const nootropics: { id: NootropicStack; name: string; dose: string; desc: string; roman: string }[] = [
    {
      id: 'alpha',
      roman: 'I',
      name: 'Alpha-Wave Cognitive Flow',
      dose: '600mg Lion\'s Mane (10:1 Dual Extract) · 250mg L-Theanine',
      desc: 'Stimulates neuro-trophic synthesis and calm alpha brainwave velocity without caffeine tension.',
    },
    {
      id: 'social',
      roman: 'II',
      name: 'Sensory Euphoria & Social Uplift',
      dose: '400mg Mexican Damiana · 250mg Himalayan Schisandra Berry',
      desc: 'Promotes sensory warmth, mild dopamine tone, and effortless conversational engagement.',
    },
    {
      id: 'restoration',
      roman: 'III',
      name: 'Parasympathetic Restoration',
      dose: '350mg KSM-66® Ashwagandha · 150mg Magnesium L-Threonate',
      desc: 'Down-regulates evening cortisol, physical tension release, and restorative cellular recovery.',
    },
  ];

  // 3. Factual 60mL Botanical Modifiers (12% of 500mL)
  const modifiers: { id: BotanicalModifier; name: string; botanical: string; vol: string }[] = [
    {
      id: 'rosemary',
      name: 'Charred Rosemary & Cardamom',
      botanical: 'Steam-distilled Spanish rosemary hydrosol & green cardamom spice',
      vol: '60mL (12%)',
    },
    {
      id: 'vetiver',
      name: 'Smoked Vetiver & Fig Leaf',
      botanical: 'Low-temperature Haitian vetiver root & lactonic fig leaf cordial',
      vol: '60mL (12%)',
    },
    {
      id: 'shiso',
      name: 'Herbaceous Shiso & Mountain Sage',
      botanical: 'Sub-zero purple shiso cold-press & Dalmatian mountain sage',
      vol: '60mL (12%)',
    },
  ];

  const seals: { id: SealColor; name: string; hex: string; desc: string }[] = [
    { id: 'brass', name: 'Champagne Brass', hex: '#C59B27', desc: 'Hand-burnished brushed brass' },
    { id: 'noir', name: 'Obsidian Titanium', hex: '#22201D', desc: 'Blackened aerospace titanium' },
    { id: 'copper', name: 'Rose Copper', hex: '#B3542E', desc: 'Fire-annealed copper foil' },
    { id: 'silver', name: 'Sterling Platinum', hex: '#D1D5DB', desc: 'Mirror rhodium-plated finish' },
    { id: 'gold', name: '24K Aurum Gold', hex: '#F59E0B', desc: '24-karat gold electroplate' },
  ];

  const glassTints: { id: GlassTint; name: string; badge: string; desc: string }[] = [
    { id: 'clear', name: 'Clear Borosilicate', badge: 'Ultra-Pure', desc: 'Optical clarity' },
    { id: 'obsidian', name: 'Smoked Obsidian', badge: 'Graphite', desc: 'Volcanic glass' },
    { id: 'amber', name: 'Apothecary Amber', badge: 'UV-Shield', desc: 'Amber crystal' },
    { id: 'frosted', name: 'Frosted Satin', badge: 'Matte', desc: 'Acid-etched frost' },
  ];

  const labelPapers: { id: LabelPaper; name: string; badge: string; desc: string }[] = [
    { id: 'ivory', name: 'Ivory Cotton', badge: '450gsm', desc: 'Letterpress cotton' },
    { id: 'noir', name: 'Midnight Noir', badge: 'Hot Foil', desc: 'Matte black & bronze' },
    { id: 'washi', name: 'Mulberry Washi', badge: 'Artisanal', desc: 'Echizen Japanese' },
  ];

  const waxDips: { id: WaxDip; name: string; hex: string; desc: string }[] = [
    { id: 'none', name: 'Flor Cork', hex: '#C29B38', desc: 'Natural cork' },
    { id: 'crimson', name: 'Crimson', hex: '#991B1B', desc: 'Vermilion seal' },
    { id: 'black', name: 'Pitch Black', hex: '#171614', desc: 'Matte wax' },
    { id: 'gold', name: 'Aurum Gold', hex: '#D4AF37', desc: 'Gold-dusted' },
  ];

  const allocationTiers = [
    { qty: 1 as const, name: 'Single Vessel', vol: '500mL', basePrice: 145, engPrice: 28, badge: 'Standard Reserve' },
    { qty: 2 as const, name: 'Collector Pair', vol: '2x 500mL', basePrice: 260, engPrice: 50, badge: 'Save $36 (Atelier Choice)' },
    { qty: 6 as const, name: 'Private Cask Cellar', vol: '6x 500mL', basePrice: 720, engPrice: 100, badge: 'Save $218 (Collector Tier)' },
  ];

  const currencyMap: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
  };

  const curr = currencyMap[order.currency || 'USD'] || currencyMap.USD;
  const formatPrice = (usdAmount: number) => {
    const converted = Math.round(usdAmount * curr.rate);
    return `${curr.symbol}${converted}`;
  };

  const currentTier = allocationTiers.find((t) => t.qty === (order.quantity || 1)) || allocationTiers[0];

  const stageTargets = [
    { num: 1, label: 'Genesis', p: 0.0 },
    { num: 2, label: 'Distillate', p: 0.24 },
    { num: 3, label: 'Infusion', p: 0.45 },
    { num: 4, label: 'Architecture', p: 0.65 },
    { num: 5, label: 'Engraving', p: 0.80 },
    { num: 6, label: 'Allocation', p: 0.94 },
  ];

  const handleJumpToStage = (targetProgress: number) => {
    audioSystem.playClick(900);
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetProgress,
      behavior: 'smooth',
    });
  };

  // Continuous Spatial Interpolation: Computes opacity, translateY, and intra-stage progress %
  const getStageStyle = (enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
    const p = scrollProgress;
    if (p < enterStart || p > exitEnd) {
      return {
        opacity: 0,
        transform: `translateY(${p < enterStart ? 28 : -28}px)`,
        pointerEvents: 'none' as const,
        display: 'none',
        intraProgress: p < enterStart ? 0 : 100,
      };
    }

    let opacity = 1;
    let translateY = 0;

    if (p < enterEnd && enterEnd > enterStart) {
      const t = (p - enterStart) / (enterEnd - enterStart);
      opacity = t;
      translateY = (1 - t) * 28;
    } else if (p > exitStart && exitEnd > exitStart) {
      const t = (p - exitStart) / (exitEnd - exitStart);
      opacity = 1 - t;
      translateY = -t * 28;
    }

    const intra = Math.min(
      100,
      Math.max(0, Math.round(((p - enterStart) / (exitEnd - enterStart)) * 100))
    );

    return {
      opacity,
      transform: `translateY(${translateY.toFixed(1)}px)`,
      pointerEvents: opacity > 0.35 ? ('auto' as const) : ('none' as const),
      display: opacity > 0.01 ? 'flex' : 'none',
      intraProgress: intra,
    };
  };

  const s1 = getStageStyle(0.00, 0.00, 0.11, 0.17);
  const s2 = getStageStyle(0.13, 0.18, 0.31, 0.37);
  const s3 = getStageStyle(0.33, 0.38, 0.51, 0.57);
  const s4 = getStageStyle(0.53, 0.58, 0.70, 0.75);
  const s5 = getStageStyle(0.71, 0.76, 0.85, 0.89);
  const s6 = getStageStyle(0.86, 0.91, 1.00, 1.00);

  // Active stage number for navigation rail
  let activeRailStage = 1;
  if (scrollProgress >= 0.88) activeRailStage = 6;
  else if (scrollProgress >= 0.74) activeRailStage = 5;
  else if (scrollProgress >= 0.56) activeRailStage = 4;
  else if (scrollProgress >= 0.36) activeRailStage = 3;
  else if (scrollProgress >= 0.16) activeRailStage = 2;

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden select-none text-[#171614]">
      {/* Right-Side Vertical Step Navigation Rail (Desktop) */}
      <div className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 flex-col items-end space-y-4 pointer-events-auto z-40">
        {stageTargets.map((s) => (
          <button
            key={s.num}
            onClick={() => handleJumpToStage(s.p)}
            className="group flex items-center space-x-3 cursor-pointer py-1"
          >
            <span
              className={`font-mono text-[10px] tracking-wider transition-all duration-300 ${
                activeRailStage === s.num
                  ? 'text-[#B86B27] font-medium opacity-100 translate-x-0'
                  : 'text-[#171614]/30 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              0{s.num} {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                activeRailStage === s.num
                  ? 'w-2.5 h-2.5 bg-[#B86B27] ring-4 ring-[#B86B27]/15'
                  : 'w-1.5 h-1.5 bg-[#171614]/20 group-hover:bg-[#171614]/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* STAGE 1: GENESIS (RADICAL LUXURY MINIMALISM) (0% - 16%)   */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s1.opacity,
          transform: s1.transform,
          pointerEvents: s1.pointerEvents,
          display: s1.display,
        }}
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 py-16 flex flex-col justify-end transition-transform duration-100 ease-out"
      >
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 max-w-[1440px] w-full mx-auto pb-4">
          <div className="max-w-lg">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.24em] uppercase block mb-2.5">
              BOROSILICATE FLINT · 500ML BESPOKE
            </span>
            <h1 className="font-sans font-light text-3xl sm:text-5xl text-[#171614] leading-[1.08] tracking-[-0.03em]">
              A pure vessel,<br />
              <span className="font-serif italic font-normal text-[#171614]">
                awaiting distillation
              </span>
              .
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6E6961] mt-3 font-light leading-relaxed">
              Optical apothecary glass engineered for zero-proof botanical alchemy. Scroll downward or begin formulation below.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleJumpToStage(0.24)}
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white border border-[#171614]/15 hover:border-[#B86B27] text-xs font-sans text-[#171614] transition-all shadow-sm hover:shadow cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
              <span>Begin formulation</span>
              <span className="text-[#B86B27] group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 2: BASE DISTILLATE (320mL / 64%) (16% - 36%)        */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s2.opacity,
          transform: s2.transform,
          pointerEvents: s2.pointerEvents,
          display: s2.display,
        }}
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-start transition-transform duration-100 ease-out"
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="w-full max-w-[390px] pointer-events-auto bg-white/90 p-5 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Droplet size={11} className="text-[#B86B27]" />
              <span>PHASE 01 // FOUNDATION</span>
            </div>
            <span className="tracking-wider">{s2.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-2.5">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s2.intraProgress}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em]">
              Primary Distillate<span className="text-[#B86B27]">.</span>
            </h2>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-medium">
              320mL / 64% Foundation
            </span>
          </div>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-snug mb-3">
            Cold-vacuum extraction. Establishes the core aromatic and mineral profile.
          </p>

          {/* Factual Volume Telemetry Bar */}
          <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${pourState.isPouring ? 'bg-[#B86B27] animate-ping' : pourState.fillLevel >= 0.64 ? 'bg-[#065F46]' : 'bg-[#171614]/30'}`} />
              <span className="text-[#171614]/80 text-[10px] truncate max-w-[210px]">{pourState.statusText}</span>
            </div>
            <span className="text-[#B86B27] text-[10px] tracking-wider font-semibold">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          {/* Factual 320mL Base Distillates */}
          <div className="space-y-1.5">
            {bases.map((base) => {
              const isSelected = formula.base === base.id;
              return (
                <button
                  key={base.id}
                  onClick={() => handleSelectBase(base.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/25'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full mt-0.5 shadow-sm transition-transform group-hover:scale-110 flex-shrink-0"
                        style={{ backgroundColor: base.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-sans font-medium text-xs text-[#171614]">
                            {base.name}
                          </h3>
                          <span className="text-[9px] font-mono text-[#B86B27] px-1 py-0.5 rounded bg-[#B86B27]/10">
                            {base.vol}
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-[#6E6961] mt-0.5 font-light leading-snug">
                          {base.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-1.5">
                      {isSelected ? (
                        <div className="flex items-center space-x-1 text-[#B86B27] font-mono text-[9px] font-semibold">
                          <Check size={11} strokeWidth={2.5} />
                          <span>320ML</span>
                        </div>
                      ) : (
                        <span className="text-[#171614]/30 font-mono text-[9px] group-hover:text-[#171614]/60">
                          POUR
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Action Pill */}
          <button
            onClick={() => handleJumpToStage(0.45)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#171614]/[0.04] hover:bg-[#B86B27]/10 border border-[#171614]/10 hover:border-[#B86B27]/30 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 01 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Adaptogen Infusion (+80mL)</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 3: BIOACTIVE NOOTROPIC (+80mL = 400mL) (36% - 56%)   */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s3.opacity,
          transform: s3.transform,
          pointerEvents: s3.pointerEvents,
          display: s3.display,
        }}
        className="absolute inset-0 px-6 sm:px-10 lg:px-16 xl:px-24 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="w-full max-w-[390px] mr-0 xl:mr-6 pointer-events-auto bg-white/90 p-5 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Layers size={11} className="text-[#B86B27]" />
              <span>PHASE 02 // ADAPTOGEN INFUSION</span>
            </div>
            <span className="tracking-wider">{s3.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-2.5">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s3.intraProgress}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em]">
              Clinical Nootropics<span className="text-[#B86B27]">.</span>
            </h2>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-medium">
              +80mL / 80% Capacity
            </span>
          </div>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-snug mb-3">
            Dual-extract adaptogenic matrix. Unseals stopper; volume rises to 400mL (80%).
          </p>

          {/* Volume Bar */}
          <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-[#171614]/80 text-[10px]">
              {formula.nootropic ? '80mL adaptogen infused' : 'Select bioactive stack (+80mL)'}
            </span>
            <span className="text-[#B86B27] text-[10px] tracking-wider font-semibold">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          <div className="space-y-1.5">
            {nootropics.map((item) => {
              const isSelected = formula.nootropic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNootropic(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/25'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif italic text-xs text-[#B86B27]">
                          {item.roman}.
                        </span>
                        <h3 className="font-sans font-medium text-xs text-[#171614]">
                          {item.name}
                        </h3>
                      </div>
                      <div className="font-mono text-[9px] text-[#B86B27] mt-0.5">
                        {item.dose}
                      </div>
                      <p className="font-sans text-[10px] text-[#6E6961] mt-0.5 font-light leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pl-1.5 pt-0.5">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#B86B27] text-white flex items-center justify-center">
                          <Check size={10} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#171614]/20" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Action Pill */}
          <button
            onClick={() => handleJumpToStage(0.65)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#171614]/[0.04] hover:bg-[#B86B27]/10 border border-[#171614]/10 hover:border-[#B86B27]/30 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 02 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Modifier Cordial & Chill</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 4: MODIFIER CORDIAL & CHILL (+100mL = 500mL) (56% - 74%) */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s4.opacity,
          transform: s4.transform,
          pointerEvents: s4.pointerEvents,
          display: s4.display,
        }}
        className="absolute inset-0 px-6 sm:px-10 lg:px-16 xl:px-24 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="w-full max-w-[390px] mr-0 xl:mr-6 pointer-events-auto bg-white/90 p-5 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Sparkles size={11} className="text-[#B86B27]" />
              <span>PHASE 03 // ARCHITECTURE & CHILL</span>
            </div>
            <span className="tracking-wider">{s4.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-2.5">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s4.intraProgress}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em]">
              Architecture & Chill<span className="text-[#B86B27]">.</span>
            </h2>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-semibold">
              500mL (100% Full)
            </span>
          </div>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-snug mb-3">
            Binds the aromatics and finishes the 500mL vessel capacity.
          </p>

          {/* Volume Bar */}
          <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-[#171614]/80 text-[10px]">
              Final blend: {pourState.currentVolumeMl}mL / 500mL
            </span>
            <span className="text-[#B86B27] text-[10px] tracking-wider font-semibold">
              100% CAPACITY
            </span>
          </div>

          {/* 60mL Botanical Modifier Cordials */}
          <div className="space-y-1.5 mb-2.5">
            <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
              Select Aromatic Modifier (+60mL)
            </label>
            {modifiers.map((mod) => {
              const isSelected = formula.modifier === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModifier(mod.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-sm border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-medium text-xs text-[#171614]">{mod.name}</h4>
                      <p className="font-sans text-[10px] text-[#6E6961]">{mod.botanical}</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#B86B27] pl-2 font-medium">{mod.vol}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 40mL Chill Architecture */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectChill('glacial')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'glacial'
                  ? 'bg-white border-2 border-[#9CE0FF] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#9CE0FF]/20 text-[#0284C7] flex items-center justify-center mb-1">
                <Snowflake size={11} />
              </div>
              <h4 className="font-sans font-medium text-xs text-[#171614]">Glacial Serve</h4>
              <p className="font-mono text-[9px] text-[#B86B27] mt-0.5">-4°C · Hand-Cut Ice (+40mL)</p>
            </button>

            <button
              onClick={() => handleSelectChill('cellar')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'cellar'
                  ? 'bg-white border-2 border-[#B86B27] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#B86B27]/10 text-[#B86B27] flex items-center justify-center mb-1">
                <Flame size={11} />
              </div>
              <h4 className="font-sans font-medium text-xs text-[#171614]">Cellar Serve</h4>
              <p className="font-mono text-[9px] text-[#B86B27] mt-0.5">18°C · Uncut & Neat</p>
            </button>
          </div>

          {/* Continue Action Pill */}
          <button
            onClick={() => handleJumpToStage(0.80)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#171614]/[0.04] hover:bg-[#B86B27]/10 border border-[#171614]/10 hover:border-[#B86B27]/30 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 03 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Bespoke Vessel Suite</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 5: BESPOKE 3D CUSTOMIZATION SUITE (74% - 88%)       */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s5.opacity,
          transform: s5.transform,
          pointerEvents: s5.pointerEvents,
          display: s5.display,
        }}
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-start transition-transform duration-100 ease-out"
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="w-full max-w-[420px] pointer-events-auto bg-white/90 p-5 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Award size={11} className="text-[#B86B27]" />
              <span>PHASE 04 // 3D BESPOKE SUITE</span>
            </div>
            <span className="tracking-wider">{s5.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-2.5">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s5.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Bespoke Vessel Suite<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-snug mb-2.5">
            Configure glass tint, metallurgy, neck wax dip, and real-time 3D laser engraving.
          </p>

          <div className="space-y-2.5">
            {/* 1. Vessel Glass Tint */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
                  Vessel Glass Tint
                </label>
                <span className="font-mono text-[9px] text-[#B86B27] font-medium">
                  {glassTints.find((g) => g.id === formula.glassTint)?.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {glassTints.map((g) => {
                  const isSel = formula.glassTint === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGlassTint(g.id)}
                      className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSel
                          ? 'bg-[#171614] text-[#FAF7F0] border-[#171614] shadow-sm'
                          : 'bg-white hover:bg-[#FAF7F0] border-[#171614]/10 text-[#171614]'
                      }`}
                    >
                      <div>
                        <div className="font-sans font-medium text-xs leading-tight">{g.name}</div>
                        <div className={`font-mono text-[8px] mt-0.5 ${isSel ? 'text-[#B86B27]' : 'text-[#6E6961]'}`}>
                          {g.desc}
                        </div>
                      </div>
                      <span className={`text-[8px] font-mono px-1 py-0.5 rounded uppercase tracking-wider ${
                        isSel ? 'bg-white/15 text-white' : 'bg-[#171614]/5 text-[#6E6961]'
                      }`}>
                        {g.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cap Metallurgy */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
                  Cap Metallurgy & Stopper
                </label>
                <span className="font-mono text-[9px] text-[#B86B27] font-medium">
                  {seals.find((s) => s.id === formula.seal)?.name}
                </span>
              </div>
              <div className="flex space-x-1.5 pt-0.5">
                {seals.map((s) => {
                  const isSel = formula.seal === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeal(s.id)}
                      className={`relative flex-1 p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSel ? 'bg-white border-2 border-[#B86B27] shadow-sm' : 'bg-white/70 hover:bg-white border-[#171614]/10'
                      }`}
                      title={s.name}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner mb-0.5"
                        style={{ backgroundColor: s.hex }}
                      />
                      <span className="font-sans text-[8px] font-medium text-[#171614] text-center leading-none truncate max-w-full">
                        {s.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Label Parchment & Neck Wax Seal */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Label Parchment
                </label>
                <div className="space-y-1">
                  {labelPapers.map((lp) => {
                    const isSel = formula.labelPaper === lp.id;
                    return (
                      <button
                        key={lp.id}
                        onClick={() => handleSelectLabelPaper(lp.id)}
                        className={`w-full p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSel ? 'bg-[#171614] text-[#FAF7F0] border-[#171614]' : 'bg-white hover:bg-[#FAF7F0] border-[#171614]/10 text-[#171614]'
                        }`}
                      >
                        <span className="font-sans text-[10px] font-medium leading-none">{lp.name}</span>
                        <span className={`text-[7px] font-mono uppercase ${isSel ? 'text-[#B86B27]' : 'text-[#6E6961]'}`}>{lp.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Neck Wax Seal Dip
                </label>
                <div className="space-y-1">
                  {waxDips.map((wd) => {
                    const isSel = formula.waxDip === wd.id;
                    return (
                      <button
                        key={wd.id}
                        onClick={() => handleSelectWaxDip(wd.id)}
                        className={`w-full p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isSel ? 'bg-white border-2 border-[#B86B27] shadow-sm' : 'bg-white/70 hover:bg-white border-[#171614]/10'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: wd.hex }} />
                        <span className="font-sans text-[10px] font-medium text-[#171614] truncate leading-none">{wd.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Real-time 3D Laser Engraving & Cask Year */}
            <div className="pt-2 border-t border-[#171614]/10 space-y-1.5">
              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                  Custom Reserve Edition Title
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={formula.customName}
                  onChange={(e) => scrollStore.setCustomName(e.target.value)}
                  placeholder="e.g. ABHAYJEET RESERVE"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Monogram Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formula.engravedInitials}
                    onChange={(e) => scrollStore.setEngravedInitials(e.target.value.toUpperCase())}
                    placeholder="AT"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium font-serif uppercase outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Cask & Batch Year
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={formula.batchYear}
                    onChange={(e) => scrollStore.setBatchYear(e.target.value.toUpperCase())}
                    placeholder="2026 // CASK 01"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] font-mono outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-0.5 text-[9px] font-mono text-[#B86B27] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
                <span>3D BOTTLE MESH EMBOSSED LIVE AT 60FPS</span>
              </div>
            </div>
          </div>

          {/* Continue Action Pill */}
          <button
            onClick={() => handleJumpToStage(0.94)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#171614]/[0.04] hover:bg-[#B86B27]/10 border border-[#171614]/10 hover:border-[#B86B27]/30 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 04 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Vault Allocation & Billing</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 6: DISPATCH VAULT & AUTHENTIC BILLING (88% - 100%)   */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s6.opacity,
          transform: s6.transform,
          pointerEvents: s6.pointerEvents,
          display: s6.display,
        }}
        className="absolute inset-0 px-6 sm:px-10 lg:px-16 xl:px-24 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="w-full max-w-[420px] mr-0 xl:mr-6 pointer-events-auto bg-white/95 p-4 sm:p-5 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase font-semibold">
              <ShieldCheck size={11} className="text-[#B86B27]" />
              <span>PHASE 05 // VAULT ALLOCATION</span>
            </div>
            <span className="tracking-wider">{s6.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-2">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s6.intraProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="font-sans font-light text-lg text-[#171614] tracking-[-0.02em]">
              Dispatch Allocation<span className="text-[#B86B27]">.</span>
            </h2>

            {/* Currency Selector */}
            <div className="flex bg-[#171614]/5 rounded-lg p-0.5 border border-[#171614]/10 shrink-0">
              {(['USD', 'EUR', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    order.currency === c ? 'bg-white text-[#171614] font-bold shadow-xs' : 'text-[#6E6961] hover:text-[#171614]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation Quantity Tiers: Compact Segmented Bar */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {allocationTiers.map((t) => {
              const isSel = (order.quantity || 1) === t.qty;
              return (
                <button
                  key={t.qty}
                  onClick={() => handleSelectQuantity(t.qty)}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSel
                      ? 'bg-[#171614] text-[#FAF7F0] border-[#171614] shadow-sm'
                      : 'bg-white hover:bg-[#FAF7F0] border-[#171614]/10 text-[#171614]'
                  }`}
                >
                  <span className="font-sans text-[11px] font-medium leading-none">{t.qty} Vessel{t.qty > 1 ? 's' : ''}</span>
                  <span className={`text-[10px] font-mono font-bold mt-1 ${isSel ? 'text-[#FAF7F0]' : 'text-[#B86B27]'}`}>
                    {formatPrice(t.basePrice + t.engPrice)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Itemized Transparent Luxury Billing Statement: Compact */}
          <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#171614]/[0.08] mb-2 text-[10px] font-mono space-y-1">
            <div className="flex justify-between items-center text-[#171614]">
              <span className="truncate max-w-[240px]">
                500mL Elixir ({formula.base?.toUpperCase() || 'YUZU'} + {formula.nootropic?.toUpperCase() || 'ALPHA'} + {formula.modifier?.toUpperCase() || 'ROSEMARY'})
              </span>
              <span className="font-semibold shrink-0">{formatPrice(currentTier.basePrice)}</span>
            </div>

            <div className="flex justify-between items-center text-[#171614]">
              <span className="truncate max-w-[240px]">
                Laser Monogram [{formula.engravedInitials || 'AT'}] · {formula.seal.toUpperCase()} Cap
              </span>
              <span className="font-semibold shrink-0">{formatPrice(currentTier.engPrice)}</span>
            </div>

            <div className="flex justify-between items-center text-[#6E6961]">
              <span>Cold-Chain White Glove Courier</span>
              <span className="text-[#065F46] font-medium">Complimentary</span>
            </div>

            {order.memberCode && (
              <div className="flex justify-between items-center text-[#B86B27]">
                <span>VIP Member Privilege ({order.memberCode})</span>
                <span>-{formatPrice(15 * currentTier.qty)}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-[#171614]/15 pt-1.5 text-xs font-sans">
              <span className="text-[#171614] font-semibold uppercase tracking-wider text-[10px]">Total Investment</span>
              <span className="text-[#B86B27] font-bold text-sm font-mono">
                {formatPrice(order.totalPrice || currentTier.basePrice + currentTier.engPrice)}
              </span>
            </div>
          </div>

          {/* Member Privilege Code Entry */}
          {!order.confirmed && (
            <div className="flex items-center space-x-1.5 mb-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="VIP ATELIER KEY (e.g. VIP-AETHER)"
                className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] font-mono text-[9px] text-[#171614] uppercase outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo()}
                className="px-2.5 py-1 rounded-lg bg-[#171614]/5 hover:bg-[#171614]/10 border border-[#171614]/10 font-mono text-[9px] text-[#171614] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
          {promoFeedback && (
            <div className={`-mt-1 mb-2 font-mono text-[8px] ${promoFeedback.includes('Authenticated') ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
              {promoFeedback}
            </div>
          )}

          {order.confirmed ? (
            /* ======================================================== */
            /* LUXURY BESPOKE CERTIFICATE OF BOTTLING & PROVENANCE     */
            /* ======================================================== */
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] border-2 border-[#D4AF37]/50 shadow-md text-left space-y-2 relative overflow-hidden">
              {/* Certificate Header */}
              <div className="border-b border-[#D4AF37]/30 pb-1.5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[7px] text-[#B86B27] tracking-[0.25em] uppercase font-bold">
                    OFFICIAL CERTIFICATE OF PROVENANCE
                  </div>
                  <h3 className="font-serif text-base font-light text-[#171614] leading-tight">
                    Aether Bottling Registry
                  </h3>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check size={13} />
                </div>
              </div>

              {/* Certificate Registry Data */}
              <div className="font-mono text-[9px] space-y-0.5 text-[#171614]/80">
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">SERIAL NO:</span>
                  <span className="font-bold text-[#171614] tracking-widest">{order.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">CASK & BATCH:</span>
                  <span className="text-[#B86B27] font-semibold">{formula.batchYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">RESERVE TITLE:</span>
                  <span className="text-[#171614] font-medium">{formula.customName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">MONOGRAM:</span>
                  <span className="font-serif font-bold text-[#171614]">[{formula.engravedInitials}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">VESSEL SPEC:</span>
                  <span className="text-[#171614] uppercase">{formula.glassTint} · {formula.seal} · {formula.waxDip}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/20 pt-1">
                  <span className="text-[#6E6961]">DESTINATION:</span>
                  <span className="text-[#171614] font-medium text-right truncate max-w-[180px]">
                    {order.fullName} — {order.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">BILLED AMOUNT:</span>
                  <span className="text-[#065F46] font-bold">
                    {formatPrice(order.totalPrice || currentTier.basePrice + currentTier.engPrice)} PAID
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-1 px-2 rounded-lg bg-white border border-[#171614]/15 hover:border-[#171614]/30 font-sans text-[10px] text-[#171614] flex items-center justify-center space-x-1 cursor-pointer transition-all"
                >
                  <Printer size={11} />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playClick(800);
                    scrollStore.setCustomerOrder({ confirmed: false });
                  }}
                  className="py-1 px-2 rounded-lg bg-[#171614]/5 hover:bg-[#171614]/10 border border-[#171614]/10 font-sans text-[10px] text-[#171614] flex items-center justify-center space-x-1 cursor-pointer transition-all"
                >
                  <RotateCcw size={11} />
                  <span>Modify Vessel</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                audioSystem.playClick(1200);
                scrollStore.confirmOrder();
              }}
              className="space-y-1.5"
            >
              {/* Compact 2x2 Grid for Recipient Details */}
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Recipient Name
                  </label>
                  <input
                    required
                    type="text"
                    value={order.fullName}
                    onChange={(e) => scrollStore.setCustomerOrder({ fullName: e.target.value })}
                    placeholder="Abhayjeet Tomar"
                    className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Street Address
                  </label>
                  <input
                    required
                    type="text"
                    value={order.address}
                    onChange={(e) => scrollStore.setCustomerOrder({ address: e.target.value })}
                    placeholder="740 Park Avenue"
                    className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    City & Postal
                  </label>
                  <input
                    required
                    type="text"
                    value={order.city}
                    onChange={(e) => scrollStore.setCustomerOrder({ city: e.target.value })}
                    placeholder="New York, NY 10021"
                    className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={order.email}
                    onChange={(e) => scrollStore.setCustomerOrder({ email: e.target.value })}
                    placeholder="atelier@aether.luxury"
                    className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 rounded-xl bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] font-sans text-xs font-medium tracking-tight flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Authorize & Dispatch Allocation</span>
                <ArrowRight size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
