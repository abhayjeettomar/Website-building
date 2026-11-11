import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { scrollStore } from '../store/scrollStore';

export function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let animId: number;
    const updateHUD = () => {
      const p = Math.round(scrollStore.progress * 1000) / 10;
      setScrollProgress(p);

      let s = 1;
      if (scrollStore.progress >= 0.88) s = 5;
      else if (scrollStore.progress >= 0.70) s = 4;
      else if (scrollStore.progress >= 0.45) s = 3;
      else if (scrollStore.progress >= 0.20) s = 2;
      setActiveStage(s);

      animId = requestAnimationFrame(updateHUD);
    };

    animId = requestAnimationFrame(updateHUD);
    return () => cancelAnimationFrame(animId);
  }, []);

  const stageLabels: Record<number, string> = {
    1: 'GENESIS SILHOUETTE',
    2: 'VESSEL ARCHITECTURE',
    3: 'EXPLODED ANATOMY',
    4: 'SERVE RITUAL',
    5: 'ALLOCATION DOSSIER',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-5 border-b border-white/[0.06] bg-[#050506]/60 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Refined Wordmark */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2 group">
            <span className="font-display font-medium text-base tracking-[0.2em] text-[#F5F5F7] group-hover:text-white transition-colors">
              AETHER
            </span>
            <span className="font-mono text-[11px] text-white/30 tracking-widest">// 001</span>
          </a>

          <span className="hidden sm:inline-block w-[1px] h-3 bg-white/[0.1]" />

          <span className="hidden md:inline-block font-mono text-[10px] text-white/40 tracking-[0.22em] uppercase">
            0.0% ABV · APOTHECARY FLINT
          </span>
        </div>

        {/* Center: Quiet Swiss Stage Index */}
        <div className="hidden lg:flex items-center space-x-4 font-mono text-[11px]">
          <span className="text-white/30">INDEX:</span>
          <span className="text-[#E5A958] tracking-widest font-medium">
            0{activeStage} / 05
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-white/70 tracking-wider font-light">
            {stageLabels[activeStage]}
          </span>
        </div>

        {/* Right: Sound toggle & Minimalist Inverse Pill CTA */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-7 h-7 rounded-full border border-white/[0.08] hover:border-white/25 flex items-center justify-center text-white/40 hover:text-white transition-all"
            title={isMuted ? 'Audio Off' : 'Audio Active'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX size={12} strokeWidth={1.5} /> : <Volume2 size={12} strokeWidth={1.5} className="text-[#E5A958]" />}
          </button>

          <button
            onClick={() => scrollStore.setDrawerOpen(true)}
            className="group relative px-4 py-1.5 rounded-full bg-white text-[#050506] hover:bg-[#E5A958] transition-colors duration-300 font-mono text-[11px] font-medium tracking-[0.14em] uppercase flex items-center space-x-1.5"
          >
            <span>RESERVE</span>
            <span className="text-[#050506]/50">·</span>
            <span className="text-[10px] text-[#050506]/70">BATCH 04</span>
            <ArrowUpRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
