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
  Sparkles
} from 'lucide-react';
import { 
  scrollStore, 
  BaseDistillate, 
  NootropicStack, 
  BotanicalModifier,
  ChillMode, 
  SealColor 
} from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function ScrollStagesOverlay() {
  const [scrollProgress, setScrollProgress] = useState(scrollStore.progress);
  const [formula, setFormula] = useState({ ...scrollStore.formula });
  const [order, setOrder] = useState({ ...scrollStore.order });
  const [pourState, setPourState] = useState({ ...scrollStore.pour });

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
    { id: 'brass', name: 'Champagne Brass', hex: '#C59B27', desc: 'Hand-burnished brass medallion' },
    { id: 'noir', name: 'Obsidian Carbon', hex: '#22201D', desc: 'CNC-machined blackened titanium' },
    { id: 'copper', name: 'Rose Copper', hex: '#B3542E', desc: 'Fire-annealed copper foil' },
  ];

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
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-end space-y-4 pointer-events-auto z-40">
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
        <div className="w-full max-w-[400px] pointer-events-auto bg-white/85 p-5 sm:p-6 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Droplet size={11} className="text-[#B86B27]" />
              <span>PHASE 01 // FOUNDATION</span>
            </div>
            <span className="tracking-wider">{s2.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s2.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Primary Distillate<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3">
            The foundation aromatic carrier extracted via cold rotary vacuum. Fills 320mL (64%) of the vessel.
          </p>

          {/* Factual Volume Telemetry Bar */}
          <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${pourState.isPouring ? 'bg-[#B86B27] animate-ping' : pourState.fillLevel >= 0.64 ? 'bg-[#065F46]' : 'bg-[#171614]/30'}`} />
              <span className="text-[#171614]/80 text-[11px]">{pourState.statusText}</span>
            </div>
            <span className="text-[#B86B27] text-[11px] tracking-wider font-medium">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          {/* Factual 320mL Base Distillates */}
          <div className="space-y-2">
            {bases.map((base) => {
              const isSelected = formula.base === base.id;
              return (
                <button
                  key={base.id}
                  onClick={() => handleSelectBase(base.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
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
                        <div className="flex items-center space-x-1 text-[#B86B27] font-mono text-[9px]">
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
            <span className="text-[11px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 01 Done</span>
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
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div className="w-full max-w-[400px] pointer-events-auto bg-white/85 p-5 sm:p-6 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Layers size={11} className="text-[#B86B27]" />
              <span>PHASE 02 // ADAPTOGEN INFUSION</span>
            </div>
            <span className="tracking-wider">{s3.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s3.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Infuse Clinical Actives<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3">
            Dual-extract adaptogens. Vessel elevates into architectural exploded view; volume rises to 400mL (80%).
          </p>

          {/* Volume Bar */}
          <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-[#171614]/80 text-[11px]">
              {formula.nootropic ? '80mL adaptogen infused' : 'Select bioactive stack (+80mL)'}
            </span>
            <span className="text-[#B86B27] text-[11px] tracking-wider font-medium">
              {pourState.currentVolumeMl} / 500mL
            </span>
          </div>

          <div className="space-y-2">
            {nootropics.map((item) => {
              const isSelected = formula.nootropic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNootropic(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27]'
                      : 'bg-white/60 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/25'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif italic text-xs text-[#B86B27]">
                          {item.roman}.
                        </span>
                        <h3 className="font-sans font-medium text-xs text-[#171614]">
                          {item.name}
                        </h3>
                      </div>
                      <div className="font-mono text-[10px] text-[#B86B27] mt-0.5">
                        {item.dose}
                      </div>
                      <p className="font-sans text-[11px] text-[#6E6961] mt-1 font-light leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pl-1.5">
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
            <span className="text-[11px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 02 Done</span>
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
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div className="w-full max-w-[400px] pointer-events-auto bg-white/85 p-5 sm:p-6 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Sparkles size={11} className="text-[#B86B27]" />
              <span>PHASE 03 // ARCHITECTURE & CHILL</span>
            </div>
            <span className="tracking-wider">{s4.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s4.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Architecture & Finish<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3">
            Binds the aromatics and finishes the 500mL vessel capacity.
          </p>

          {/* Volume Bar */}
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#171614]/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-[#171614]/80 text-[11px]">
              Final blend: {pourState.currentVolumeMl}mL / 500mL
            </span>
            <span className="text-[#B86B27] text-[11px] tracking-wider font-medium">
              100% CAPACITY
            </span>
          </div>

          {/* 60mL Botanical Modifier Cordials */}
          <div className="space-y-1.5 mb-3.5">
            <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest">
              Select Aromatic Modifier (+60mL)
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
                      <p className="font-sans text-[10px] text-[#6E6961]">{mod.botanical}</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#B86B27] pl-2">{mod.vol}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 40mL Chill Architecture */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectChill('glacial')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'glacial'
                  ? 'bg-white border-2 border-[#9CE0FF] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#9CE0FF]/20 text-[#0284C7] flex items-center justify-center mb-1.5">
                <Snowflake size={12} />
              </div>
              <h4 className="font-sans font-medium text-xs text-[#171614]">Glacial Serve</h4>
              <p className="font-mono text-[9px] text-[#B86B27] mt-0.5">-4°C · Hand-Cut Ice (+40mL)</p>
            </button>

            <button
              onClick={() => handleSelectChill('cellar')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                formula.chill === 'cellar'
                  ? 'bg-white border-2 border-[#B86B27] shadow-sm'
                  : 'bg-white/60 hover:bg-white border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#B86B27]/10 text-[#B86B27] flex items-center justify-center mb-1.5">
                <Flame size={12} />
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
            <span className="text-[11px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 03 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Engrave 3D Label</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 5: BESPOKE LABEL PERSONALIZATION (74% - 88%)         */}
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
        <div className="w-full max-w-[400px] pointer-events-auto bg-white/85 p-5 sm:p-6 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <Award size={11} className="text-[#B86B27]" />
              <span>PHASE 04 // 3D LASER ENGRAVING</span>
            </div>
            <span className="tracking-wider">{s5.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s5.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Engrave The 3D Label<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-3">
            Type your private reserve title and monogram. The 3D label on the bottle engraves in real time.
          </p>

          <div className="space-y-2.5">
            <div>
              <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                Custom Edition Title
              </label>
              <input
                type="text"
                maxLength={24}
                value={formula.customName}
                onChange={(e) => scrollStore.setCustomName(e.target.value)}
                placeholder="e.g. ABHAYJEET RESERVE"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Monogram Initials
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={formula.engravedInitials}
                  onChange={(e) => scrollStore.setEngravedInitials(e.target.value.toUpperCase())}
                  placeholder="AT"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-xs text-[#171614] font-medium font-serif uppercase outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Medallion Foil
                </label>
                <div className="flex space-x-2 pt-0.5">
                  {seals.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeal(s.id)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        formula.seal === s.id ? 'border-[#B86B27] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: s.hex }}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-1 text-[10px] font-mono text-[#B86B27] flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
              <span>3D TEXTURE EMBOSSED IN REAL TIME</span>
            </div>
          </div>

          {/* Continue Action Pill */}
          <button
            onClick={() => handleJumpToStage(0.94)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#171614]/[0.04] hover:bg-[#B86B27]/10 border border-[#171614]/10 hover:border-[#B86B27]/30 text-xs font-sans text-[#171614] flex items-center justify-between transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-mono text-[#6E6961] group-hover:text-[#B86B27]">Step 04 Done</span>
            <div className="flex items-center space-x-1.5 text-[#B86B27] font-medium text-xs">
              <span>Next: Dispatch Allocation</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 6: DISPATCH VAULT & ALLOCATION (88% - 100%)          */}
      {/* ========================================================= */}
      <div
        style={{
          opacity: s6.opacity,
          transform: s6.transform,
          pointerEvents: s6.pointerEvents,
          display: s6.display,
        }}
        className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-end transition-transform duration-100 ease-out"
      >
        <div className="w-full max-w-[400px] pointer-events-auto bg-white/85 p-5 sm:p-6 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Phase Telemetry & Scrubber */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#B86B27] mb-1">
            <div className="flex items-center space-x-1.5 tracking-[0.20em] uppercase">
              <ShieldCheck size={11} className="text-[#B86B27]" />
              <span>PHASE 05 // VAULT ALLOCATION</span>
            </div>
            <span className="tracking-wider">{s6.intraProgress}%</span>
          </div>

          <div className="w-full bg-[#171614]/[0.06] h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#B86B27] h-full transition-all duration-150"
              style={{ width: `${s6.intraProgress}%` }}
            />
          </div>

          <h2 className="font-sans font-light text-2xl text-[#171614] tracking-[-0.02em] mb-1">
            Dispatch Your Batch<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-2.5">
            Nitrogen-purged packaging, signed certificate, and direct courier dispatch.
          </p>

          {/* Factual Recipe Breakdown Receipt */}
          <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#171614]/[0.08] mb-2.5 text-[11px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-[#171614]/50">DISTILLATE (320mL):</span>
              <span className="text-[#171614] font-medium uppercase">{formula.base || 'YUZU'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#171614]/50">NOOTROPIC (80mL):</span>
              <span className="text-[#171614] font-medium uppercase">{formula.nootropic || 'ALPHA'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#171614]/50">MODIFIER (60mL):</span>
              <span className="text-[#171614] font-medium uppercase">{formula.modifier || 'ROSEMARY'}</span>
            </div>
            <div className="flex justify-between border-t border-[#171614]/10 pt-1">
              <span className="text-[#171614]/60">TOTAL VOLUME:</span>
              <span className="text-[#B86B27] font-semibold">500mL // 0.0% ABV</span>
            </div>
          </div>

          {order.confirmed ? (
            <div className="p-4 rounded-xl bg-[#065F46]/10 border border-[#065F46]/30 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#065F46] text-white flex items-center justify-center mx-auto">
                <Check size={16} />
              </div>
              <h3 className="font-sans font-medium text-sm text-[#065F46]">
                Allocation Authenticated
              </h3>
              <div className="font-mono text-[11px] text-[#065F46] tracking-widest">
                SERIAL: {order.serialNumber}
              </div>
              <p className="font-sans text-xs text-[#6E6961]">
                Dispatched to {order.fullName || 'Recipient'} at {order.address || 'Confidential Destination'}.
              </p>
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
              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                  Recipient Name
                </label>
                <input
                  required
                  type="text"
                  value={order.fullName}
                  onChange={(e) => scrollStore.setCustomerOrder({ fullName: e.target.value })}
                  placeholder="Abhayjeet Tomar"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                  Delivery Destination
                </label>
                <input
                  required
                  type="text"
                  value={order.address}
                  onChange={(e) => scrollStore.setCustomerOrder({ address: e.target.value })}
                  placeholder="740 Park Avenue, Residence 4B"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    City & Postal
                  </label>
                  <input
                    required
                    type="text"
                    value={order.city}
                    onChange={(e) => scrollStore.setCustomerOrder({ city: e.target.value })}
                    placeholder="New York, NY 10021"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-[#171614]/60 uppercase tracking-widest mb-0.5">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={order.email}
                    onChange={(e) => scrollStore.setCustomerOrder({ email: e.target.value })}
                    placeholder="atelier@aether.luxury"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-1.5 py-2.5 rounded-xl bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] font-sans text-xs font-medium tracking-tight flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
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
