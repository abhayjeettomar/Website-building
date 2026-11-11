import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Snowflake, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Droplet,
  Layers,
  Award,
  RefreshCw
} from 'lucide-react';
import { 
  scrollStore, 
  BaseDistillate, 
  NootropicStack, 
  ChillMode, 
  SealColor 
} from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function ScrollStagesOverlay() {
  const [activeStage, setActiveStage] = useState(scrollStore.stage);
  const [formula, setFormula] = useState({ ...scrollStore.formula });
  const [order, setOrder] = useState({ ...scrollStore.order });
  const [pourState, setPourState] = useState({ ...scrollStore.pour });

  useEffect(() => {
    // Only triggers updates on discrete events (stage crossing, button click, input edit)
    // ZERO continuous scroll re-render lag!
    const unsub = scrollStore.subscribe(() => {
      setActiveStage(scrollStore.stage);
      setFormula({ ...scrollStore.formula });
      setOrder({ ...scrollStore.order });
      setPourState({ ...scrollStore.pour });
    });
    return unsub;
  }, []);

  const handleSelectBase = (baseId: BaseDistillate) => {
    audioSystem.playClick(920);
    if (pourState.activeBase && pourState.activeBase !== baseId) {
      audioSystem.playDrain();
      setTimeout(() => audioSystem.playPour(), 700);
    } else {
      audioSystem.playPour();
    }
    scrollStore.selectBase(baseId);
  };

  const handleSelectNootropic = (stackId: NootropicStack) => {
    audioSystem.playClick(1050);
    scrollStore.setNootropic(stackId);
  };

  const handleSelectChill = (mode: ChillMode) => {
    if (mode === 'ice') {
      audioSystem.playClink();
    } else {
      audioSystem.playClick(750);
    }
    scrollStore.setChill(mode);
  };

  const handleSelectSeal = (seal: SealColor) => {
    audioSystem.playClick(880);
    scrollStore.setSeal(seal);
  };

  const bases: { id: BaseDistillate; name: string; subtitle: string; color: string; notes: string; profile: string }[] = [
    {
      id: 'yuzu',
      name: 'Charred Yuzu & Bergamot',
      subtitle: 'Cold-pressed mountain citrus, charred rind & wild bergamot bloom',
      color: '#D97706',
      notes: 'Bright golden amber · Vibrating citrus top-notes · Dry mineral finish',
      profile: 'Vibrant & Uplifting',
    },
    {
      id: 'blood_orange',
      name: 'Smoked Blood Orange & Fig',
      subtitle: 'Torched Sicilian citrus, black mission fig & gentle gentian root',
      color: '#B91C1C',
      notes: 'Smoked ruby · Rich bittersweet aperitif body · Velvet finish',
      profile: 'Complex & Contemplative',
    },
    {
      id: 'juniper',
      name: 'Wild Juniper & Alpine Pine',
      subtitle: 'Sub-zero vapor-distilled alpine needles & cracked green juniper',
      color: '#047857',
      notes: 'Luminous emerald · Resinous cedar clarity · Crisp mountain rain',
      profile: 'Crisp & Grounding',
    },
  ];

  const nootropics: { id: NootropicStack; name: string; dose: string; desc: string; roman: string }[] = [
    {
      id: 'alpha',
      roman: 'I',
      name: 'Alpha-Wave Serenity',
      dose: '500mg Lion\'s Mane · 200mg L-Theanine',
      desc: 'Sustained cognitive clarity and calm alpha-wave velocity with zero nervous caffeine tension or midday crash.',
    },
    {
      id: 'social',
      roman: 'II',
      name: 'Social Euphoria',
      dose: '350mg Damiana Leaf · Himalayan Schisandra',
      desc: 'Adaptogenic mood lift, sensory expansion, and gentle conversational ease wrapped in warm peppery botanicals.',
    },
    {
      id: 'euphoria',
      roman: 'III',
      name: 'Nocturnal Restoration',
      dose: '300mg KSM-66 Ashwagandha · Magnesium L-Threonate',
      desc: 'Deep cellular recovery, physical unwinding, and parasympathetic nervous system down-regulation for restorative rest.',
    },
  ];

  const seals: { id: SealColor; name: string; hex: string; desc: string }[] = [
    { id: 'gold', name: 'Champagne Brass', hex: '#C59B27', desc: 'Hand-burnished gold leaf medallion' },
    { id: 'noir', name: 'Raw Gunmetal', hex: '#2A2825', desc: 'CNC-machined industrial carbon black' },
    { id: 'copper', name: 'Rose Copper', hex: '#B3542E', desc: 'Apothecary fire-annealed copper foil' },
  ];

  const stageTargets = [
    { num: 1, label: 'Genesis', p: 0.0 },
    { num: 2, label: 'Distillate', p: 0.24 },
    { num: 3, label: 'Infusion', p: 0.45 },
    { num: 4, label: 'Chill', p: 0.65 },
    { num: 5, label: 'Engrave', p: 0.80 },
    { num: 6, label: 'Dispatch', p: 0.94 },
  ];

  const handleJumpToStage = (targetProgress: number) => {
    audioSystem.playClick(900);
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetProgress,
      behavior: 'smooth',
    });
  };

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
                activeStage === s.num
                  ? 'text-[#B86B27] font-medium opacity-100 translate-x-0'
                  : 'text-[#171614]/30 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              0{s.num} {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                activeStage === s.num
                  ? 'w-2.5 h-2.5 bg-[#B86B27] ring-4 ring-[#B86B27]/15'
                  : 'w-1.5 h-1.5 bg-[#171614]/20 group-hover:bg-[#171614]/60'
              }`}
            />
          </button>
        ))}
      </div>
      {/* ========================================================= */}
      {/* STAGE 1: THE EMPTY VESSEL (GENESIS) (0% - 16%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 py-24 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        {/* Top Classification */}
        <div className="pt-2 flex justify-between items-center font-mono text-[10px] text-[#171614]/40 tracking-[0.25em] uppercase">
          <div>APOTHECARY BESPOKE // EDITION 001</div>
          <div className="hidden sm:block">BOROSILICATE FLINT · 500ML</div>
        </div>

        {/* Bottom Editorial Anchor */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4">
          <div className="max-w-xl">
            <span className="font-mono text-[11px] text-[#B86B27] tracking-[0.22em] uppercase block mb-3">
              A PURE VESSEL · AWAITING YOUR FORMULATION
            </span>
            <h1 className="font-sans font-light text-3xl sm:text-5xl lg:text-[3.25rem] text-[#171614] leading-[1.08] tracking-[-0.03em]">
              Your bespoke elixir,<br />
              <span className="font-serif italic font-normal text-[#171614]">
                crafted from the ground up
              </span>
              .
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#6E6961] mt-4 max-w-md font-light leading-relaxed">
              An empty borosilicate flask engineered for zero-proof alchemy. Scroll downward to pour your botanical base, infuse active nootropics, and laser-engrave your private label.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2.5 font-mono text-[11px]">
            <button
              onClick={() => handleJumpToStage(0.24)}
              className="pointer-events-auto flex items-center space-x-2 text-[#B86B27] hover:text-[#9E571B] transition-all cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse group-hover:scale-125 transition-transform" />
              <span className="underline decoration-[#B86B27]/40 underline-offset-4 tracking-wider">
                BEGIN FORMULATION ↓
              </span>
            </button>
            <div className="text-[#171614]/35 text-[10px] tracking-widest uppercase">
              STATUS: UNFILLED // 0.0% ABV
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 2: BASE DISTILLATE SELECTION & LIVE POUR (16% - 36%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-start transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-md lg:max-w-lg pointer-events-auto">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-[#B86B27] tracking-[0.22em] uppercase mb-2">
            <Droplet size={12} className="text-[#B86B27]" />
            <span>STAGE 02 // BOTANICAL DISTILLATION</span>
          </div>

          <h2 className="font-sans font-light text-2xl sm:text-4xl text-[#171614] tracking-[-0.02em] mb-2">
            Pour Your Distillate<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6E6961] font-light leading-relaxed mb-4">
            Select a cold-vacuum fractional distillate. The liquid stream enters the neck and fills the vessel in real time. Switching options smoothly empties and repours the vessel.
          </p>

          {/* Live Pour Status Feedback */}
          <div className="mb-5 px-3.5 py-2 rounded-full bg-white/80 border border-[#171614]/[0.08] backdrop-blur-sm flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${pourState.isPouring ? 'bg-[#B86B27] animate-ping' : pourState.fillLevel > 0.8 ? 'bg-[#047857]' : 'bg-[#171614]/30'}`} />
              <span className="text-[#171614]/80 text-[11px]">{pourState.statusText}</span>
            </div>
            <span className="text-[#B86B27] text-[11px] tracking-wider">
              {Math.round(pourState.fillLevel * 500)}mL / 500mL
            </span>
          </div>

          {/* Base Selection Swatches */}
          <div className="space-y-3">
            {bases.map((base) => {
              const isSelected = formula.base === base.id;
              return (
                <button
                  key={base.id}
                  onClick={() => handleSelectBase(base.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27]'
                      : 'bg-white/70 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3.5">
                      {/* Botanical Color Pip */}
                      <span
                        className="w-4 h-4 rounded-full mt-0.5 shadow-inner transition-transform group-hover:scale-110 flex-shrink-0"
                        style={{ backgroundColor: base.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-sans font-medium text-sm text-[#171614]">
                            {base.name}
                          </h3>
                          <span className="text-[10px] font-mono text-[#B86B27] px-2 py-0.5 rounded bg-[#B86B27]/10">
                            {base.profile}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#6E6961] mt-1 font-light leading-snug">
                          {base.subtitle}
                        </p>
                        <p className="font-mono text-[10px] text-[#171614]/50 mt-2">
                          {base.notes}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      {isSelected ? (
                        <div className="flex items-center space-x-1 text-[#B86B27] font-mono text-[10px]">
                          <Check size={12} strokeWidth={2.5} />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <span className="text-[#171614]/30 font-mono text-[10px] group-hover:text-[#171614]/60">
                          SELECT
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 3: NOOTROPIC INFUSION & EXPLODED FORMULATION (36% - 56%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-md lg:max-w-lg pointer-events-auto">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-[#B86B27] tracking-[0.22em] uppercase mb-2">
            <Layers size={12} className="text-[#B86B27]" />
            <span>STAGE 03 // ADAPTOGENIC INFUSION</span>
          </div>

          <h2 className="font-sans font-light text-2xl sm:text-4xl text-[#171614] tracking-[-0.02em] mb-2">
            Infuse Neuro-Actives<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6E6961] font-light leading-relaxed mb-5">
            The bottle levitates into an exploded formulation view. Select your bioactive adaptogen stack. Micro-particulates suspend within the botanical matrix.
          </p>

          <div className="space-y-3">
            {nootropics.map((item) => {
              const isSelected = formula.nootropic === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNootropic(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-2 border-[#B86B27]'
                      : 'bg-white/70 hover:bg-white border border-[#171614]/[0.08] hover:border-[#171614]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif italic text-xs text-[#B86B27]">
                          {item.roman}.
                        </span>
                        <h3 className="font-sans font-medium text-sm text-[#171614]">
                          {item.name}
                        </h3>
                      </div>
                      <div className="font-mono text-[11px] text-[#B86B27] mt-1">
                        {item.dose}
                      </div>
                      <p className="font-sans text-xs text-[#6E6961] mt-1.5 font-light leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex-shrink-0 pl-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#B86B27] text-white flex items-center justify-center">
                          <Check size={11} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#171614]/20" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 4: CHILL & SERVE ARCHITECTURE (56% - 74%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-md lg:max-w-lg pointer-events-auto">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-[#B86B27] tracking-[0.22em] uppercase mb-2">
            <Snowflake size={12} className="text-[#B86B27]" />
            <span>STAGE 04 // SERVE ARCHITECTURE</span>
          </div>

          <h2 className="font-sans font-light text-2xl sm:text-4xl text-[#171614] tracking-[-0.02em] mb-2">
            Temperature & Chill<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#6E6961] font-light leading-relaxed mb-5">
            Temperature alters aroma volatilization and surface physics. Choose your drinking ceremony to trigger surface condensation beads or pristine ambient transparency.
          </p>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => handleSelectChill('ice')}
              className={`p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                formula.chill === 'ice'
                  ? 'bg-white shadow-md border-2 border-[#B86B27]'
                  : 'bg-white/70 hover:bg-white border border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#B86B27]/10 text-[#B86B27] flex items-center justify-center mb-3">
                <Snowflake size={14} />
              </div>
              <h3 className="font-sans font-medium text-sm text-[#171614]">
                Glacial Pour
              </h3>
              <div className="font-mono text-[10px] text-[#B86B27] mt-0.5">
                4°C · OVER ARTISANAL ICE
              </div>
              <p className="font-sans text-[11px] text-[#6E6961] mt-2 font-light leading-snug">
                Hand-cut ice block clinks into the flask. Glistening surface condensation beads form on exterior glass.
              </p>
            </button>

            <button
              onClick={() => handleSelectChill('neat')}
              className={`p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                formula.chill === 'neat'
                  ? 'bg-white shadow-md border-2 border-[#B86B27]'
                  : 'bg-white/70 hover:bg-white border border-[#171614]/[0.08]'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#B86B27]/10 text-[#B86B27] flex items-center justify-center mb-3">
                <Flame size={14} />
              </div>
              <h3 className="font-sans font-medium text-sm text-[#171614]">
                Cellar Pour
              </h3>
              <div className="font-mono text-[10px] text-[#B86B27] mt-0.5">
                18°C · UNCUT & NEAT
              </div>
              <p className="font-sans text-[11px] text-[#6E6961] mt-2 font-light leading-snug">
                Pristine optical clarity. Allows volatile fractional terpenes and botanical florals to open without dilution.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 5: BESPOKE LABEL PERSONALIZATION (74% - 88%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-start transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-md lg:max-w-lg pointer-events-auto bg-white/80 p-6 sm:p-7 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-lg">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-[#B86B27] tracking-[0.22em] uppercase mb-2">
            <Award size={12} className="text-[#B86B27]" />
            <span>STAGE 05 // BESPOKE ENGRAVING</span>
          </div>

          <h2 className="font-sans font-light text-2xl sm:text-3xl text-[#171614] tracking-[-0.02em] mb-2">
            Laser-Engrave The 3D Label<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-4">
            Type your private reserve title and initials below. Watch the cylindrical label on the 3D bottle engrave in real time.
          </p>

          <div className="space-y-3.5">
            <div>
              <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1.5">
                Custom Edition Title (Displayed on bottle face)
              </label>
              <input
                type="text"
                maxLength={24}
                value={formula.customName}
                onChange={(e) => scrollStore.setCustomName(e.target.value)}
                placeholder="e.g. ABHAYJEET RESERVE"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-sm text-[#171614] font-medium outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1.5">
                  Monogram Initials
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={formula.engravedInitials}
                  onChange={(e) => scrollStore.setEngravedInitials(e.target.value.toUpperCase())}
                  placeholder="AT"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] focus:ring-1 focus:ring-[#B86B27] text-sm text-[#171614] font-medium font-serif uppercase outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1.5">
                  Medallion Foil
                </label>
                <div className="flex space-x-2 pt-1">
                  {seals.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSeal(s.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        formula.seal === s.id ? 'border-[#B86B27] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: s.hex }}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-[#B86B27] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-pulse" />
              <span>3D TEXTURE EMBOSSED IN REAL TIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAGE 6: DISPATCH VAULT & ADDRESS FORM (88% - 100%) */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeStage === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="max-w-md lg:max-w-lg pointer-events-auto bg-white/85 p-6 sm:p-7 rounded-2xl border border-[#171614]/[0.08] backdrop-blur-md shadow-xl">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-[#B86B27] tracking-[0.22em] uppercase mb-2">
            <ShieldCheck size={12} className="text-[#B86B27]" />
            <span>STAGE 06 // VAULT ALLOCATION</span>
          </div>

          <h2 className="font-sans font-light text-2xl sm:text-3xl text-[#171614] tracking-[-0.02em] mb-1">
            Dispatch Your Batch<span className="text-[#B86B27]">.</span>
          </h2>
          <p className="font-sans text-xs text-[#6E6961] font-light leading-relaxed mb-4">
            Nitrogen-purged packaging, signed laboratory certificate, and direct courier dispatch.
          </p>

          {/* Formulation Assay Receipt */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#171614]/[0.08] mb-4 text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#171614]/50">DISTILLATE:</span>
              <span className="text-[#171614] font-medium uppercase">{formula.base || 'YUZU'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#171614]/50">ADAPTOGEN:</span>
              <span className="text-[#171614] font-medium uppercase">{formula.nootropic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#171614]/50">ENGRAVING:</span>
              <span className="text-[#B86B27] font-medium">{formula.customName} [{formula.engravedInitials}]</span>
            </div>
          </div>

          {order.confirmed ? (
            <div className="p-5 rounded-xl bg-[#047857]/10 border border-[#047857]/30 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-[#047857] text-white flex items-center justify-center mx-auto">
                <Check size={18} />
              </div>
              <h3 className="font-sans font-medium text-base text-[#047857]">
                Allocation Authenticated
              </h3>
              <div className="font-mono text-xs text-[#047857] tracking-widest">
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
              className="space-y-3"
            >
              <div>
                <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Full Name / Allocation Recipient
                </label>
                <input
                  required
                  type="text"
                  value={order.fullName}
                  onChange={(e) => scrollStore.setCustomerOrder({ fullName: e.target.value })}
                  placeholder="Abhayjeet Tomar"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1">
                  Delivery Destination
                </label>
                <input
                  required
                  type="text"
                  value={order.address}
                  onChange={(e) => scrollStore.setCustomerOrder({ address: e.target.value })}
                  placeholder="740 Park Avenue, Residence 4B"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1">
                    City & Postal
                  </label>
                  <input
                    required
                    type="text"
                    value={order.city}
                    onChange={(e) => scrollStore.setCustomerOrder({ city: e.target.value })}
                    placeholder="New York, NY 10021"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#171614]/60 uppercase tracking-widest mb-1">
                    Email Notification
                  </label>
                  <input
                    required
                    type="email"
                    value={order.email}
                    onChange={(e) => scrollStore.setCustomerOrder({ email: e.target.value })}
                    placeholder="atelier@aether.luxury"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#171614]/15 focus:border-[#B86B27] text-xs text-[#171614] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] font-sans text-xs font-medium tracking-tight flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
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
