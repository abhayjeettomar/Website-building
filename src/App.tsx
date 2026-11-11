import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisScroll } from './hooks/useLenisScroll';
import { scrollStore } from './store/scrollStore';

import { CinematicBottleCanvas } from './canvas/CinematicBottleCanvas';
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

          // Dispatch discrete stage changes with seamless boundaries
          let currentStage = 1;
          if (self.progress >= 0.88) currentStage = 6;
          else if (self.progress >= 0.74) currentStage = 5;
          else if (self.progress >= 0.56) currentStage = 4;
          else if (self.progress >= 0.36) currentStage = 3;
          else if (self.progress >= 0.16) currentStage = 2;

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

      {/* 4. Photorealistic Cinema Canvas (z-20) - 100% video-grade bottle, liquid physics, and crystal glass */}
      <CinematicBottleCanvas />

      {/* 5. Fixed Interactive Stage HUD & Formulation Overlays (z-30) */}
      <ScrollStagesOverlay />

      {/* 6. Dynamic 320vh Scroll Track (Snappy, frictionless phase progression) */}
      <main id="pinned-scroll-container" className="relative w-full h-[320vh] pointer-events-none" />
    </div>
  );
}

export default App;
