import React, { useState } from 'react';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
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
      perks: ['7–8 Nightly Ritual Pours', 'Heavy-Flint Apothecary Vessel', 'Batch N° 04 Certification'],
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
        'Priority Batch 05 Allocation Window'
      ],
      badge: 'RECOMMENDED',
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
        'Direct Access to AETHER Head Distiller',
        'Guaranteed Batch 05 Priority Allocation'
      ],
      badge: 'LIMITED VAULT',
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
    <section className="relative z-30 pt-24 pb-32 px-6 sm:px-12 lg:px-16 max-w-[1440px] mx-auto text-[#F5F5F7]">
      {/* Section Header */}
      <div className="mb-16">
        <div className="font-mono text-[11px] text-[#E5A958] tracking-[0.24em] uppercase mb-3">
          05 / 05 · ALLOCATION ARCHITECTURE
        </div>
        <h2 className="font-sans font-light text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] leading-tight text-white">
          Bio-active precision.<br />
          <span className="font-serif italic font-normal text-white/90">
            Zero ethanol. Zero compromise.
          </span>
        </h2>
        <p className="font-sans text-white/50 max-w-xl mt-4 font-light text-sm sm:text-base leading-relaxed">
          Every batch undergoes fractional gas chromatography to guarantee zero synthetic adulterants, 0.0% ABV, and maximum adaptogenic bioavailability.
        </p>
      </div>

      {/* Swiss Hairline 1px Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden mb-16">
        {/* Cell 1: Bio-Kinetics Waveform */}
        <div className="p-8 sm:p-10 bg-[#07080B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-3">
              <span className="text-[#E5A958] tracking-widest">[ ASSAY 01 // KINETICS ]</span>
              <span>PHARMACOKINETICS</span>
            </div>
            <h3 className="font-sans font-medium text-xl sm:text-2xl text-white">
              Onset & Cognitive Flow Curve
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/50 font-light mt-1.5 leading-relaxed">
              Rapid sublingual absorption of volatile yuzu terpenes followed by dual-phase gut uptake of Lion's Mane hericenones.
            </p>
          </div>

          {/* Minimalist SVG Waveform */}
          <div className="my-8 relative h-32 border border-white/[0.06] bg-black/40 rounded-lg p-4 flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cleanCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
                  <stop offset="35%" stopColor="#E5A958" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#E5A958" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Grid hairlines */}
              <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

              {/* Main Curve */}
              <path
                d="M 0,100 C 40,95 70,25 140,20 C 220,15 280,45 400,95"
                fill="none"
                stroke="url(#cleanCurveGrad)"
                strokeWidth="1.75"
              />

              {/* Peak Marker Dot */}
              <circle cx="140" cy="20" r="3.5" fill="#E5A958" />
            </svg>

            {/* Time Indicators */}
            <div className="flex justify-between font-mono text-[10px] text-white/30 mt-2 border-t border-white/[0.06] pt-1">
              <span>0 MIN</span>
              <span className="text-[#E5A958]">+12 MIN (ALPHA CALM)</span>
              <span className="text-white/80">+45 MIN (FLOW PEAK)</span>
              <span>+3.5 HRS</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
              <div className="text-[#E5A958] font-medium text-sm">+12 MIN</div>
              <div className="text-[10px] text-white/40 mt-0.5">Initial Calm</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
              <div className="text-white font-medium text-sm">+45 MIN</div>
              <div className="text-[10px] text-white/40 mt-0.5">Peak Focus</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
              <div className="text-white font-medium text-sm">0.0%</div>
              <div className="text-[10px] text-white/40 mt-0.5">Crash Load</div>
            </div>
          </div>
        </div>

        {/* Cell 2: Olfactory Pyramid */}
        <div className="p-8 sm:p-10 bg-[#07080B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-3">
              <span className="text-[#E5A958] tracking-widest">[ ASSAY 02 // VOLATILES ]</span>
              <span>ORGANOLEPTIC MATRIX</span>
            </div>
            <h3 className="font-sans font-medium text-xl sm:text-2xl text-white">
              Olfactory & Palate Architecture
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/50 font-light mt-1.5 leading-relaxed">
              Precision fractions extracted at sub-zero vacuum temperatures to protect volatile monoterpenes.
            </p>
          </div>

          {/* Clean Hairline Pyramid */}
          <div className="my-6 space-y-4 font-mono text-xs">
            {/* Top */}
            <div>
              <div className="flex justify-between mb-1.5 text-[11px]">
                <span className="text-white">TOP // CHARRED YUZU & BERGAMOT</span>
                <span className="text-[#E5A958]">92%</span>
              </div>
              <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-[#E5A958] w-[92%]" />
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans font-light">
                Electrified citrus oils, sparkling lime blossoms, alpine air.
              </p>
            </div>

            {/* Heart */}
            <div>
              <div className="flex justify-between mb-1.5 text-[11px]">
                <span className="text-white">HEART // HIMALAYAN SCHISANDRA & DAMIANA</span>
                <span className="text-[#E5A958]">84%</span>
              </div>
              <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-white/70 w-[84%]" />
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans font-light">
                Adaptogenic tart berry notes, peppery botanical tannins.
              </p>
            </div>

            {/* Base */}
            <div>
              <div className="flex justify-between mb-1.5 text-[11px]">
                <span className="text-white">BASE // SMOKED HINOKI & SICHUAN PEPPER</span>
                <span className="text-[#E5A958]">88%</span>
              </div>
              <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-white/50 w-[88%]" />
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans font-light">
                Resinous cedarwood, bitter root bite, vibrating finish.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded font-mono text-[10px] text-white/50 flex justify-between items-center">
            <span>BITTER-TO-SWEET INDEX: 8.2 / 10.0</span>
            <span className="text-[#E5A958]">DRY APERITIF PROFILE</span>
          </div>
        </div>

        {/* Cell 3: Clinical Assay Table */}
        <div className="p-8 sm:p-10 bg-[#07080B]">
          <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-3">
            <span className="text-[#E5A958] tracking-widest">[ ASSAY 03 // CHEMICAL PURITY ]</span>
            <span>CLINICAL PANEL</span>
          </div>
          <h3 className="font-sans font-medium text-xl sm:text-2xl text-white mb-4">
            Alkaloid Concentration Assay
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">ALCOHOL BY VOLUME (ABV)</span>
              <span className="text-white font-medium">0.0% CERTIFIED</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">LION'S MANE (HERICIUM ERINACEUS)</span>
              <span className="text-[#E5A958]">500 MG / SERVING</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">L-THEANINE ENANTIOMER</span>
              <span className="text-white">200 MG / SERVING</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">CALORIC DENSITY</span>
              <span className="text-white">14 KCAL</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-white/45">ADDED SUGAR / PRESERVATIVES</span>
              <span className="text-white">0.0 G</span>
            </div>
          </div>
        </div>

        {/* Cell 4: Distillation Metrics */}
        <div className="p-8 sm:p-10 bg-[#07080B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-3">
              <span className="text-[#E5A958] tracking-widest">[ ASSAY 04 // DISTILLATION ]</span>
              <span>ROTARY VACUUM</span>
            </div>
            <h3 className="font-sans font-medium text-xl sm:text-2xl text-white mb-1.5">
              Fractional Vacuum System
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/50 font-light leading-relaxed mb-6">
              Conventional distillation boils at 100°C, scorching delicate citrus terpenes. AETHER operates under negative pressure (-0.08 bar) where botanicals vaporize gently at 38°C.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded">
              <div className="text-[10px] text-white/40">OPERATING TEMP</div>
              <div className="text-lg font-medium text-[#E5A958] mt-0.5">38.0°C</div>
              <div className="text-[10px] text-white/30 mt-0.5">Zero thermal oxidation</div>
            </div>
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded">
              <div className="text-[10px] text-white/40">HEADSPACE BLANKET</div>
              <div className="text-lg font-medium text-white mt-0.5">99.9% N₂</div>
              <div className="text-[10px] text-white/30 mt-0.5">Argon/Nitrogen seal</div>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-[10px] font-mono text-white/40">
            <ShieldCheck size={13} className="text-[#E5A958]" />
            <span>ISO 9001 BIOPHARMACEUTICAL PURITY AUDIT</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ALLOCATION PACK SELECTOR */}
      {/* ========================================================= */}
      <div className="border border-white/[0.08] bg-[#07080B] rounded-xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              BATCH N° 04 ALLOCATION // SPRING 2026
            </div>
            <h3 className="font-sans font-light text-2xl sm:text-4xl text-white tracking-tight">
              Reserve Your Allocation Dossier
            </h3>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-[11px] text-white/40 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958]" />
            <span>BATCH 04 CAPACITY: 88% RESERVED</span>
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
                className={`relative p-6 sm:p-8 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E5A958] bg-[#E5A958]/[0.04]'
                    : 'border-white/[0.08] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/20'
                }`}
              >
                {/* Badge if present */}
                {tier.badge && (
                  <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-[#E5A958] text-[#050506] font-mono text-[9px] font-semibold tracking-widest uppercase">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider">{tier.title}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#E5A958] bg-[#E5A958]' : 'border-white/20'
                    }`}>
                      {isSelected && <Check size={10} className="text-[#050506] stroke-[3]" />}
                    </div>
                  </div>

                  <div className="font-sans font-medium text-lg text-white mb-1">{tier.bottles}</div>
                  <div className="font-mono text-xs text-[#E5A958]">{tier.savings}</div>

                  <div className="mt-6 mb-6">
                    <span className="font-sans font-light text-3xl sm:text-4xl text-white">${tier.price}</span>
                    <span className="font-mono text-xs text-white/40 ml-2">/ {tier.perBottle}</span>
                  </div>

                  <ul className="space-y-2 font-sans text-xs text-white/50 border-t border-white/[0.06] pt-4 font-light">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check size={12} className="text-[#E5A958] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-lg border border-white/[0.08] bg-black/40">
          <div>
            <div className="font-sans font-medium text-base text-white">
              Selected: {tiers[selectedTier].title} (${tiers[selectedTier].price})
            </div>
            <div className="font-mono text-[11px] text-white/40 mt-0.5">
              Complimentary Insured Cold Shipping · Estimated Dispatch: May 2026
            </div>
          </div>

          <button
            onClick={handleOpenDrawer}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#E5A958] text-[#050506] font-mono font-medium text-xs uppercase tracking-[0.18em] transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span>RESERVE ALLOCATION — ${tiers[selectedTier].price}</span>
            <ArrowUpRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
