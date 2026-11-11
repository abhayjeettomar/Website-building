import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisScroll } from './hooks/useLenisScroll';
import { scrollStore } from './store/scrollStore';

import { ExperienceCanvas } from './canvas/ExperienceCanvas';
import { Navbar } from './components/Navbar';
import { HeroBackplate } from './components/HeroBackplate';
import { ScrollStagesOverlay } from './components/ScrollStagesOverlay';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  // Initialize Lenis smooth scroll and ticker synchronization
  useLenisScroll();

  useEffect(() => {
    // Bind ScrollTrigger to the master 750vh scroll track
    // The 3D bottle stays live and interactive across the ENTIRE website from 0% to 100%
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#pinned-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          scrollStore.progress = self.progress;

          // Dispatch discrete stage changes ONLY when crossing boundaries
          let currentStage = 1;
          if (self.progress >= 0.88) currentStage = 6;
          else if (self.progress >= 0.76) currentStage = 5;
          else if (self.progress >= 0.58) currentStage = 4;
          else if (self.progress >= 0.38) currentStage = 3;
          else if (self.progress >= 0.18) currentStage = 2;

          if (currentStage !== scrollStore.stage) {
            scrollStore.stage = currentStage;
            scrollStore.notify(); // Discrete update only!
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-[#F7F4EE] text-[#171614] min-h-screen selection:bg-[#B86B27]/15 selection:text-[#9E571B]">
      {/* 1. Subtle Paper Grain Overlay - Unifies 3D & UI */}
      <div className="film-grain" />

      {/* 2. Fixed Atelier Navbar (z-40) */}
      <Navbar />

      {/* 3. Optical Backplate Headline ("AETHER" z-10) - Refracted by the 3D bottle */}
      <HeroBackplate />

      {/* 4. Fixed 100vw x 100vh Three.js WebGL Canvas (z-20) */}
      {/* The 3D bottle animates continuously from top to bottom across ALL stages */}
      <ExperienceCanvas />

      {/* 5. Fixed Interactive Stage HUD & Formulation Overlays (z-30) */}
      {/* Interactive options: Distillate Base -> Nootropic Infusion -> Chill Architecture -> Bespoke Engraving -> Dispatch */}
      <ScrollStagesOverlay />

      {/* 6. Master 750vh Scroll Track (The entire experience is completely scroll-driven) */}
      <main id="pinned-scroll-container" className="relative w-full h-[750vh] pointer-events-none" />
    </div>
  );
}

export default App;
