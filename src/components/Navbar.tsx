import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { scrollStore } from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

export function Navbar() {
  const [isAudioActive, setIsAudioActive] = useState(audioSystem.getIsPlaying());

  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      // Keep in sync with store discrete changes
    });
    return unsub;
  }, []);

  const handleToggleAudio = () => {
    const active = audioSystem.toggle();
    setIsAudioActive(active);
  };

  const handleScrollToDispatch = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * 0.95,
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-4 border-b border-[#171614]/[0.08] bg-[#F7F4EE]/85 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2.5 group cursor-pointer">
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

        {/* Center: Clean Editorial Philosophy */}
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[10px] text-[#171614]/40 tracking-widest uppercase">
          <span>ZERO-PROOF BOTANICAL ARCHITECTURE</span>
        </div>

        {/* Right: Sound Toggle & Quick Reserve CTA */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleAudio}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#171614]/15 hover:border-[#B86B27] bg-white/60 hover:bg-white text-xs font-mono text-[#171614] transition-all cursor-pointer shadow-2xs"
            title={isAudioActive ? 'Mute Atmospheric Audio' : 'Unmute Atmospheric Audio'}
          >
            {isAudioActive ? (
              <>
                <Volume2 size={13} className="text-[#B86B27] animate-pulse" />
                <span className="text-[10px] text-[#B86B27] font-medium tracking-wider">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-[#171614]/40" />
                <span className="text-[10px] text-[#171614]/40 tracking-wider">MUTED</span>
              </>
            )}
          </button>

          <button
            onClick={handleScrollToDispatch}
            className="hidden sm:flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#171614] hover:bg-[#2B2926] text-[#FAF7F0] text-xs font-sans font-medium transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>Reserve Batch</span>
            <span className="text-[#B86B27] text-xs">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
