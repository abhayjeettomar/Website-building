import React, { useState } from 'react';
import { ArrowUpRight, Check, ShieldCheck, Clock, Zap, Sparkles } from 'lucide-react';
import { scrollStore, AllocationTier } from '../store/scrollStore';

export function SensoryMatrixBento() {
  const [selectedTier, setSelectedTier] = useState<AllocationTier>('ritual');

  const tiers: Record<AllocationTier, {
    title: string;
    bottles: string;
    price: number;
    perBottle: string;
    savings: string;
    perks: string[];
    badge?: string;
  }> = {
    single: {
      title: 'THE SINGLE VESSEL',
      bottles: '1 × 500mL Bottle',
      price: 58,
      perBottle: '$58 / unit',
      savings: 'Standard Allocation',
      perks: ['7–8 Nightly Ritual Pours', 'High-Flint Apothecary Vessel', 'Batch N° 04 Certification'],
    },
    ritual: {
      title: 'THE RITUAL CASE',
      bottles: '3 × 500mL Bottles',
      price: 156,
      perBottle: '$52 / unit',
      savings: 'Save 10% on Allocation',
      perks: [
        '21–24 Nightly Ritual Pours',
        'Complimentary CNC Stainless Bar Jigger',
        'Physical Lab Dossier & Tasting Notes',
        'Priority Batch 05 Reservation Window'
      ],
      badge: 'MOST ALLOCATED',
    },
    vault: {
      title: 'THE FOUNDERS\' VAULT',
      bottles: '6 × 500mL Bottles',
      price: 290,
      perBottle: '$48 / unit',
      savings: 'Save 17% on Allocation',
      perks: [
        'Full Seasonal Reserve Supply',
        'Two Hand-Blown Borosilicate Tumblers',
        'Direct Access to AETHER Lab Head Distiller',
        'VIP Guaranteed Batch 05 Allocation'
      ],
      badge: 'EXCLUSIVE VAULT',
    },
  };

  const handleSelectTier = (tier: AllocationTier) => {
    setSelectedTier(tier);
    scrollStore.setSelectedTier(tier);
  };

  const handleOpenDrawer = () => {
    scrollStore.setSelectedTier(selectedTier);
    scrollStore.setDrawerOpen(true);
  };

  return (
    <section className="relative z-30 pt-20 pb-32 px-6 sm:px-12 max-w-[1440px] mx-auto text-[#F5F5F7]">
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#F4B860] uppercase tracking-[0.22em] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4B860]" />
          <span>05 // SENSORY ARCHITECTURE & CLINICAL ASSAY</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-[#F5F5F7]">
          Bio-Active Precision<span className="text-[#F4B860]">.</span> Zero Compromise<span className="text-[#D97724]">.</span>
        </h2>
        <p className="font-sans text-[#8E9099] max-w-2xl mt-4 font-light text-base sm:text-lg">
          Analyzed at molecular resolution. Every batch undergoes fractional gas chromatography to guarantee zero synthetic adulterants, 0.0% ethanol, and maximum nootropic bioavailability.
        </p>
      </div>

      {/* Swiss Hairline 1px Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.09] border border-white/[0.09] rounded-2xl overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Cell 1: Bio-Kinetics Onset Waveform */}
        <div className="p-8 sm:p-10 bg-[#07080B]/90 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-xs text-[#8E9099] mb-4">
              <span className="text-[#F4B860] tracking-wider">[ ASSAY 01 // BIO-KINETIC CURVE ]</span>
              <span>PHARMACOKINETICS</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F5F5F7]">
              Onset & Cognitive Flow Curve
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#8E9099] font-light mt-2 leading-relaxed">
              Rapid sublingual absorption of volatile yuzu terpenes followed by dual-phase gut absorption of Lion's Mane hericenones.
            </p>
          </div>

          {/* SVG Waveform Graphic */}
          <div className="my-8 relative h-36 border border-white/[0.06] bg-black/40 rounded-xl p-4 flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97724" stopOpacity="0.2" />
                  <stop offset="35%" stopColor="#F4B860" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#F4B860" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#D97724" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4B860" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#F4B860" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path
                d="M 0,100 C 40,95 70,25 140,20 C 220,15 280,45 400,95 L 400,100 Z"
                fill="url(#areaGradient)"
              />

              {/* Main Curve */}
              <path
                d="M 0,100 C 40,95 70,25 140,20 C 220,15 280,45 400,95"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="2.5"
              />

              {/* Peak Marker Dot */}
              <circle cx="140" cy="20" r="4" fill="#F4B860" />
              <circle cx="140" cy="20" r="8" stroke="#F4B860" strokeWidth="1" fill="none" opacity="0.4" />
            </svg>

            {/* Time Indicators */}
            <div className="flex justify-between font-mono text-[10px] text-[#686A73] mt-2 border-t border-white/[0.06] pt-1">
              <span>0 MIN (POUR)</span>
              <span className="text-[#D97724]">+12 MIN (ALPHA CALM)</span>
              <span className="text-[#F4B860]">+45 MIN (FLOW PEAK)</span>
              <span>+3.5 HRS (CLEAN DISSIPATION)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="text-[#F4B860] font-bold text-sm">+12 MIN</div>
              <div className="text-[10px] text-[#8E9099] mt-0.5">Initial Serenity</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="text-[#F5F5F7] font-bold text-sm">+45 MIN</div>
              <div className="text-[10px] text-[#8E9099] mt-0.5">Peak Cognition</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <div className="text-[#9CE0FF] font-bold text-sm">0.0%</div>
              <div className="text-[10px] text-[#8E9099] mt-0.5">Next-Day Crash</div>
            </div>
          </div>
        </div>

        {/* Cell 2: Olfactory & Palate Pyramid */}
        <div className="p-8 sm:p-10 bg-[#07080B]/90 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-xs text-[#8E9099] mb-4">
              <span className="text-[#F4B860] tracking-wider">[ ASSAY 02 // VOLATILE PYRAMID ]</span>
              <span>ORGANOLEPTIC MATRIX</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F5F5F7]">
              Olfactory & Palate Architecture
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#8E9099] font-light mt-2 leading-relaxed">
              Precision fractions extracted at sub-zero vacuum temperatures to protect volatile monoterpenes and citrus aldehydes.
            </p>
          </div>

          {/* Structured Pyramid Bars */}
          <div className="my-6 space-y-4 font-mono text-xs">
            {/* Top Notes */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#F5F5F7]">TOP // CHARRED YUZU & MOUNTAIN BERGAMOT</span>
                <span className="text-[#F4B860]">92% INTENSITY</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D97724] to-[#F4B860] w-[92%] rounded-full" />
              </div>
              <p className="text-[11px] text-[#8E9099] mt-1 font-sans">
                Electrified citrus peel oils, sparkling lime blossoms, and crisp alpine air.
              </p>
            </div>

            {/* Heart Notes */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#F5F5F7]">HEART // HIMALAYAN SCHISANDRA & WILD DAMIANA</span>
                <span className="text-[#F4B860]">84% INTENSITY</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D97724] to-[#F4B860] w-[84%] rounded-full" />
              </div>
              <p className="text-[11px] text-[#8E9099] mt-1 font-sans">
                Adaptogenic tart berry notes, peppery herbs, and calming floral nuances.
              </p>
            </div>

            {/* Base Notes */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#F5F5F7]">BASE // SMOKED HINOKI, GENTIAN & SICHUAN PEPPER</span>
                <span className="text-[#F4B860]">88% INTENSITY</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D97724] to-[#F4B860] w-[88%] rounded-full" />
              </div>
              <p className="text-[11px] text-[#8E9099] mt-1 font-sans">
                Resinous Japanese cedar, bitter root bite, and vibrating tingling finish.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg font-mono text-[11px] text-[#8E9099] flex justify-between items-center">
            <span>BITTER-TO-SWEET INDEX: 8.2 / 10.0</span>
            <span className="text-[#F4B860]">DRY APERITIF PROFILE</span>
          </div>
        </div>

        {/* Cell 3: Clinical Assay Table */}
        <div className="p-8 sm:p-10 bg-[#07080B]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between font-mono text-xs text-[#8E9099] mb-4">
            <span className="text-[#F4B860] tracking-wider">[ ASSAY 03 // NUTRITIONAL SPECS ]</span>
            <span>CLINICAL PANEL</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-[#F5F5F7] mb-4">
            Chemical Purity & Alkaloid Assay
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">ALCOHOL BY VOLUME (ABV)</span>
              <span className="text-[#F4B860] font-bold">0.0% CERTIFIED</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">LION'S MANE (HERICIUM ERINACEUS)</span>
              <span className="text-[#F5F5F7]">500 MG / 75ML SERVING</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">L-THEANINE ENANTIOMER</span>
              <span className="text-[#F5F5F7]">200 MG / 75ML SERVING</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">CALORIC DENSITY</span>
              <span className="text-[#F5F5F7]">14 KCAL (NATURAL CITRUS)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">ADDED SUGARS & PRESERVATIVES</span>
              <span className="text-[#9CE0FF] font-bold">0.0G (ZERO ARTIFICIAL)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#8E9099]">DIETARY CERTIFICATION</span>
              <span className="text-[#F5F5F7]">VEGAN · GLUTEN-FREE · NON-GMO</span>
            </div>
          </div>
        </div>

        {/* Cell 4: Provenance & Distillation */}
        <div className="p-8 sm:p-10 bg-[#07080B]/90 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-xs text-[#8E9099] mb-4">
              <span className="text-[#F4B860] tracking-wider">[ ASSAY 04 // DISTILLATION RIG ]</span>
              <span>ROTARY VACUUM</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F5F5F7] mb-2">
              Cold-Vacuum Fractional Distillation
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#8E9099] font-light leading-relaxed mb-6">
              Conventional distillation boils at 100°C, scorching fragile citrus monoterpenes. AETHER operates under negative pressure (-0.08 bar) where botanicals vaporize gently at 38°C.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="text-[10px] text-[#8E9099]">OPERATING TEMP</div>
              <div className="text-xl font-bold text-[#F4B860] mt-1">38°C</div>
              <div className="text-[10px] text-[#686A73] mt-1">Prevents terpene oxidation</div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="text-[10px] text-[#8E9099]">HEADSPACE INERT BLANKET</div>
              <div className="text-xl font-bold text-[#9CE0FF] mt-1">99.9% N₂</div>
              <div className="text-[10px] text-[#686A73] mt-1">Zero dissolved oxygen</div>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-[11px] font-mono text-[#686A73]">
            <ShieldCheck size={14} className="text-[#F4B860]" />
            <span>ISO 9001 BIO-PHARMACEUTICAL PURITY CERTIFICATION</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ALLOCATION PACK SELECTOR */}
      {/* ========================================================= */}
      <div className="mt-16 bg-[#07080B]/90 backdrop-blur-xl border border-white/[0.09] rounded-2xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="font-mono text-xs text-[#F4B860] uppercase tracking-[0.2em] mb-2">
              BATCH N° 04 ALLOCATION // SPRING 2026
            </div>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F5F7]">
              Reserve Your Production Allocation
            </h3>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-[#8E9099] flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>BATCH 04 CAPACITY: 88.4% RESERVED</span>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {(Object.keys(tiers) as AllocationTier[]).map((tierKey) => {
            const tier = tiers[tierKey];
            const isSelected = selectedTier === tierKey;

            return (
              <div
                key={tierKey}
                onClick={() => handleSelectTier(tierKey)}
                className={`relative p-6 sm:p-8 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#F4B860] bg-[#F4B860]/[0.06] shadow-[0_0_30px_rgba(244,184,96,0.18)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.16]'
                }`}
              >
                {/* Badge if present */}
                {tier.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#F4B860] text-[#050506] font-mono text-[10px] font-bold tracking-widest uppercase">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-[#8E9099] uppercase tracking-wider">{tier.title}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#F4B860] bg-[#F4B860]' : 'border-white/[0.2]'
                    }`}>
                      {isSelected && <Check size={12} className="text-[#050506] stroke-[3]" />}
                    </div>
                  </div>

                  <div className="font-display font-bold text-xl text-[#F5F5F7] mb-1">{tier.bottles}</div>
                  <div className="font-mono text-xs text-[#D97724] font-semibold">{tier.savings}</div>

                  <div className="mt-6 mb-6">
                    <span className="font-display font-extrabold text-4xl text-[#F5F5F7]">${tier.price}</span>
                    <span className="font-mono text-xs text-[#8E9099] ml-2">/ {tier.perBottle}</span>
                  </div>

                  <ul className="space-y-2.5 font-sans text-xs text-[#8E9099] border-t border-white/[0.06] pt-4">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check size={13} className="text-[#F4B860] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Magnetic CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl border border-white/[0.08] bg-black/60">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full border border-[#F4B860]/30 bg-[#F4B860]/10 flex items-center justify-center">
              <Sparkles size={20} className="text-[#F4B860]" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-[#F5F5F7]">
                Selected: {tiers[selectedTier].title} (${tiers[selectedTier].price})
              </div>
              <div className="font-mono text-xs text-[#8E9099]">
                Estimated Delivery: May 2026 · Complimentary Insured Cold Shipping
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenDrawer}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F5F5F7] hover:bg-[#F4B860] text-[#050506] font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(245,245,247,0.2)] hover:shadow-[0_0_35px_rgba(244,184,96,0.5)]"
          >
            <span>RESERVE ALLOCATION — ${tiers[selectedTier].price}</span>
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

