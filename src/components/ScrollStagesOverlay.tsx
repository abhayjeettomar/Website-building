import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles, Snowflake, Flame, CheckCircle2 } from 'lucide-react';
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
    if (progress < 0.26) stage2Opacity = (progress - 0.20) / 0.06;
    else if (progress > 0.39) stage2Opacity = 1 - (progress - 0.39) / 0.06;
    else stage2Opacity = 1;
  }

  // Stage 3: 0.45 - 0.70
  let stage3Opacity = 0;
  if (progress >= 0.45 && progress <= 0.70) {
    if (progress < 0.50) stage3Opacity = (progress - 0.45) / 0.05;
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
    <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none overflow-hidden">
      {/* ========================================================= */}
      {/* STAGE 1: GENESIS SILHOUETTE & EDITORIAL DECK (0% - 20%) */}
      {/* ========================================================= */}
      {stage1Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-12 py-24 flex flex-col justify-between transition-opacity duration-200"
          style={{ opacity: stage1Opacity }}
        >
          {/* Top Eyebrow Tag */}
          <div className="pt-4 flex justify-between items-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/[0.09] bg-[#0A0B0E]/60 backdrop-blur-md font-mono text-[11px] text-[#8E9099] tracking-[0.16em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]" />
              <span>COLLECTION 001 // NEURO-BOTANICAL ELIXIR · 0.0% ABV</span>
            </div>
            <div className="hidden sm:block font-mono text-[11px] text-[#686A73] tracking-[0.18em]">
              BOROSILICATE HEAVY-FLINT // 500ML
            </div>
          </div>

          {/* Bottom Editorial Sub-deck */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8">
            {/* Left: Product Manifesto */}
            <div className="max-w-md">
              <p className="text-sm sm:text-base font-sans font-light text-[#F5F5F7]/90 leading-relaxed">
                Distilled adaptogens, charred Japanese yuzu & dual-extract Lion's Mane engineered for heightened nocturnal clarity without compromise.
              </p>
              <div className="flex items-center space-x-4 mt-4 font-mono text-[11px] text-[#8E9099] tracking-wider">
                <span className="text-[#F4B860]">0.0% ABV</span>
                <span>·</span>
                <span>NO ADDED SUGAR</span>
                <span>·</span>
                <span>14 KCAL</span>
              </div>
            </div>

            {/* Center: Scroll down indicator */}
            <div className="flex flex-col items-center justify-center space-y-2 select-none">
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#F4B860] to-transparent animate-pulse" />
              <div className="flex items-center space-x-1.5 font-mono text-[10px] text-[#8E9099] uppercase tracking-[0.24em]">
                <ArrowDown size={11} className="text-[#F4B860] animate-bounce" />
                <span>SCROLL TO EXPLORE ARCHITECTURE</span>
              </div>
            </div>

            {/* Right: Technical Telemetry */}
            <div className="hidden md:flex flex-col items-end space-y-1.5 font-mono text-[11px] text-[#8E9099] tabular-nums">
              <div className="flex items-center space-x-2">
                <span className="text-[#686A73]">OPTICAL IOR:</span>
                <span className="text-[#F5F5F7]">1.480 FLINT</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#686A73]">VACUUM BOIL:</span>
                <span className="text-[#F5F5F7]">38.0°C / -0.08 BAR</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#686A73]">ACTIVE CORTEX:</span>
                <span className="text-[#F4B860]">500MG LION'S MANE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: 360° MACRO SURFACE & VESSEL (20% - 45%) */}
      {/* ========================================================= */}
      {stage2Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-16 flex items-center justify-start transition-opacity duration-200"
          style={{ opacity: stage2Opacity }}
        >
          <div className="max-w-xl bg-[#07080B]/80 backdrop-blur-xl border border-white/[0.09] p-8 sm:p-10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] pointer-events-auto">
            {/* Tag */}
            <div className="inline-flex items-center space-x-2 font-mono text-[11px] text-[#F4B860] tracking-[0.2em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4B860]" />
              <span>02 // SURFACE & VESSEL ARCHITECTURE</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F7] tracking-[-0.03em] leading-[1.05] mb-5">
              Heavy-Flint Optical Glass<span className="text-[#F4B860]">.</span> Cold-Vacuum Sealed<span className="text-[#D97724]">.</span>
            </h2>

            {/* Body */}
            <p className="font-sans text-sm sm:text-base text-[#8E9099] leading-relaxed mb-6 font-light">
              Every 500mL apothecary vessel is molded from high-density flint glass with an optical refraction index of 1.48, shielding volatile terpenes and nootropic alkaloids from UV degradation while maintaining sub-4°C thermal inertia.
            </p>

            {/* 3-Column Mini Telemetry Strip */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-white/[0.09] py-4 my-2">
              <div>
                <div className="font-mono text-lg sm:text-xl font-bold text-[#F5F5F7]">1,250 MG</div>
                <div className="font-mono text-[10px] text-[#8E9099] tracking-wider uppercase mt-0.5">Active Nootropic Stack</div>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <div className="font-mono text-lg sm:text-xl font-bold text-[#F4B860]">1.48 IOR</div>
                <div className="font-mono text-[10px] text-[#8E9099] tracking-wider uppercase mt-0.5">Heavy-Flint Vessel</div>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <div className="font-mono text-lg sm:text-xl font-bold text-[#D97724]">-0.08 BAR</div>
                <div className="font-mono text-[10px] text-[#8E9099] tracking-wider uppercase mt-0.5">Vacuum Distillation</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#686A73]">
              <span>ROTATIONAL INSPECTION: 360° AXIAL DOLLY</span>
              <span className="text-[#F4B860]">PRECISION BUMP 0.008</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: EXPLODED-VIEW ANATOMY (45% - 70%) */}
      {/* ========================================================= */}
      {stage3Opacity > 0.01 && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200"
          style={{ opacity: stage3Opacity }}
        >
          {/* Header Tag */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-[#0A0B0E]/80 backdrop-blur-md font-mono text-xs text-[#F4B860] tracking-[0.2em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D97724] animate-ping" />
              <span>03 // EXPLODED ENGINEERING & BOTANICAL ANATOMY</span>
            </div>
            <p className="font-sans text-xs text-[#8E9099] mt-2 tracking-wide">
              Vertical separation of closure, nootropic liquid core, volatile botanicals & optical vessel
            </p>
          </div>

          {/* SVG Leader Lines for Desktop (>768px) */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Callout 1: Cap (Top Right) */}
            <line x1="50%" y1="28%" x2="68%" y2="22%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="68%" y1="22%" x2="74%" y2="22%" stroke="rgba(244,184,96,0.6)" strokeWidth="1" />
            <circle cx="50%" cy="28%" r="4" fill="#F4B860" />
            <circle cx="50%" cy="28%" r="8" stroke="#F4B860" strokeWidth="1" fill="none" opacity="0.4" />

            {/* Callout 2: Nootropic Liquid Core (Upper Left) */}
            <line x1="49%" y1="42%" x2="32%" y2="36%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="32%" y1="36%" x2="26%" y2="36%" stroke="rgba(244,184,96,0.6)" strokeWidth="1" />
            <circle cx="49%" cy="42%" r="4" fill="#D97724" />
            <circle cx="49%" cy="42%" r="8" stroke="#D97724" strokeWidth="1" fill="none" opacity="0.4" />

            {/* Callout 3: Volatile Botanicals (Mid Right) */}
            <line x1="52%" y1="56%" x2="68%" y2="52%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="68%" y1="52%" x2="74%" y2="52%" stroke="rgba(244,184,96,0.6)" strokeWidth="1" />
            <circle cx="52%" cy="56%" r="4" fill="#F4B860" />
            <circle cx="52%" cy="56%" r="8" stroke="#F4B860" strokeWidth="1" fill="none" opacity="0.4" />

            {/* Callout 4: Optical Vessel Punt (Bottom Left) */}
            <line x1="48%" y1="74%" x2="32%" y2="70%" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="32%" y1="70%" x2="26%" y2="70%" stroke="rgba(244,184,96,0.6)" strokeWidth="1" />
            <circle cx="48%" cy="74%" r="4" fill="#FFFFFF" />
            <circle cx="48%" cy="74%" r="8" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>

          {/* Desktop Flanking Spec Callout Boxes */}
          <div className="hidden md:block">
            {/* Box 1: Closure System (Top Right) */}
            <div className="absolute top-[18%] right-[5%] lg:right-[8%] w-80 p-5 rounded-xl border border-white/[0.09] bg-[#0A0B0E]/85 backdrop-blur-md pointer-events-auto">
              <div className="font-mono text-[10px] text-[#F4B860] uppercase tracking-widest">[ 01 // CLOSURE SYSTEM ]</div>
              <h4 className="font-display font-bold text-lg text-[#F5F5F7] mt-1">CNC-Anodized Gunmetal Cap</h4>
              <p className="font-sans text-xs text-[#8E9099] mt-1.5 leading-relaxed">
                Argon-flushed headspace seal, precision knurled grip, and airtight food-grade silicone compression gasket.
              </p>
            </div>

            {/* Box 2: Nootropic Matrix (Upper Left) */}
            <div className="absolute top-[32%] left-[5%] lg:left-[8%] w-80 p-5 rounded-xl border border-white/[0.09] bg-[#0A0B0E]/85 backdrop-blur-md pointer-events-auto">
              <div className="font-mono text-[10px] text-[#D97724] uppercase tracking-widest">[ 02 // NOOTROPIC MATRIX ]</div>
              <h4 className="font-display font-bold text-lg text-[#F5F5F7] mt-1">500mg Lion's Mane & L-Theanine</h4>
              <p className="font-sans text-xs text-[#8E9099] mt-1.5 leading-relaxed">
                Dual fruiting-body extraction providing alpha-wave cognitive focus without sympathomimetic jitter or crash.
              </p>
            </div>

            {/* Box 3: Volatile Botanicals (Mid Right) */}
            <div className="absolute top-[48%] right-[5%] lg:right-[8%] w-80 p-5 rounded-xl border border-white/[0.09] bg-[#0A0B0E]/85 backdrop-blur-md pointer-events-auto">
              <div className="font-mono text-[10px] text-[#F4B860] uppercase tracking-widest">[ 03 // VOLATILE BOTANICALS ]</div>
              <h4 className="font-display font-bold text-lg text-[#F5F5F7] mt-1">Smoked Yuzu, Schisandra & Damiana</h4>
              <p className="font-sans text-xs text-[#8E9099] mt-1.5 leading-relaxed">
                Cold-macerated 72 hours. Bright mountain citrus top notes over dry cedarwood and peppery botanical tannins.
              </p>
            </div>

            {/* Box 4: Optical Vessel (Bottom Left) */}
            <div className="absolute top-[66%] left-[5%] lg:left-[8%] w-80 p-5 rounded-xl border border-white/[0.09] bg-[#0A0B0E]/85 backdrop-blur-md pointer-events-auto">
              <div className="font-mono text-[10px] text-white uppercase tracking-widest">[ 04 // OPTICAL VESSEL ]</div>
              <h4 className="font-display font-bold text-lg text-[#F5F5F7] mt-1">High-Flint Apothecary Punt (500mL)</h4>
              <p className="font-sans text-xs text-[#8E9099] mt-1.5 leading-relaxed">
                4.2mm wall gauge, 1.48 optical refractive index, concave thermal stability base, and metallic batch serialization.
              </p>
            </div>
          </div>

          {/* Mobile Collapsed Cards Stack (<768px) */}
          <div className="md:hidden absolute bottom-12 left-4 right-4 flex flex-col space-y-2 pointer-events-auto max-h-[45vh] overflow-y-auto p-2 bg-[#050506]/85 backdrop-blur-lg border border-white/[0.08] rounded-xl">
            <div className="p-3 border-b border-white/[0.06]">
              <span className="font-mono text-[10px] text-[#F4B860] uppercase">[01] CNC Gunmetal Cap</span>
              <p className="text-xs text-[#8E9099]">Argon-flushed headspace with precision knurled grip.</p>
            </div>
            <div className="p-3 border-b border-white/[0.06]">
              <span className="font-mono text-[10px] text-[#D97724] uppercase">[02] 500mg Lion's Mane</span>
              <p className="text-xs text-[#8E9099]">Dual fruiting-body extraction for alpha-wave calm.</p>
            </div>
            <div className="p-3">
              <span className="font-mono text-[10px] text-[#F4B860] uppercase">[03] Smoked Yuzu & Botanicals</span>
              <p className="text-xs text-[#8E9099]">72h cold-macerated mountain citrus & schisandra.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: REASSEMBLY & INTERACTIVE SERVE RITUAL (70% - 88%) */}
      {/* ========================================================= */}
      {stage4Opacity > 0.01 && (
        <div
          className="absolute inset-0 px-6 sm:px-16 flex items-center justify-end transition-opacity duration-200"
          style={{ opacity: stage4Opacity }}
        >
          <div className="w-full max-w-md bg-[#07080B]/85 backdrop-blur-xl border border-white/[0.09] p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center space-x-2 font-mono text-[11px] text-[#F4B860] tracking-[0.2em] uppercase">
                <Sparkles size={13} className="text-[#F4B860]" />
                <span>04 // SERVE RITUAL LABORATORY</span>
              </div>
              <span className="font-mono text-[10px] text-[#686A73]">LIVE LIGHTING MATRIX</span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F5F7] tracking-tight mb-2">
              Select Pour Architecture<span className="text-[#F4B860]">.</span>
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#8E9099] font-light leading-relaxed mb-6">
              Switch between thermodynamic serve environments. The 3D scene responds in real-time with calibrated light spectra and effervescence.
            </p>

            {/* Interactive Mode Selector Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Option A: NEAT */}
              <button
                onClick={() => scrollStore.setServeMode('neat')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  serveMode === 'neat'
                    ? 'border-[#F4B860] bg-[#F4B860]/10 shadow-[0_0_20px_rgba(244,184,96,0.18)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Flame size={16} className={serveMode === 'neat' ? 'text-[#D97724]' : 'text-[#686A73]'} />
                  {serveMode === 'neat' && <CheckCircle2 size={14} className="text-[#F4B860]" />}
                </div>
                <div className="font-mono text-xs font-semibold text-[#F5F5F7]">01 // NEAT OBSIDIAN</div>
                <div className="font-mono text-[10px] text-[#8E9099] mt-0.5">Cellar 12°C · Meditative</div>
              </button>

              {/* Option B: OVER ICE */}
              <button
                onClick={() => scrollStore.setServeMode('ice')}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  serveMode === 'ice'
                    ? 'border-[#9CE0FF] bg-[#9CE0FF]/10 shadow-[0_0_20px_rgba(156,224,255,0.22)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Snowflake size={16} className={serveMode === 'ice' ? 'text-[#9CE0FF]' : 'text-[#686A73]'} />
                  {serveMode === 'ice' && <CheckCircle2 size={14} className="text-[#9CE0FF]" />}
                </div>
                <div className="font-mono text-xs font-semibold text-[#F5F5F7]">02 // OVER ARTISANAL ICE</div>
                <div className="font-mono text-[10px] text-[#8E9099] mt-0.5">Glacial 2°C · Electrified</div>
              </button>
            </div>

            {/* Dynamic Tasting Readout Based on Active Mode */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 font-mono text-[11px] space-y-2">
              {serveMode === 'neat' ? (
                <>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">AROMA:</span>
                    <span className="text-[#F5F5F7] text-right">Warm Hinoki, Toasted Yuzu Rind</span>
                  </div>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">MOUTHFEEL:</span>
                    <span className="text-[#F4B860] text-right">Velvety, Full-Bodied Elixir</span>
                  </div>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">RECOMMENDED:</span>
                    <span className="text-[#F5F5F7] text-right">75mL Neat in Heavy Glass Tumbler</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">AROMA:</span>
                    <span className="text-[#9CE0FF] text-right">Electrified Citrus Mist, Botanicals</span>
                  </div>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">MOUTHFEEL:</span>
                    <span className="text-[#9CE0FF] text-right">Crisp, High-Tension Effervescence</span>
                  </div>
                  <div className="flex justify-between text-[#8E9099]">
                    <span className="text-[#686A73]">RECOMMENDED:</span>
                    <span className="text-[#F5F5F7] text-right">90mL Over Hand-Cut King Cube</span>
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

