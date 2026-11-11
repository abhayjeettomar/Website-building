import React, { useEffect, useState } from 'react';
import { ArrowDown, Flame, Snowflake, Check } from 'lucide-react';
import { scrollStore, ServeMode } from '../store/scrollStore';

export function ScrollStagesOverlay() {
  const [progress, setProgress] = useState(0);
  const [serveMode, setServeMode] = useState<ServeMode>('neat');

  useEffect(() => {
    let animId: number;
    const updateOverlay = () => {
      setProgress(scrollStore.progress);
      setServeMode(scrollStore.serveMode);
      animId = requestAnimationFrame(updateOverlay);
    };
    animId = requestAnimationFrame(updateOverlay);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute visibility opacities for each stage
  // Stage 1: 0.0 - 0.20
  const stage1Opacity = Math.max(0, Math.min(1, 1 - (progress / 0.18)));

  // Stage 2: 0.20 - 0.45
  let stage2Opacity = 0;
  if (progress >= 0.20 && progress <= 0.45) {
    if (progress < 0.25) stage2Opacity = (progress - 0.20) / 0.05;
    else if (progress > 0.40) stage2Opacity = 1 - (progress - 0.40) / 0.05;
    else stage2Opacity = 1;
  }

  // Stage 3: 0.45 - 0.70
  let stage3Opacity = 0;
  if (progress >= 0.45 && progress <= 0.70) {
    if (progress < 0.49) stage3Opacity = (progress - 0.45) / 0.04;
    else if (progress > 0.65) stage3Opacity = 1 - (progress - 0.65) / 0.05;
    else stage3Opacity = 1;
  }

  // Stage 4: 0.70 - 0.88
  let stage4Opacity = 0;
  if (progress >= 0.70 && progress <= 0.88) {
    if (progress < 0.74) stage4Opacity = (progress - 0.70) / 0.04;
    else if (progress > 0.84) stage4Opacity = 1 - (progress - 0.84) / 0.04;
    else stage4Opacity = 1;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden select-none">
      {/* ========================================================= */}
      {/* STAGE 1: EDITORIAL FOUR CORNERS & BOTTOM-LEFT ANCHOR */}
      {/* ========================================================= */}
      {stage1Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 py-24 flex flex-col justify-between transition-opacity duration-300"
          style={{ opacity: stage1Opacity }}
        >
          {/* Top Quiet Eyebrow */}
          <div className="pt-2 flex justify-between items-center font-mono text-[10px] text-white/35 tracking-[0.24em] uppercase">
            <div>[ 01 / 05 ] · FORMULA SPECIFICATION</div>
            <div className="hidden sm:block">COLD-VACUUM VAC-08 // ZURICH</div>
          </div>

          {/* Bottom Editorial Anchor */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4">
            {/* Left: Headline & Manifesto */}
            <div className="max-w-xl">
              <span className="font-mono text-[11px] text-[#E5A958] tracking-[0.22em] uppercase block mb-3">
                ZERO-PROOF NEURO-BOTANICAL ELIXIR
              </span>
              <h2 className="font-sans font-light text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-[1.08] tracking-[-0.03em]">
                Cold-vacuum distilled{' '}
                <span className="font-serif italic font-normal text-white/95">
                  botanical clarity
                </span>
                .
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/50 mt-3.5 max-w-md font-light leading-relaxed">
                Dual-extract Lion's Mane (500mg), charred Japanese yuzu peel & Himalayan schisandra berry suspended in a heavy-flint optical vessel.
              </p>
            </div>

            {/* Right: Telemetry & Scroll Cue */}
            <div className="flex flex-col items-start md:items-end space-y-3 font-mono text-[11px]">
              <div className="flex items-center space-x-2 text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958] animate-pulse" />
                <span>SCROLL TO EXPLORE ARCHITECTURE</span>
              </div>
              <div className="text-white/25 text-[10px] tracking-widest">
                ASSAY: 0.0% ABV · 1.480 IOR · 500ML
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: 360° MACRO EDITORIAL COLUMN (NO BULKY CARDS) */}
      {/* ========================================================= */}
      {stage2Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-start transition-opacity duration-300"
          style={{ opacity: stage2Opacity }}
        >
          <div className="max-w-md lg:max-w-lg pointer-events-auto">
            {/* Stage Index */}
            <div className="font-mono text-[11px] text-[#E5A958] tracking-[0.22em] uppercase mb-4">
              02 / 05 · VESSEL CRAFT
            </div>

            {/* Headline */}
            <h2 className="font-sans font-light text-3xl sm:text-4xl lg:text-[2.6rem] text-white leading-[1.08] tracking-[-0.03em] mb-4">
              Heavy-flint optical glass.{' '}
              <span className="font-serif italic font-normal text-white/90">
                Cold-vacuum sealed.
              </span>
            </h2>

            {/* Body */}
            <p className="font-sans text-xs sm:text-sm text-white/55 font-light leading-relaxed mb-8 max-w-md">
              Every 500mL vessel is molded from high-density borosilicate flint glass with an optical refractive index of 1.48, shielding volatile terpenes and nootropic alkaloids from UV degradation.
            </p>

            {/* Swiss Architectural Spec Line */}
            <div className="flex items-center space-x-8 py-4 border-t border-b border-white/[0.08] font-mono text-xs">
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wider">WALL GAUGE</div>
                <div className="text-white font-medium text-sm mt-0.5">4.2 MM</div>
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08]" />
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wider">REFRACTION</div>
                <div className="text-[#E5A958] font-medium text-sm mt-0.5">1.480 IOR</div>
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08]" />
              <div>
                <div className="text-white/35 text-[10px] uppercase tracking-wider">THERMAL INERTIA</div>
                <div className="text-white font-medium text-sm mt-0.5">&lt; 4.0°C</div>
              </div>
            </div>

            <div className="mt-4 font-mono text-[10px] text-white/30 tracking-widest uppercase">
              SURFACE CONDENSATION // GOLD FOIL MICRO-EMBOSS
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: MINIMALIST ARCHITECTURAL EXPLODED LABELS */}
      {/* ========================================================= */}
      {stage3Opacity > 0.01 && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
          style={{ opacity: stage3Opacity }}
        >
          {/* Centered Top Tag */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
            <span className="font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase block">
              03 / 05 · EXPLODED ANATOMY
            </span>
            <h3 className="font-sans font-light text-sm text-white/70 mt-1 tracking-wider">
              Component separation of closure, nootropic liquid core & volatile botanicals
            </h3>
          </div>

          {/* Desktop Architectural Annotations with Hairline Tick Rules */}
          <div className="hidden md:block">
            {/* [01] Cap (Top Right) */}
            <div className="absolute top-[22%] right-[8%] lg:right-[12%] w-64 text-left">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958]" />
                <span>01 // CLOSURE SYSTEM</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.12] my-2" />
              <h4 className="font-sans font-medium text-sm text-white">CNC Gunmetal Alloy Cap</h4>
              <p className="font-sans font-light text-xs text-white/50 mt-1 leading-relaxed">
                Argon-flushed headspace seal, precision knurled grip, airtight compression gasket.
              </p>
            </div>

            {/* [02] Nootropic Core (Upper Left) */}
            <div className="absolute top-[34%] left-[8%] lg:left-[12%] w-64 text-left">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958]" />
                <span>02 // NOOTROPIC CORTEX</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.12] my-2" />
              <h4 className="font-sans font-medium text-sm text-white">500mg Hericium Erinaceus</h4>
              <p className="font-sans font-light text-xs text-white/50 mt-1 leading-relaxed">
                Dual fruiting-body Lion's Mane & L-Theanine for calm, sustained alpha-wave velocity.
              </p>
            </div>

            {/* [03] Botanicals & Orbitals (Mid Right) */}
            <div className="absolute top-[52%] right-[8%] lg:right-[12%] w-64 text-left">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-[#E5A958] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A958]" />
                <span>03 // VOLATILE TERPENES</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.12] my-2" />
              <h4 className="font-sans font-medium text-sm text-white">Charred Yuzu & Schisandra</h4>
              <p className="font-sans font-light text-xs text-white/50 mt-1 leading-relaxed">
                Cold-macerated mountain citrus, damiana leaf and aromatic adaptogenic berry fractions.
              </p>
            </div>

            {/* [04] Vessel Punt (Bottom Left) */}
            <div className="absolute top-[68%] left-[8%] lg:left-[12%] w-64 text-left">
              <div className="flex items-center space-x-2 font-mono text-[10px] text-white/60 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>04 // OPTICAL VESSEL</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.12] my-2" />
              <h4 className="font-sans font-medium text-sm text-white">High-Flint Apothecary Punt</h4>
              <p className="font-sans font-light text-xs text-white/50 mt-1 leading-relaxed">
                Concave thermal stability base with embossed metallic batch serialization.
              </p>
            </div>
          </div>

          {/* Mobile Clean List */}
          <div className="md:hidden absolute bottom-12 left-6 right-6 p-4 rounded-xl border border-white/[0.08] bg-[#050506]/90 backdrop-blur-md space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between text-white/70">
              <span className="text-[#E5A958]">[01] CLOSURE:</span>
              <span>CNC Gunmetal Cap</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span className="text-[#E5A958]">[02] CORTEX:</span>
              <span>500mg Lion's Mane Stack</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span className="text-[#E5A958]">[03] BOTANICALS:</span>
              <span>Charred Yuzu & Schisandra</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: TACTILE SERVE RITUAL CONSOLE */}
      {/* ========================================================= */}
      {stage4Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 lg:px-16 flex items-center justify-end transition-opacity duration-300"
          style={{ opacity: stage4Opacity }}
        >
          <div className="w-full max-w-sm pointer-events-auto">
            {/* Header */}
            <div className="font-mono text-[10px] text-[#E5A958] tracking-[0.24em] uppercase mb-2">
              04 / 05 · SERVE RITUAL
            </div>
            <h3 className="font-sans font-light text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Select Pour Architecture<span className="text-[#E5A958]">.</span>
            </h3>
            <p className="font-sans text-xs text-white/50 font-light leading-relaxed mb-6">
              Switch thermodynamic environments. The 3D scene responds with calibrated light spectra, condensation, and effervescence.
            </p>

            {/* Tactile Pills */}
            <div className="space-y-2.5 mb-6">
              {/* Option A: NEAT */}
              <button
                onClick={() => scrollStore.setServeMode('neat')}
                className={`w-full p-3.5 rounded-full border text-left transition-all duration-300 flex items-center justify-between px-5 ${
                  serveMode === 'neat'
                    ? 'border-[#E5A958] bg-[#E5A958]/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Flame size={14} className={serveMode === 'neat' ? 'text-[#E5A958]' : 'text-white/30'} />
                  <span className="font-mono text-xs tracking-wider">01 // NEAT OBSIDIAN · 12°C</span>
                </div>
                {serveMode === 'neat' && <Check size={13} className="text-[#E5A958]" />}
              </button>

              {/* Option B: OVER ICE */}
              <button
                onClick={() => scrollStore.setServeMode('ice')}
                className={`w-full p-3.5 rounded-full border text-left transition-all duration-300 flex items-center justify-between px-5 ${
                  serveMode === 'ice'
                    ? 'border-[#9CE0FF] bg-[#9CE0FF]/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Snowflake size={14} className={serveMode === 'ice' ? 'text-[#9CE0FF]' : 'text-white/30'} />
                  <span className="font-mono text-xs tracking-wider">02 // OVER ARTISANAL ICE · 2°C</span>
                </div>
                {serveMode === 'ice' && <Check size={13} className="text-[#9CE0FF]" />}
              </button>
            </div>

            {/* Quiet Profile Card */}
            <div className="py-4 border-t border-b border-white/[0.08] font-mono text-[11px] space-y-2 text-white/60">
              {serveMode === 'neat' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/35">AROMA:</span>
                    <span className="text-white">Warm Hinoki, Toasted Yuzu Rind</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35">MOUTHFEEL:</span>
                    <span className="text-[#E5A958]">Velvety, Full-Bodied Elixir</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35">RECOMMENDED:</span>
                    <span className="text-white/80">75mL in Heavy Glass Tumbler</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/35">AROMA:</span>
                    <span className="text-[#9CE0FF]">Electrified Citrus Mist, Botanicals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35">MOUTHFEEL:</span>
                    <span className="text-[#9CE0FF]">Crisp, High-Tension Effervescence</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35">RECOMMENDED:</span>
                    <span className="text-white/80">90mL Over Hand-Cut King Cube</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
