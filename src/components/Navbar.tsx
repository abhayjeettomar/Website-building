import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowDown } from 'lucide-react';
import { scrollStore } from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function Navbar() {
  const [activeStage, setActiveStage] = useState(scrollStore.stage);
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    // Only updates state when discrete stage or formulation changes - zero continuous scroll re-render lag!
    const unsub = scrollStore.subscribe(() => {
      setActiveStage(scrollStore.stage);
    });
    return unsub;
  }, []);

  const handleToggleAudio = () => {
    const active = audioSystem.toggle();
    setIsAudioActive(active);
  };

  const stageLabels: Record<number, string> = {
    1: 'Vessel Genesis',
    2: 'Base Distillate',
    3: 'Botanical Infusion',
    4: 'Chill Architecture',
    5: 'Bespoke Engraving',
    6: 'Dispatch Vault',
  };

  const handleScrollToDispatch = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-4 border-b border-[#171614]/[0.08] bg-[#F7F4EE]/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2.5 group">
            <span className="font-display font-medium text-base tracking-[0.18em] text-[#171614] group-hover:text-[#B86B27] transition-colors">
              AETHER
            </span>
            <span className="font-mono text-[10px] text-[#171614]/40 tracking-widest">// ATELIER</span>
          </a>

          <span className="hidden sm:inline-block w-[1px] h-3.5 bg-[#171614]/[0.12]" />

          <span className="hidden md:inline-block font-sans text-xs text-[#171614]/55 font-light tracking-tight">
            Cold-Vacuum Botanical Distillate · 500mL
          </span>
        </div>

        {/* Center: Stage Index */}
        <div className="hidden lg:flex items-center space-x-3.5 font-mono text-[11px]">
          <span className="text-[#171614]/40 uppercase tracking-wider">STAGE</span>
          <span className="text-[#B86B27] font-medium tracking-widest">
            0{activeStage} / 06
          </span>
          <span className="w-1 h-1 rounded-full bg-[#171614]/20" />
          <span className="text-[#171614]/75 font-sans font-normal">
            {stageLabels[activeStage] || 'Genesis'}
          </span>
        </div>

        {/* Right: Sound toggle & Direct Scroll To Order Pill */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={handleToggleAudio}
            className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
              isAudioActive
                ? 'border-[#B86B27] bg-[#B86B27]/10 text-[#B86B27]'
                : 'border-[#171614]/[0.12] hover:border-[#171614]/40 text-[#171614]/50 hover:text-[#171614]'
            }`}
            title={isAudioActive ? 'Ambient Soundscape Active' : 'Enable Ambient Soundscape'}
            aria-label="Toggle Sound"
          >
            {isAudioActive ? <Volume2 size={12} strokeWidth={1.5} /> : <VolumeX size={12} strokeWidth={1.5} />}
          </button>

          <button
            onClick={handleScrollToDispatch}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#171614] hover:bg-[#2A2825] text-[#FAF7F0] text-xs font-sans font-medium tracking-tight transition-all duration-200 hover:shadow-sm"
          >
            <span>Order Batch</span>
            <ArrowDown size={11} className="text-[#FAF7F0]/70" />
          </button>
        </div>
      </div>
    </header>
  );
}
