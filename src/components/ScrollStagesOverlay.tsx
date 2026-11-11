import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Snowflake, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Send,
  Droplet,
  Layers,
  Tag
} from 'lucide-react';
import { 
  scrollStore, 
  BaseDistillate, 
  NootropicStack, 
  ChillMode, 
  SealColor 
} from '../store/scrollStore';

export function ScrollStagesOverlay() {
  const [progress, setProgress] = useState(0);
  const [formula, setFormula] = useState(scrollStore.formula);
  const [order, setOrder] = useState(scrollStore.order);

  useEffect(() => {
    let animId: number;
    const update = () => {
      setProgress(scrollStore.progress);
      setFormula({ ...scrollStore.formula });
      setOrder({ ...scrollStore.order });
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute opacities & vertical parallax for the 6 stages across 0% to 100%
  // Stage 1 (Empty Vessel): 0.0 - 0.16
  const s1Opacity = Math.max(0, Math.min(1, 1 - (progress / 0.14)));

  // Stage 2 (Base Distillate): 0.16 - 0.36
  let s2Opacity = 0;
  if (progress >= 0.16 && progress <= 0.36) {
    if (progress < 0.21) s2Opacity = (progress - 0.16) / 0.05;
    else if (progress > 0.31) s2Opacity = 1 - (progress - 0.31) / 0.05;
    else s2Opacity = 1;
  }

  // Stage 3 (Nootropic Infusion): 0.36 - 0.56
  let s3Opacity = 0;
  if (progress >= 0.36 && progress <= 0.56) {
    if (progress < 0.41) s3Opacity = (progress - 0.36) / 0.05;
    else if (progress > 0.51) s3Opacity = 1 - (progress - 0.51) / 0.05;
    else s3Opacity = 1;
  }

  // Stage 4 (Chill Architecture): 0.56 - 0.74
  let s4Opacity = 0;
  if (progress >= 0.56 && progress <= 0.74) {
    if (progress < 0.61) s4Opacity = (progress - 0.56) / 0.05;
    else if (progress > 0.69) s4Opacity = 1 - (progress - 0.69) / 0.05;
    else s4Opacity = 1;
  }

  // Stage 5 (Label Personalization): 0.74 - 0.88
  let s5Opacity = 0;
  if (progress >= 0.74 && progress <= 0.88) {
    if (progress < 0.78) s5Opacity = (progress - 0.74) / 0.04;
    else if (progress > 0.84) s5Opacity = 1 - (progress - 0.84) / 0.04;
    else s5Opacity = 1;
  }

  // Stage 6 (Dispatch Vault & Address): 0.88 - 1.00
  let s6Opacity = 0;
  if (progress >= 0.88) {
    s6Opacity = Math.min(1, (progress - 0.88) / 0.04);
  }

  const bases: { id: BaseDistillate; name: string; subtitle: string; color: string; notes: string }[] = [
    {
      id: 'yuzu',
      name: 'Charred Yuzu & Bergamot',
      subtitle: 'Cold-pressed Japanese mountain citrus & wild bergamot',
      color: '#E59535',
      notes: 'Bright golden amber · Vibrating citrus finish',
    },
    {
      id: 'blood_orange',
      name: 'Smoked Blood Orange & Fig',
      subtitle: 'Torched Sicilian citrus, black mission fig & gentian root',
      color: '#B82A2A',
      notes: 'Deep smoked ruby · Bitter-sweet aperitif body',
    },
    {
      id: 'juniper',
      name: 'Wild Juniper & Alpine Pine',
      subtitle: 'Sub-zero vapor-distilled alpine needles & cracked juniper',
      color: '#2E7D52',
      notes: 'Luminous emerald · Resinous botanical clarity',
    },
  ];

  const nootropics: { id: NootropicStack; name: string; dose: string; desc: string }[] = [
    {
      id: 'alpha',
      name: 'Alpha-Wave Serenity',
      dose: '500mg Hericium + 200mg Theanine',
      desc: 'Sustained cognitive focus, calm alpha-wave velocity without jitter or crash.',
    },
    {
      id: 'social',
      name: 'Deep Social Euphoria',
      dose: '350mg Damiana + Schisandra',
      desc: 'Adaptogenic mood lift, sensory expansion, and peppery aromatic tannins.',
    },
    {
      id: 'euphoria',
      name: 'Nocturnal Restoration',
      dose: '300mg KSM-66 + Magnesium L-Threonate',
      desc: 'Deep cellular relaxation, nervous system down-regulation, zero morning haze.',
    },
  ];

  const seals: { id: SealColor; name: string; hex: string }[] = [
    { id: 'gold', name: 'Champagne Gold Foil', hex: '#D4AF37' },
    { id: 'noir', name: 'Obsidian Gunmetal', hex: '#222222' },
    { id: 'copper', name: 'Rose Copper Foil', hex: '#C85A32' },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden select-none text-[#F5F3EC]">
      {/* ========================================================= */}
      {/* STAGE 1: THE EMPTY VESSEL (GENESIS) (0% - 16%) */}
      {/* ========================================================= */}
      {s1Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 py-24 flex flex-col justify-between transition-opacity duration-200"
          style={{ opacity: s1Opacity }}
        >
          {/* Top Classification */}
          <div className="pt-2 flex justify-between items-center font-mono text-[10px] text-white/40 tracking-[0.25em] uppercase">
            <div>APOTHECARY BESPOKE // NO° 01</div>
            <div className="hidden sm:block">OPTICAL FLINT BOROSILICATE · 500ML</div>
          </div>

          {/* Bottom Editorial Anchor */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4">
            <div className="max-w-xl">
              <span className="font-mono text-[11px] text-[#E5A958] tracking-[0.24em] uppercase block mb-3">
                AN EMPTY VESSEL · READY FOR ALCHEMY
              </span>
              <h1 className="font-sans font-light text-3xl sm:text-5xl lg:text-[3.25rem] text-[#FAF7F2] leading-[1.08] tracking-[-0.03em]">
                Your bespoke elixir,<br />
                <span className="font-serif italic font-normal text-white">
                  crafted from the ground up
                </span>
                .
              </h1>
              <p className="font-sans text-xs sm:text-sm text-white/55 mt-4 max-w-md font-light leading-relaxed">
                Scroll to pour your botanical base, infuse active nootropics, and engrave your custom bottle label.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center space-x-2 text-[#E5A958]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958] animate-pulse" />
                <span>SCROLL DOWN TO COMMENCE FORMULATION</span>
              </div>
              <div className="text-white/30 text-[10px] tracking-widest uppercase">
                STATUS: UNFILLED // 0.0% ABV
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: BASE DISTILLATE SELECTION (16% - 36%) */}
      {/* ========================================================= */}
      {s2Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-start transition-opacity duration-200"
          style={{ opacity: s2Opacity }}
        >
          <div className="max-w-md lg:max-w-lg pointer-events-auto">
            <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              <Droplet size={12} className="text-[#E5A958]" />
              <span>STEP 01 // SELECT BOTANICAL DISTILLATE</span>
            </div>

            <h2 className="font-sans font-light text-2xl sm:text-4xl text-white tracking-[-0.02em] mb-3">
              Infuse Your Base<span className="text-[#E5A958]">.</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/55 font-light leading-relaxed mb-6">
              Watch the vessel fill. Select your primary fractional terpene distillate to change the liquid's color, aroma, and refractive depth in real-time.
            </p>

            {/* Base Options */}
            <div className="space-y-3">
              {bases.map((b) => {
                const isSelected = formula.base === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => scrollStore.setBase(b.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between ${
                      isSelected
                        ? 'border-[#E5A958] bg-[#E5A958]/[0.08] shadow-[0_0_20px_rgba(229,169,88,0.15)]'
                        : 'border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                        <span className="font-sans font-medium text-sm text-white">{b.name}</span>
                      </div>
                      <p className="font-sans text-xs text-white/50 mt-1 font-light">{b.subtitle}</p>
                      <span className="inline-block mt-2 font-mono text-[10px] text-[#E5A958]/90">
                        {b.notes}
                      </span>
                    </div>

                    <div className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#E5A958] bg-[#E5A958]' : 'border-white/20'
                    }`}>
                      {isSelected && <Check size={10} className="text-[#050506] stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: NOOTROPIC INFUSION (EXPLODED VIEW) (36% - 56%) */}
      {/* ========================================================= */}
      {s3Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-start transition-opacity duration-200"
          style={{ opacity: s3Opacity }}
        >
          <div className="max-w-md lg:max-w-lg pointer-events-auto">
            <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              <Layers size={12} className="text-[#E5A958]" />
              <span>STEP 02 // ACTIVE NOOTROPIC MATRIX</span>
            </div>

            <h2 className="font-sans font-light text-2xl sm:text-4xl text-white tracking-[-0.02em] mb-3">
              Calibrate Neuro-Chemistry<span className="text-[#E5A958]">.</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/55 font-light leading-relaxed mb-6">
              The cap unseals as micro-nutrients disperse. Choose your functional adaptogenic stack to dictate the physiological response.
            </p>

            {/* Nootropic Options */}
            <div className="space-y-3">
              {nootropics.map((n) => {
                const isSelected = formula.nootropic === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => scrollStore.setNootropic(n.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between ${
                      isSelected
                        ? 'border-[#E5A958] bg-[#E5A958]/[0.08] shadow-[0_0_20px_rgba(229,169,88,0.15)]'
                        : 'border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-medium text-sm text-white">{n.name}</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#E5A958] mt-0.5">{n.dose}</div>
                      <p className="font-sans text-xs text-white/50 mt-1.5 font-light leading-relaxed">
                        {n.desc}
                      </p>
                    </div>

                    <div className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-[#E5A958] bg-[#E5A958]' : 'border-white/20'
                    }`}>
                      {isSelected && <Check size={10} className="text-[#050506] stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: CHILL & SERVE ARCHITECTURE (56% - 74%) */}
      {/* ========================================================= */}
      {s4Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-opacity duration-200"
          style={{ opacity: s4Opacity }}
        >
          <div className="w-full max-w-sm pointer-events-auto">
            <div className="font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              STEP 03 // CHILL & SERVE ARCHITECTURE
            </div>
            <h2 className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Set The Atmosphere<span className="text-[#E5A958]">.</span>
            </h2>
            <p className="font-sans text-xs text-white/55 font-light leading-relaxed mb-6">
              Switch thermodynamic environments. The 3D scene responds with calibrated light spectra, condensation, and floating ice crystals.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => scrollStore.setChill('ice')}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
                  formula.chill === 'ice'
                    ? 'border-[#9CE0FF] bg-[#9CE0FF]/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.015] text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Snowflake size={16} className={formula.chill === 'ice' ? 'text-[#9CE0FF]' : 'text-white/30'} />
                  <div>
                    <div className="font-sans font-medium text-xs">Over Hand-Cut Crystal Ice (2°C)</div>
                    <div className="font-mono text-[10px] text-white/40 mt-0.5">High effervescence · Surface condensation</div>
                  </div>
                </div>
                {formula.chill === 'ice' && <Check size={13} className="text-[#9CE0FF]" />}
              </button>

              <button
                onClick={() => scrollStore.setChill('neat')}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
                  formula.chill === 'neat'
                    ? 'border-[#E5A958] bg-[#E5A958]/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.015] text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Flame size={16} className={formula.chill === 'neat' ? 'text-[#E5A958]' : 'text-white/30'} />
                  <div>
                    <div className="font-sans font-medium text-xs">Neat Cellar Pour (12°C)</div>
                    <div className="font-mono text-[10px] text-white/40 mt-0.5">Velvety mouthfeel · Warm amber reflections</div>
                  </div>
                </div>
                {formula.chill === 'neat' && <Check size={13} className="text-[#E5A958]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 5: BESPOKE LABEL PERSONALIZATION (74% - 88%) */}
      {/* ========================================================= */}
      {s5Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: s5Opacity }}
        >
          <div className="w-full max-w-xl p-8 rounded-2xl border border-white/[0.09] bg-[#07080B]/90 backdrop-blur-xl pointer-events-auto shadow-2xl">
            <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              <Tag size={12} className="text-[#E5A958]" />
              <span>STEP 04 // BESPOKE ENGRAVING & FINISH</span>
            </div>

            <h2 className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Name Your Formulation<span className="text-[#E5A958]">.</span>
            </h2>
            <p className="font-sans text-xs text-white/55 font-light leading-relaxed mb-6">
              Type your custom bottle title and initials below. Watch the 3D bottle label physically engrave your text in real time!
            </p>

            <div className="space-y-4">
              {/* Custom Blend Title */}
              <div>
                <label className="block font-mono text-[10px] text-white/45 uppercase tracking-wider mb-1.5">
                  CUSTOM BOTTLE TITLE (RENDERS LIVE ON 3D VESSEL)
                </label>
                <input
                  type="text"
                  maxLength={22}
                  value={formula.customName}
                  onChange={(e) => scrollStore.setCustomName(e.target.value)}
                  placeholder="e.g. AETHER // ESTATE"
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.1] bg-black/50 text-white font-mono text-sm focus:outline-none focus:border-[#E5A958] transition-colors"
                />
              </div>

              {/* Initials & Seal Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-white/45 uppercase tracking-wider mb-1.5">
                    MONOGRAM INITIALS (2-3 CHARS)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formula.engravedInitials}
                    onChange={(e) => scrollStore.setEngravedInitials(e.target.value.toUpperCase())}
                    placeholder="AT"
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.1] bg-black/50 text-white font-mono text-sm uppercase tracking-widest focus:outline-none focus:border-[#E5A958] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-white/45 uppercase tracking-wider mb-1.5">
                    SEAL METALLIC FOIL
                  </label>
                  <div className="flex space-x-2">
                    {seals.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => scrollStore.setSeal(s.id)}
                        className={`flex-1 py-3 px-2 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                          formula.seal === s.id
                            ? 'border-[#E5A958] bg-[#E5A958]/10 text-white font-medium'
                            : 'border-white/[0.08] bg-white/[0.02] text-white/50 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.hex }} />
                        <span>{s.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px] text-white/40">
              <span>LIVE WEBGL TEXTURE RE-RENDER ACTIVE</span>
              <span className="text-[#E5A958]">SCROLL TO FINALIZE & ORDER ↓</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 6: DISPATCH VAULT & DIRECT ADDRESS FORM (88% - 100%) */}
      {/* ========================================================= */}
      {s6Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-opacity duration-200"
          style={{ opacity: s6Opacity }}
        >
          <div className="w-full max-w-lg p-8 rounded-2xl border border-white/[0.1] bg-[#07080B]/95 backdrop-blur-2xl pointer-events-auto shadow-2xl">
            {!order.confirmed ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase">
                      FINAL STEP // DISPATCH VAULT
                    </span>
                    <h2 className="font-sans font-light text-2xl text-white mt-0.5">
                      Reserve & Ship Formulation
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-sans font-light text-2xl text-white">$64</span>
                    <div className="font-mono text-[10px] text-[#E5A958]">FREE COLD SHIPPING</div>
                  </div>
                </div>

                {/* Formulation Summary Pill */}
                <div className="p-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] mb-5 font-mono text-[11px] space-y-1">
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">CUSTOM TITLE:</span>
                    <span className="text-[#E5A958] font-medium">{formula.customName || 'AETHER BESPOKE'}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">BOTANICAL BASE:</span>
                    <span className="capitalize">{formula.base.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">ADAPTOGEN:</span>
                    <span className="capitalize">{formula.nootropic} Stack</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">MEDALLION SEAL:</span>
                    <span className="capitalize">{formula.seal} ({formula.engravedInitials})</span>
                  </div>
                </div>

                {/* Delivery Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    scrollStore.confirmOrder();
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={order.fullName}
                      onChange={(e) => scrollStore.setCustomerOrder({ fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-white/[0.1] bg-black/50 text-white font-sans text-xs focus:outline-none focus:border-[#E5A958] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={order.email}
                      onChange={(e) => scrollStore.setCustomerOrder({ email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-white/[0.1] bg-black/50 text-white font-sans text-xs focus:outline-none focus:border-[#E5A958] transition-colors"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City / Country"
                      value={order.city}
                      onChange={(e) => scrollStore.setCustomerOrder({ city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-white/[0.1] bg-black/50 text-white font-sans text-xs focus:outline-none focus:border-[#E5A958] transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Delivery Street Address"
                      value={order.address}
                      onChange={(e) => scrollStore.setCustomerOrder({ address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-white/[0.1] bg-black/50 text-white font-sans text-xs focus:outline-none focus:border-[#E5A958] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-full bg-white hover:bg-[#E5A958] text-[#050506] font-mono font-medium text-xs uppercase tracking-[0.18em] transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>CONFIRM & DISPATCH BESPOKE BATCH — $64</span>
                    <ArrowRight size={13} strokeWidth={2} />
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck size={12} className="text-[#E5A958]" />
                    <span>NITROGEN SEALED ON DISPATCH</span>
                  </div>
                  <span>SHIPS WITHIN 48 HOURS</span>
                </div>
              </>
            ) : (
              /* Order Confirmation Screen */
              <div className="text-center py-6 space-y-5">
                <div className="w-14 h-14 rounded-full border border-[#E5A958] bg-[#E5A958]/10 mx-auto flex items-center justify-center">
                  <Sparkles size={24} className="text-[#E5A958]" />
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#E5A958] uppercase tracking-widest">
                    DISPATCH AUTHENTICATED
                  </span>
                  <h3 className="font-sans font-light text-2xl text-white mt-1">
                    Your Formulation is Queued
                  </h3>
                  <p className="font-sans text-xs text-white/50 mt-1.5 font-light leading-relaxed max-w-sm mx-auto">
                    A dedicated 500mL heavy-flint vessel has been engraved with "{formula.customName}" and assigned serial authentication:
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E5A958]/30 bg-[#E5A958]/[0.04] font-mono">
                  <div className="text-[10px] text-white/40 uppercase">OFFICIAL BATCH SERIAL</div>
                  <div className="text-base font-medium text-[#E5A958] tracking-widest mt-0.5">
                    {order.serialNumber}
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">
                    DESTINATION: {order.address || 'ZURICH CELLAR'} ({order.city})
                  </div>
                </div>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-2.5 rounded-full border border-white/[0.1] hover:border-white/25 font-mono text-xs text-white/70 hover:text-white transition-colors"
                >
                  START NEW FORMULATION ↑
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
