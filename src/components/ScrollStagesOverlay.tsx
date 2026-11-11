import React, { useEffect, useState } from 'react';
import { 
  Snowflake, 
  Flame, 
  Check, 
  ArrowRight, 
  Printer, 
  RotateCcw,
  Sparkles
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
    const unsub = scrollStore.subscribe(() => {
      setFormula({ ...scrollStore.formula });
      setOrder({ ...scrollStore.order });
      setPourState({ ...scrollStore.pour });
    });
    return unsub;
  }, []);

  // RAF listener for smooth continuous card interpolation
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
      desc: 'Calm alpha brainwave velocity without caffeine tension.',
    },
    {
      id: 'social',
      roman: 'II',
      name: 'Sensory Euphoria & Social Uplift',
      dose: '400mg Mexican Damiana · 250mg Himalayan Schisandra',
      desc: 'Sensory warmth, mild dopamine tone, and conversational engagement.',
    },
    {
      id: 'restoration',
      roman: 'III',
      name: 'Parasympathetic Restoration',
      dose: '350mg KSM-66® Ashwagandha · 150mg Magnesium L-Threonate',
      desc: 'Down-regulates evening cortisol and aids cellular recovery.',
    },
  ];

  // 3. Factual 60mL Botanical Modifiers (12% of 500mL)
  const modifiers: { id: BotanicalModifier; name: string; botanical: string; vol: string }[] = [
    {
      id: 'rosemary',
      name: 'Charred Rosemary & Cardamom',
      botanical: 'Spanish rosemary hydrosol & green cardamom spice',
      vol: '60mL (12%)',
    },
    {
      id: 'vetiver',
      name: 'Smoked Vetiver & Fig Leaf',
      botanical: 'Haitian vetiver root & lactonic fig leaf cordial',
      vol: '60mL (12%)',
    },
    {
      id: 'shiso',
      name: 'Herbaceous Shiso & Mountain Sage',
      botanical: 'Purple shiso cold-press & Dalmatian mountain sage',
      vol: '60mL (12%)',
    },
  ];

  const seals: { id: SealColor; name: string; hex: string; desc: string }[] = [
    { id: 'brass', name: 'Champagne Brass', hex: '#C59B27', desc: 'Brushed brass' },
    { id: 'noir', name: 'Obsidian Titanium', hex: '#22201D', desc: 'Blackened titanium' },
    { id: 'copper', name: 'Rose Copper', hex: '#B3542E', desc: 'Fire-annealed copper' },
    { id: 'silver', name: 'Sterling Platinum', hex: '#D1D5DB', desc: 'Mirror rhodium' },
    { id: 'gold', name: '24K Aurum Gold', hex: '#F59E0B', desc: '24-karat electroplate' },
  ];

  const glassTints: { id: GlassTint; name: string; badge: string; desc: string }[] = [
    { id: 'clear', name: 'Clear Borosilicate', badge: 'Pure', desc: 'Optical clarity' },
    { id: 'obsidian', name: 'Smoked Obsidian', badge: 'Deep', desc: 'Volcanic flint' },
    { id: 'amber', name: 'Apothecary Amber', badge: 'Shield', desc: 'UV amber crystal' },
    { id: 'frosted', name: 'Frosted Satin', badge: 'Matte', desc: 'Acid-etched frost' },
  ];

  const labelPapers: { id: LabelPaper; name: string; badge: string; desc: string }[] = [
    { id: 'ivory', name: 'Ivory Cotton', badge: '450gsm', desc: 'Letterpress cotton' },
    { id: 'noir', name: 'Midnight Noir', badge: 'Foil', desc: 'Matte black & bronze' },
    { id: 'washi', name: 'Mulberry Washi', badge: 'Handmade', desc: 'Echizen Japanese' },
  ];

  const waxDips: { id: WaxDip; name: string; hex: string; desc: string }[] = [
    { id: 'none', name: 'Flor Cork', hex: '#C29B38', desc: 'Natural cork' },
    { id: 'crimson', name: 'Crimson', hex: '#991B1B', desc: 'Vermilion seal' },
    { id: 'black', name: 'Pitch Black', hex: '#171614', desc: 'Matte wax' },
    { id: 'gold', name: 'Aurum Gold', hex: '#D4AF37', desc: 'Gold dusted' },
  ];

  const allocationTiers = [
    { qty: 1 as const, name: 'Single Vessel', vol: '500mL', basePrice: 145, engPrice: 28, badge: 'Reserve' },
    { qty: 2 as const, name: 'Collector Pair', vol: '2x 500mL', basePrice: 260, engPrice: 50, badge: 'Save $36' },
    { qty: 6 as const, name: 'Private Cellar', vol: '6x 500mL', basePrice: 720, engPrice: 100, badge: 'Save $218' },
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
    { num: 3, label: 'Infusion', p: 0.46 },
    { num: 4, label: 'Architecture', p: 0.66 },
    { num: 5, label: 'Atelier', p: 0.82 },
    { num: 6, label: 'Allocation', p: 0.95 },
  ];

  const handleJumpToStage = (targetProgress: number) => {
    audioSystem.playClick(900);
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetProgress,
      behavior: 'smooth',
    });
  };

  // Continuous Spatial Interpolation with smooth cross-fading
  const getStageStyle = (enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
    const p = scrollProgress;
    if (p < enterStart || p > exitEnd) {
      return {
        opacity: 0,
        transform: `translateY(${p < enterStart ? 24 : -24}px)`,
        pointerEvents: 'none' as const,
        display: 'none',
      };
    }

    let opacity = 1;
    let translateY = 0;

    if (p < enterEnd && enterEnd > enterStart) {
      const t = (p - enterStart) / (enterEnd - enterStart);
      opacity = t;
      translateY = (1 - t) * 24;
    } else if (p > exitStart && exitEnd > exitStart) {
      const t = (p - exitStart) / (exitEnd - exitStart);
      opacity = 1 - t;
      translateY = -t * 24;
    }

    return {
      opacity,
      transform: `translateY(${translateY.toFixed(1)}px)`,
      pointerEvents: opacity > 0.35 ? ('auto' as const) : ('none' as const),
      display: opacity > 0.01 ? 'flex' : 'none',
    };
  };

  const s1 = getStageStyle(0.00, 0.00, 0.12, 0.18);
  const s2 = getStageStyle(0.14, 0.20, 0.34, 0.39);
  const s3 = getStageStyle(0.35, 0.40, 0.54, 0.59);
  const s4 = getStageStyle(0.55, 0.60, 0.72, 0.77);
  const s5 = getStageStyle(0.73, 0.78, 0.85, 0.89);
  const s6 = getStageStyle(0.86, 0.90, 1.00, 1.00);

  let activeRailStage = 1;
  if (scrollProgress >= 0.88) activeRailStage = 6;
  else if (scrollProgress >= 0.76) activeRailStage = 5;
  else if (scrollProgress >= 0.58) activeRailStage = 4;
  else if (scrollProgress >= 0.38) activeRailStage = 3;
  else if (scrollProgress >= 0.18) activeRailStage = 2;

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden select-none text-[#171614]">
      {/* Right-Side Minimal Navigation Rail */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-end space-y-3.5 pointer-events-auto z-40">
        {stageTargets.map((s) => (
          <button
            key={s.num}
            onClick={() => handleJumpToStage(s.p)}
            className="group flex items-center space-x-3 cursor-pointer py-1"
          >
            <span
              className={`font-sans text-[11px] tracking-wide transition-all duration-300 ${
                activeRailStage === s.num
                  ? 'text-[#B86B27] font-medium opacity-100 translate-x-0'
                  : 'text-[#171614]/35 opacity-0 group-hover:opacity-100 translate-x-1.5 group-hover:translate-x-0'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                activeRailStage === s.num
                  ? 'w-2 h-2 bg-[#B86B27] ring-4 ring-[#B86B27]/20'
                  : 'w-1.5 h-1.5 bg-[#171614]/20 group-hover:bg-[#171614]/50'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. GENESIS (HERO VIEW)                                     */}
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
          <div className="max-w-xl">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.24em] uppercase block mb-3 font-semibold">
              BOROSILICATE FLINT · 500ML BESPOKE DECANTER
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
              className="flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white border border-[#171614]/15 hover:border-[#B86B27] text-xs font-sans text-[#171614] transition-all shadow-sm hover:shadow cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
              <span className="font-medium">Begin formulation</span>
              <span className="text-[#B86B27] group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BASE DISTILLATE (320mL / 64%)                           */}
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
        <div className="w-full max-w-[440px] pointer-events-auto bg-[#FCFAF7]/95 p-6 sm:p-7 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(23,22,20,0.08)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              PRIMARY EXTRACTION
            </span>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-medium">
              320mL Foundation
            </span>
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Primary Distillate <span className="font-serif italic font-normal text-[#B86B27]">Base</span>.
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-4">
            Sub-zero cold vacuum extraction. Establishes the core aromatic palette and mineral mouthfeel.
          </p>

          {/* Volume Status Pill */}
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-white/70 border border-[#171614]/[0.07] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${pourState.isPouring ? 'bg-[#B86B27] animate-ping' : pourState.fillLevel >= 0.64 ? 'bg-[#065F46]' : 'bg-[#171614]/30'}`} />
              <span className="text-[#171614]/80 text-[11px] truncate max-w-[220px]">{pourState.statusText}</span>
            </div>
            <span className="text-[#B86B27] text-[11px] tracking-wider font-semibold">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          {/* 320mL Base Distillate Options */}
          <div className="space-y-2.5">
            {bases.map((base) => {
              const isSelected = formula.base === base.id;
              return (
                <button
                  key={base.id}
                  onClick={() => handleSelectBase(base.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27] ring-2 ring-[#B86B27]/10'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span
                        className="w-4 h-4 rounded-full mt-0.5 shadow-sm transition-transform group-hover:scale-110 flex-shrink-0"
                        style={{ backgroundColor: base.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-sans font-medium text-xs text-[#171614]">
                            {base.name}
                          </h3>
                          <span className="text-[9px] font-mono text-[#B86B27] px-1.5 py-0.5 rounded bg-[#B86B27]/10">
                            {base.vol}
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-[#6E6961] mt-1 font-light leading-snug">
                          {base.subtitle}
                        </p>
                        <p className="font-mono text-[9px] text-[#171614]/40 mt-1">
                          {base.notes}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      {isSelected ? (
                        <div className="flex items-center space-x-1 text-[#B86B27] font-mono text-[10px] font-semibold">
                          <Check size={12} strokeWidth={2.5} />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <span className="text-[#171614]/30 font-mono text-[10px] group-hover:text-[#B86B27] transition-colors">
                          POUR
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Navigation Button */}
          <button
            onClick={() => handleJumpToStage(0.46)}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
          >
            <span className="text-[11px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Adaptogen Infusion (+80mL)</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BIOACTIVE NOOTROPIC (+80mL)                             */}
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
        <div className="w-full max-w-[440px] pointer-events-auto bg-[#FCFAF7]/95 p-6 sm:p-7 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(23,22,20,0.08)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              BIOACTIVE INFUSION
            </span>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-medium">
              +80mL / 400mL Total
            </span>
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Clinical <span className="font-serif italic font-normal text-[#B86B27]">Nootropics</span>.
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-4">
            Dual-extract adaptogenic matrix. Unseals stopper; infuses targeted neuro-nutritional synergy.
          </p>

          {/* Volume Status Pill */}
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-white/70 border border-[#171614]/[0.07] flex items-center justify-between text-xs font-mono">
            <span className="text-[#171614]/80 text-[11px]">
              {formula.nootropic ? '80mL adaptogen stack infused' : 'Select bioactive stack (+80mL)'}
            </span>
            <span className="text-[#B86B27] text-[11px] tracking-wider font-semibold">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          <div className="space-y-2.5">
            {nootropics.map((item) => {
              const isSelected = formula.nootropic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNootropic(item.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27] ring-2 ring-[#B86B27]/10'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif italic text-sm text-[#B86B27]">
                          {item.roman}.
                        </span>
                        <h3 className="font-sans font-medium text-xs text-[#171614]">
                          {item.name}
                        </h3>
                      </div>
                      <div className="font-mono text-[9px] text-[#B86B27] mt-1">
                        {item.dose}
                      </div>
                      <p className="font-sans text-[11px] text-[#6E6961] mt-1 font-light leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pl-2 pt-0.5">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#B86B27] text-white flex items-center justify-center shadow-xs">
                          <Check size={11} strokeWidth={2.5} />
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

          {/* Continue Navigation Button */}
          <button
            onClick={() => handleJumpToStage(0.66)}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
          >
            <span className="text-[11px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Modifier Cordial & Chill</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODIFIER CORDIAL & CHILL (+100mL = 500mL)              */}
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
        <div className="w-full max-w-[440px] pointer-events-auto bg-[#FCFAF7]/95 p-6 sm:p-7 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(23,22,20,0.08)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              CORDIAL & TEMPERATURE
            </span>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-semibold">
              500mL Full Volume
            </span>
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Botanical Cordial <span className="font-serif italic font-normal text-[#B86B27]">& Chill</span>.
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-4">
            Binds the distillation with steam-extracted aromatic hydrosol and sets crystal serving temperature.
          </p>

          {/* 60mL Botanical Modifier Cordials */}
          <div className="space-y-2 mb-3.5">
            <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
              Aromatic Modifier Hydrosol (+60mL)
            </label>
            {modifiers.map((mod) => {
              const isSelected = formula.modifier === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModifier(mod.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-sm border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-medium text-xs text-[#171614]">{mod.name}</h4>
                      <p className="font-sans text-[10px] text-[#6E6961] mt-0.5">{mod.botanical}</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#B86B27] pl-2 font-medium">{mod.vol}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 40mL Chill Architecture */}
          <div className="grid grid-cols-2 gap-2.5 mb-2">
            <button
              onClick={() => handleSelectChill('glacial')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'glacial'
                  ? 'bg-white border-2 border-[#0284C7] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#0284C7]/15 text-[#0284C7] flex items-center justify-center mb-1.5">
                <Snowflake size={11} />
              </div>
              <h4 className="font-sans font-medium text-xs text-[#171614]">Glacial Serve</h4>
              <p className="font-mono text-[9px] text-[#0284C7] mt-0.5">-4°C · Hand-Cut Ice (+40mL)</p>
            </button>

            <button
              onClick={() => handleSelectChill('cellar')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'cellar'
                  ? 'bg-white border-2 border-[#B86B27] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#B86B27]/15 text-[#B86B27] flex items-center justify-center mb-1.5">
                <Flame size={11} />
              </div>
              <h4 className="font-sans font-medium text-xs text-[#171614]">Cellar Serve</h4>
              <p className="font-mono text-[9px] text-[#B86B27] mt-0.5">18°C · Uncut & Neat</p>
            </button>
          </div>

          {/* Continue Navigation Button */}
          <button
            onClick={() => handleJumpToStage(0.82)}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
          >
            <span className="text-[11px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Bespoke Vessel Suite</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. BESPOKE 3D ATELIER SUITE (CUSTOMIZATION)                */}
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
        <div className="w-full max-w-[450px] pointer-events-auto bg-[#FCFAF7]/95 p-6 sm:p-7 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(23,22,20,0.08)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              VESSEL ATELIER
            </span>
            <span className="font-mono text-[10px] text-[#B86B27] tracking-wider font-medium">
              3D Customization
            </span>
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Bespoke Vessel <span className="font-serif italic font-normal text-[#B86B27]">Suite</span>.
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3.5">
            Configure glass tint, metallurgy, neck seal, and live laser monogram engraving.
          </p>

          <div className="space-y-3">
            {/* 1. Vessel Glass Tint */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
                  Borosilicate Glass Tint
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
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
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
              <div className="flex space-x-1.5">
                {seals.map((s) => {
                  const isSel = formula.seal === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeal(s.id)}
                      className={`relative flex-1 p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSel ? 'bg-white border-2 border-[#B86B27] shadow-sm' : 'bg-white/70 hover:bg-white border-[#171614]/10'
                      }`}
                      title={s.name}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner mb-1"
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
                        className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
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
                        className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-1.5 ${
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
            <div className="pt-2.5 border-t border-[#171614]/10 space-y-2">
              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                  Custom Reserve Title
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={formula.customName}
                  onChange={(e) => scrollStore.setCustomName(e.target.value)}
                  placeholder="e.g. ABHAYJEET RESERVE"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium outline-none transition-all"
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium font-serif uppercase outline-none transition-all"
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] font-mono outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Continue Navigation Button */}
          <button
            onClick={() => handleJumpToStage(0.95)}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
          >
            <span className="text-[11px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Vault Allocation & Billing</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. DISPATCH ALLOCATION & AUTHENTIC BILLING                */}
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
        <div className="w-full max-w-[450px] pointer-events-auto bg-[#FCFAF7]/95 p-6 sm:p-7 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(23,22,20,0.08)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              DISPATCH ALLOCATION
            </span>
            {/* Currency Selector */}
            <div className="flex bg-[#171614]/5 rounded-lg p-0.5 border border-[#171614]/10 shrink-0">
              {(['USD', 'EUR', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCurrency(c)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    order.currency === c ? 'bg-white text-[#171614] font-bold shadow-xs' : 'text-[#6E6961] hover:text-[#171614]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Dispatch <span className="font-serif italic font-normal text-[#B86B27]">Allocation</span>.
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3.5">
            Zero-proof botanical bottling allocation. Ships in temperature-controlled protective casing.
          </p>

          {/* Allocation Quantity Tiers */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {allocationTiers.map((t) => {
              const isSel = (order.quantity || 1) === t.qty;
              return (
                <button
                  key={t.qty}
                  onClick={() => handleSelectQuantity(t.qty)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
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

          {/* Itemized Transparent Luxury Billing Statement */}
          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#171614]/[0.08] mb-3 text-[10px] font-mono space-y-1.5">
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

            <div className="flex justify-between items-center border-t border-[#171614]/15 pt-2 text-xs font-sans">
              <span className="text-[#171614] font-semibold uppercase tracking-wider text-[10px]">Total Investment</span>
              <span className="text-[#B86B27] font-bold text-sm font-mono">
                {formatPrice(order.totalPrice || currentTier.basePrice + currentTier.engPrice)}
              </span>
            </div>
          </div>

          {/* Member Privilege Code Entry */}
          {!order.confirmed && (
            <div className="flex items-center space-x-1.5 mb-3">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="VIP ATELIER KEY (e.g. VIP-AETHER)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] font-mono text-[9px] text-[#171614] uppercase outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo()}
                className="px-3 py-1.5 rounded-xl bg-[#171614]/5 hover:bg-[#171614]/10 border border-[#171614]/10 font-mono text-[9px] text-[#171614] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
          {promoFeedback && (
            <div className={`-mt-2 mb-2.5 font-mono text-[9px] ${promoFeedback.includes('Authenticated') ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
              {promoFeedback}
            </div>
          )}

          {order.confirmed ? (
            /* Luxury Certificate of Provenance */
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] border-2 border-[#D4AF37]/50 shadow-md text-left space-y-2 relative overflow-hidden">
              <div className="border-b border-[#D4AF37]/30 pb-2 flex items-center justify-between">
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

              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-1.5 px-3 rounded-xl bg-white border border-[#171614]/15 hover:border-[#171614]/30 font-sans text-[11px] text-[#171614] flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Printer size={12} />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playClick(800);
                    scrollStore.setCustomerOrder({ confirmed: false });
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#171614]/5 hover:bg-[#171614]/10 border border-[#171614]/10 font-sans text-[11px] text-[#171614] flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw size={12} />
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
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
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
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-2xl bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] font-sans text-xs font-medium tracking-tight flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Authorize & Dispatch Allocation</span>
                <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}