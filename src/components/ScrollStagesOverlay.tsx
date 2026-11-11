import React, { useEffect, useState } from 'react';
import { 
  Snowflake, 
  Flame, 
  Check, 
  ArrowRight, 
  Printer, 
  RotateCcw
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

  // Continuous RAF interpolation for silky transitions
  useEffect(() => {
    let animId: number;
    let lastP = -1;
    const checkScroll = () => {
      const curP = scrollStore.progress;
      if (Math.abs(curP - lastP) > 0.001) {
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
      setPromoFeedback('Privilege Key Verified (-$15/vessel)');
    } else if (clean === '') {
      scrollStore.setCustomerOrder({ memberCode: '' });
      setPromoFeedback(null);
    } else {
      audioSystem.playClick(440);
      setPromoFeedback('Unrecognized Key');
    }
  };

  // 1. Factual 320mL Base Distillates (Concise, Elegant Copy)
  const bases: { id: BaseDistillate; name: string; notes: string; color: string; vol: string }[] = [
    {
      id: 'yuzu',
      name: 'Japanese Yuzu & Chinotto',
      notes: 'Golden Amber · Cold Tokushima citrus · Mineral finish',
      color: '#D97706',
      vol: '320mL (64%)',
    },
    {
      id: 'blood_orange',
      name: 'Smoked Sicilian Orange & Gentian',
      notes: 'Smoked Ruby · Torched Moro rind · Velvety amaro finish',
      color: '#991B1B',
      vol: '320mL (64%)',
    },
    {
      id: 'juniper',
      name: 'Wild Alpine Juniper & Fir',
      notes: 'Forest Emerald · Sub-zero extraction · Resinous cedar',
      color: '#065F46',
      vol: '320mL (64%)',
    },
  ];

  // 2. Factual 80mL Bioactive Nootropics (Concise, Elegant Copy)
  const nootropics: { id: NootropicStack; name: string; dose: string; notes: string; roman: string }[] = [
    {
      id: 'alpha',
      roman: 'I',
      name: 'Alpha-Wave Cognitive Flow',
      dose: '600mg Lion\'s Mane · 250mg L-Theanine',
      notes: 'Calm alpha velocity without caffeine jitter',
    },
    {
      id: 'social',
      roman: 'II',
      name: 'Sensory Euphoria & Social Uplift',
      dose: '400mg Damiana · 250mg Schisandra Berry',
      notes: 'Warm dopamine tone and effortless conversation',
    },
    {
      id: 'restoration',
      roman: 'III',
      name: 'Parasympathetic Recovery',
      dose: '350mg Ashwagandha · 150mg Magnesium L-Threonate',
      notes: 'Cortisol release and cellular evening recovery',
    },
  ];

  // 3. Factual 60mL Botanical Modifiers
  const modifiers: { id: BotanicalModifier; name: string; notes: string; vol: string }[] = [
    {
      id: 'rosemary',
      name: 'Charred Rosemary & Cardamom',
      notes: 'Spanish rosemary hydrosol & green spice',
      vol: '60mL',
    },
    {
      id: 'vetiver',
      name: 'Smoked Vetiver & Fig Leaf',
      notes: 'Haitian root & lactonic fig cordial',
      vol: '60mL',
    },
    {
      id: 'shiso',
      name: 'Herbaceous Shiso & Mountain Sage',
      notes: 'Cold-pressed purple shiso & sage',
      vol: '60mL',
    },
  ];

  // Realistic Artisanal Stopper Metallurgy
  const seals: { id: SealColor; name: string; hex: string }[] = [
    { id: 'brass', name: 'Burnished Brass', hex: '#D4AF37' },
    { id: 'noir', name: 'Gunmetal Steel', hex: '#27272A' },
    { id: 'silver', name: 'Sterling Platinum', hex: '#E2E8F0' },
  ];

  // Realistic Neck Dipped Seals
  const waxDips: { id: WaxDip; name: string; hex: string }[] = [
    { id: 'crimson', name: 'Burgundy Wax', hex: '#881337' },
    { id: 'black', name: 'Midnight Wax', hex: '#18181B' },
    { id: 'none', name: 'Flor Cork & Band', hex: '#C29B38' },
  ];

  const allocationTiers = [
    { qty: 1 as const, name: 'Single Flacon', basePrice: 145, engPrice: 28 },
    { qty: 2 as const, name: 'Collector Pair', basePrice: 260, engPrice: 50 },
    { qty: 6 as const, name: 'Private Cellar', basePrice: 720, engPrice: 100 },
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
    { num: 2, label: 'Distillate', p: 0.22 },
    { num: 3, label: 'Infusion', p: 0.44 },
    { num: 4, label: 'Architecture', p: 0.64 },
    { num: 5, label: 'Atelier', p: 0.80 },
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

  // Continuous Seamless Cross-Fade (Zero Dead Zone, Zero Sticking)
  const getStageStyle = (enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
    const p = scrollProgress;
    if (p < enterStart || p > exitEnd) {
      return {
        opacity: 0,
        transform: `translateY(${p < enterStart ? 18 : -18}px)`,
        pointerEvents: 'none' as const,
        display: 'none',
      };
    }

    let opacity = 1;
    let translateY = 0;

    if (p < enterEnd && enterEnd > enterStart) {
      const t = (p - enterStart) / (enterEnd - enterStart);
      opacity = t;
      translateY = (1 - t) * 18;
    } else if (p > exitStart && exitEnd > exitStart) {
      const t = (p - exitStart) / (exitEnd - exitStart);
      opacity = 1 - t;
      translateY = -t * 18;
    }

    return {
      opacity,
      transform: `translateY(${translateY.toFixed(1)}px)`,
      pointerEvents: opacity > 0.2 ? ('auto' as const) : ('none' as const),
      display: opacity > 0.01 ? 'flex' : 'none',
    };
  };

  // Tight seamless cross-fades: When one card begins leaving, the next is ALREADY entering!
  const s1 = getStageStyle(0.00, 0.00, 0.10, 0.16);
  const s2 = getStageStyle(0.10, 0.16, 0.30, 0.36);
  const s3 = getStageStyle(0.30, 0.36, 0.50, 0.56);
  const s4 = getStageStyle(0.50, 0.56, 0.68, 0.74);
  const s5 = getStageStyle(0.68, 0.74, 0.84, 0.88);
  const s6 = getStageStyle(0.84, 0.88, 1.00, 1.00);

  let activeRailStage = 1;
  if (scrollProgress >= 0.88) activeRailStage = 6;
  else if (scrollProgress >= 0.74) activeRailStage = 5;
  else if (scrollProgress >= 0.56) activeRailStage = 4;
  else if (scrollProgress >= 0.36) activeRailStage = 3;
  else if (scrollProgress >= 0.16) activeRailStage = 2;

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden select-none text-[#171614]">
      {/* Right-Side Minimal Navigation Rail */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-end space-y-3 pointer-events-auto z-40">
        {stageTargets.map((s) => (
          <button
            key={s.num}
            onClick={() => handleJumpToStage(s.p)}
            className="group flex items-center space-x-2.5 cursor-pointer py-1"
          >
            <span
              className={`font-sans text-[11px] tracking-wide transition-all duration-300 ${
                activeRailStage === s.num
                  ? 'text-[#B86B27] font-medium opacity-100 translate-x-0'
                  : 'text-[#171614]/30 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0'
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
      {/* 1. GENESIS (HERO)                                          */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s1.opacity,
          transform: s1.transform,
          pointerEvents: s1.pointerEvents,
          display: s1.display,
        }}
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 py-12 flex flex-col justify-end transition-transform duration-100 ease-out"
      >
        <div className="flex flex-col md:flex-row justify-between items-end gap-5 max-w-[1400px] w-full mx-auto pb-4">
          <div className="max-w-xl">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.24em] uppercase block mb-2 font-semibold">
              ATELIER BESPOKE · 500ML DECANTER
            </span>
            <h1 className="font-sans font-light text-3xl sm:text-5xl text-[#171614] leading-[1.08] tracking-[-0.03em]">
              A pure vessel,<br />
              <span className="font-serif italic font-normal text-[#171614]">
                awaiting distillation
              </span>
              .
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6E6961] mt-2.5 font-light leading-relaxed">
              Zero-proof botanical alchemy in high-flint crystal. Scroll downward or begin below.
            </p>
          </div>

          <button
            onClick={() => handleJumpToStage(0.22)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white border border-[#171614]/15 hover:border-[#B86B27] text-xs font-sans text-[#171614] transition-all shadow-xs hover:shadow cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
            <span className="font-medium">Begin formulation</span>
            <span className="text-[#B86B27] group-hover:translate-y-0.5 transition-transform">↓</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PRIMARY DISTILLATE BASE (320mL / 64%)                   */}
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
        <div className="w-full max-w-[400px] pointer-events-auto bg-[#FCFAF7]/95 p-5 sm:p-6 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(23,22,20,0.07)] my-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              PRIMARY EXTRACTION
            </span>
            <span className="font-mono text-[9px] text-[#B86B27] font-medium">
              320mL Foundation
            </span>
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Primary Distillate <span className="font-serif italic font-normal text-[#B86B27]">Base</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#6E6961] font-light leading-snug mb-3">
            Cold vacuum extraction sets the core aroma and mineral profile.
          </p>

          {/* 320mL Base Distillates */}
          <div className="space-y-2">
            {bases.map((base) => {
              const isSelected = formula.base === base.id;
              return (
                <button
                  key={base.id}
                  onClick={() => handleSelectBase(base.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-200 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-sm border-2 border-[#B86B27] ring-1 ring-[#B86B27]/15'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: base.color }}
                      />
                      <div>
                        <h3 className="font-sans font-medium text-xs text-[#171614]">
                          {base.name}
                        </h3>
                        <p className="font-sans text-[10px] text-[#6E6961] font-light">
                          {base.notes}
                        </p>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-[#B86B27] font-mono text-[9px] font-bold">320ML</span>
                    ) : (
                      <span className="text-[#171614]/30 font-mono text-[9px] group-hover:text-[#B86B27]">POUR</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleJumpToStage(0.44)}
            className="w-full mt-3.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <span className="text-[10px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Adaptogen Infusion</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
        <div className="w-full max-w-[400px] pointer-events-auto bg-[#FCFAF7]/95 p-5 sm:p-6 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(23,22,20,0.07)] my-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              FUNCTIONAL MATRIX
            </span>
            <span className="font-mono text-[9px] text-[#B86B27] font-medium">
              +80mL Stack
            </span>
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Bioactive <span className="font-serif italic font-normal text-[#B86B27]">Adaptogens</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#6E6961] font-light leading-snug mb-3">
            Clinical dual-extract adaptogens targeting mental tone.
          </p>

          <div className="space-y-2">
            {nootropics.map((item) => {
              const isSelected = formula.nootropic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNootropic(item.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-sm border-2 border-[#B86B27] ring-1 ring-[#B86B27]/15'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-serif italic text-xs text-[#B86B27]">{item.roman}.</span>
                        <h3 className="font-sans font-medium text-xs text-[#171614]">{item.name}</h3>
                      </div>
                      <p className="font-mono text-[9px] text-[#B86B27] mt-0.5">{item.dose}</p>
                      <p className="font-sans text-[10px] text-[#6E6961] font-light leading-tight">{item.notes}</p>
                    </div>
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#B86B27] text-white flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#171614]/20 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleJumpToStage(0.64)}
            className="w-full mt-3.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <span className="text-[10px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Modifier & Chill</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
        <div className="w-full max-w-[400px] pointer-events-auto bg-[#FCFAF7]/95 p-5 sm:p-6 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(23,22,20,0.07)] my-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              AROMATICS & TEMPERATURE
            </span>
            <span className="font-mono text-[9px] text-[#B86B27] font-semibold">
              500mL Full
            </span>
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Botanical Cordial <span className="font-serif italic font-normal text-[#B86B27]">& Chill</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#6E6961] font-light leading-snug mb-2.5">
            Binds aromatics and sets crystal serving temperature.
          </p>

          {/* 3 Modifiers */}
          <div className="space-y-1.5 mb-2.5">
            {modifiers.map((mod) => {
              const isSelected = formula.modifier === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModifier(mod.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white shadow-xs border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08]'
                  }`}
                >
                  <div>
                    <h4 className="font-sans font-medium text-xs text-[#171614] leading-tight">{mod.name}</h4>
                    <p className="font-sans text-[9px] text-[#6E6961]">{mod.notes}</p>
                  </div>
                  <span className="font-mono text-[9px] text-[#B86B27] font-medium pl-1.5">{mod.vol}</span>
                </button>
              );
            })}
          </div>

          {/* 2 Chill Modes */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handleSelectChill('glacial')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'glacial'
                  ? 'bg-white border-2 border-[#0284C7] shadow-xs'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-[#0284C7] mb-0.5">
                <Snowflake size={11} />
                <span className="font-sans font-medium text-xs">Glacial Serve</span>
              </div>
              <p className="font-mono text-[8px] text-[#0284C7]">-4°C · Hand-Cut Ice (+40mL)</p>
            </button>

            <button
              onClick={() => handleSelectChill('cellar')}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'cellar'
                  ? 'bg-white border-2 border-[#B86B27] shadow-xs'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-[#B86B27] mb-0.5">
                <Flame size={11} />
                <span className="font-sans font-medium text-xs">Cellar Serve</span>
              </div>
              <p className="font-mono text-[8px] text-[#B86B27]">18°C · Uncut Neat</p>
            </button>
          </div>

          <button
            onClick={() => handleJumpToStage(0.80)}
            className="w-full mt-2.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <span className="text-[10px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Bespoke Atelier</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. BESPOKE ATELIER SUITE (COMPACT & REALISTIC)             */}
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
        <div className="w-full max-w-[420px] pointer-events-auto bg-[#FCFAF7]/95 p-5 sm:p-6 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(23,22,20,0.07)] my-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              ATELIER BESPOKE
            </span>
            <span className="font-mono text-[9px] text-[#B86B27] font-medium">
              Decanter Finishing
            </span>
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Bespoke Vessel <span className="font-serif italic font-normal text-[#B86B27]">Suite</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#6E6961] font-light leading-snug mb-3">
            Artisanal stopper metallurgy, wax seal, and live laser monogram.
          </p>

          <div className="space-y-2.5">
            {/* 1. Stopper Metallurgy (3 Realistic Choices) */}
            <div>
              <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                Stopper Metallurgy
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {seals.map((s) => {
                  const isSel = formula.seal === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeal(s.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-white border-2 border-[#B86B27] shadow-xs'
                          : 'bg-white/60 hover:bg-white border-[#171614]/10'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full mb-1 border border-black/10" style={{ backgroundColor: s.hex }} />
                      <span className="font-sans text-[10px] font-medium text-[#171614] leading-none">{s.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Neck Wax Dipped Seal (3 Realistic Choices) */}
            <div>
              <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                Neck Finish & Seal
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {waxDips.map((wd) => {
                  const isSel = formula.waxDip === wd.id;
                  return (
                    <button
                      key={wd.id}
                      onClick={() => handleSelectWaxDip(wd.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-white border-2 border-[#B86B27] shadow-xs'
                          : 'bg-white/60 hover:bg-white border-[#171614]/10'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full mb-1 border border-black/10" style={{ backgroundColor: wd.hex }} />
                      <span className="font-sans text-[10px] font-medium text-[#171614] leading-none truncate max-w-full">{wd.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Live 3D Laser Monogram & Inscription */}
            <div className="pt-2 border-t border-[#171614]/10 space-y-1.5">
              <div>
                <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                  Reserve Edition Title
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={formula.customName}
                  onChange={(e) => scrollStore.setCustomName(e.target.value)}
                  placeholder="ABHAYJEET RESERVE"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Monogram Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formula.engravedInitials}
                    onChange={(e) => scrollStore.setEngravedInitials(e.target.value.toUpperCase())}
                    placeholder="AT"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] font-serif font-bold uppercase outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[8px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Cask & Year
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={formula.batchYear}
                    onChange={(e) => scrollStore.setBatchYear(e.target.value.toUpperCase())}
                    placeholder="2026 // CASK 01"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] font-mono outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleJumpToStage(0.94)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#171614]/10 hover:border-[#B86B27]/40 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <span className="text-[10px] font-sans text-[#6E6961]">Continue formulation</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Dispatch Allocation</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. DISPATCH ALLOCATION (COMPACT & COMPLETE)                */}
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
        <div className="w-full max-w-[420px] pointer-events-auto bg-[#FCFAF7]/95 p-5 sm:p-6 rounded-3xl border border-[#171614]/[0.08] backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(23,22,20,0.07)] my-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono text-[9px] text-[#B86B27] tracking-[0.20em] uppercase font-semibold">
              ALLOCATION REGISTRY
            </span>
            <div className="flex bg-[#171614]/5 rounded-lg p-0.5 border border-[#171614]/10 shrink-0">
              {(['USD', 'EUR', 'GBP'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer ${
                    order.currency === c ? 'bg-white text-[#171614] font-bold shadow-2xs' : 'text-[#6E6961]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-sans font-light text-xl text-[#171614] tracking-[-0.02em] mb-0.5">
            Dispatch <span className="font-serif italic font-normal text-[#B86B27]">Allocation</span>.
          </h2>
          <p className="font-sans text-[11px] text-[#6E6961] font-light leading-snug mb-2.5">
            Cold-chain temperature-controlled courier delivery.
          </p>

          {/* Allocation Quantity Tiers */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            {allocationTiers.map((t) => {
              const isSel = (order.quantity || 1) === t.qty;
              return (
                <button
                  key={t.qty}
                  onClick={() => handleSelectQuantity(t.qty)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSel
                      ? 'bg-[#171614] text-[#FAF7F0] border-[#171614] shadow-xs'
                      : 'bg-white hover:bg-[#FAF7F0] border-[#171614]/10 text-[#171614]'
                  }`}
                >
                  <span className="font-sans text-[10px] font-medium leading-none">{t.qty} Flacon{t.qty > 1 ? 's' : ''}</span>
                  <span className={`text-[10px] font-mono font-bold mt-1 ${isSel ? 'text-[#FAF7F0]' : 'text-[#B86B27]'}`}>
                    {formatPrice(t.basePrice + t.engPrice)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compact Order Summary */}
          <div className="p-2.5 rounded-xl bg-white/70 border border-[#171614]/[0.08] mb-2.5 text-[9px] font-mono space-y-1">
            <div className="flex justify-between items-center text-[#171614]">
              <span className="truncate max-w-[220px]">500mL Reserve [{formula.engravedInitials || 'AT'}]</span>
              <span className="font-bold text-xs text-[#B86B27]">
                {formatPrice(order.totalPrice || currentTier.basePrice + currentTier.engPrice)}
              </span>
            </div>
            {order.memberCode && (
              <div className="flex justify-between text-[#065F46]">
                <span>VIP Key Privilege ({order.memberCode})</span>
                <span>-{formatPrice(15 * currentTier.qty)}</span>
              </div>
            )}
          </div>

          {/* VIP Atelier Key */}
          {!order.confirmed && (
            <div className="flex items-center space-x-1.5 mb-2.5">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="VIP KEY (e.g. VIP-AETHER)"
                className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] font-mono text-[8px] text-[#171614] uppercase outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo()}
                className="px-2.5 py-1 rounded-lg bg-[#171614]/5 hover:bg-[#171614]/10 border border-[#171614]/10 font-mono text-[8px] text-[#171614] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
          {promoFeedback && (
            <div className={`-mt-1.5 mb-2 font-mono text-[8px] ${promoFeedback.includes('Verified') ? 'text-[#065F46]' : 'text-[#991B1B]'}`}>
              {promoFeedback}
            </div>
          )}

          {order.confirmed ? (
            /* Luxury Certificate of Provenance */
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] border-2 border-[#D4AF37]/50 shadow-xs text-left space-y-1.5">
              <div className="border-b border-[#D4AF37]/30 pb-1.5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[7px] text-[#B86B27] tracking-[0.25em] uppercase font-bold">
                    CERTIFICATE OF PROVENANCE
                  </div>
                  <h3 className="font-serif text-sm font-light text-[#171614] leading-tight">
                    Aether Bottling Registry
                  </h3>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check size={11} />
                </div>
              </div>

              <div className="font-mono text-[8px] space-y-0.5 text-[#171614]/80">
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">SERIAL:</span>
                  <span className="font-bold text-[#171614]">{order.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">EDITION:</span>
                  <span className="text-[#B86B27] font-semibold">{formula.customName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6961]">DISPATCH TO:</span>
                  <span className="text-[#171614] truncate max-w-[180px]">{order.fullName} — {order.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-1 px-2 rounded-lg bg-white border border-[#171614]/15 hover:border-[#171614]/30 font-sans text-[10px] text-[#171614] flex items-center justify-center space-x-1 cursor-pointer transition-all"
                >
                  <Printer size={11} />
                  <span>Print Record</span>
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
                  <span>Modify</span>
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
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  required
                  type="text"
                  value={order.fullName}
                  onChange={(e) => scrollStore.setCustomerOrder({ fullName: e.target.value })}
                  placeholder="Recipient Name"
                  className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
                <input
                  required
                  type="text"
                  value={order.address}
                  onChange={(e) => scrollStore.setCustomerOrder({ address: e.target.value })}
                  placeholder="Street Address"
                  className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <input
                  required
                  type="text"
                  value={order.city}
                  onChange={(e) => scrollStore.setCustomerOrder({ city: e.target.value })}
                  placeholder="City & Postal"
                  className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
                <input
                  required
                  type="email"
                  value={order.email}
                  onChange={(e) => scrollStore.setCustomerOrder({ email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 rounded-xl bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] font-sans text-xs font-medium tracking-tight flex items-center justify-center space-x-1.5 transition-all shadow-xs hover:shadow cursor-pointer"
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