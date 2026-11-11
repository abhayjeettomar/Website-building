import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowDown } from 'lucide-react';
import { scrollStore } from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    let animId: number;
    const updateHUD = () => {
      const p = Math.round(scrollStore.progress * 1000) / 10;
      setScrollProgress(p);

      let s = 1;
      if (scrollStore.progress >= 0.88) s = 6;
      else if (scrollStore.progress >= 0.74) s = 5;
      else if (scrollStore.progress >= 0.56) s = 4;
      else if (scrollStore.progress >= 0.36) s = 3;
      else if (scrollStore.progress >= 0.16) s = 2;
      setActiveStage(s);

      animId = requestAnimationFrame(updateHUD);
    };

    animId = requestAnimationFrame(updateHUD);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleToggleAudio = () => {
    const active = audioSystem.toggle();
    setIsAudioActive(active);
  };

  const stageLabels: Record<number, string> = {
    1: 'EMPTY VESSEL',
    2: 'BASE DISTILLATE',
    3: 'NOOTROPIC INFUSION',
    4: 'CHILL ARCHITECTURE',
    5: 'LABEL ENGRAVING',
    6: 'DISPATCH VAULT',
  };

  const handleScrollToDispatch = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-5 border-b border-white/[0.06] bg-[#060607]/60 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2 group">
            <span className="font-display font-medium text-base tracking-[0.2em] text-[#F5F3EC] group-hover:text-white transition-colors">
              AETHER
            </span>
            <span className="font-mono text-[11px] text-white/30 tracking-widest">// ALCHEMY</span>
          </a>

          <span className="hidden sm:inline-block w-[1px] h-3 bg-white/[0.1]" />

          <span className="hidden md:inline-block font-mono text-[10px] text-white/40 tracking-[0.22em] uppercase">
            BESPOKE 500ML APOTHECARY · 0.0% ABV
          </span>
        </div>

        {/* Center: Stage Index */}
        <div className="hidden lg:flex items-center space-x-4 font-mono text-[11px]">
          <span className="text-white/30">STEP:</span>
          <span className="text-[#E5A958] tracking-widest font-medium">
            0{activeStage} / 06
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-white/70 tracking-wider font-light">
            {stageLabels[activeStage]}
          </span>
        </div>

        {/* Right: Sound toggle & Direct Scroll To Order Pill */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleAudio}
            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
              isAudioActive
                ? 'border-[#E5A958]/50 bg-[#E5A958]/10 text-[#E5A958]'
                : 'border-white/[0.08] hover:border-white/25 text-white/40 hover:text-white'
            }`}
            title={isAudioActive ? 'Ambient Soundscape Active' : 'Enable Ambient Soundscape'}
            aria-label="Toggle Sound"
          >
            {isAudioActive ? <Volume2 size={12} strokeWidth={1.5} /> : <VolumeX size={12} strokeWidth={1.5} />}
          </button>

          <button
            onClick={handleScrollToDispatch}
            className="group relative px-4 py-1.5 rounded-full bg-white text-[#050506] hover:bg-[#E5A958] transition-colors duration-300 font-mono text-[11px] font-medium tracking-[0.14em] uppercase flex items-center space-x-1.5"
          >
            <span>ORDER VESSEL</span>
            <span className="text-[#050506]/50">·</span>
            <span className="text-[10px] text-[#050506]/70">$64</span>
            <ArrowDown size={11} strokeWidth={2} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
