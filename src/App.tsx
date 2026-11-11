import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisScroll } from './hooks/useLenisScroll';
import { scrollStore } from './store/scrollStore';

import { ExperienceCanvas } from './canvas/ExperienceCanvas';
import { Navbar } from './components/Navbar';
import { HeroBackplate } from './components/HeroBackplate';
import { ScrollStagesOverlay } from './components/ScrollStagesOverlay';
import { SensoryMatrixBento } from './components/SensoryMatrixBento';
import { AllocationDrawer } from './components/AllocationDrawer';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  // Initialize Lenis smooth scroll and ticker synchronization
  useLenisScroll();

  useEffect(() => {
    // Bind ScrollTrigger to the 560vh pinned timeline
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#pinned-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          // Write normalized progress directly to singleton ref (NO React setState on tick)
          scrollStore.progress = self.progress;

          // Dispatch discrete stage changes only at threshold boundaries
          let currentStage = 1;
          if (self.progress >= 0.88) currentStage = 5;
          else if (self.progress >= 0.70) currentStage = 4;
          else if (self.progress >= 0.45) currentStage = 3;
          else if (self.progress >= 0.20) currentStage = 2;

          scrollStore.setStage(currentStage);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-[#050506] text-[#F5F5F7] min-h-screen selection:bg-[#F4B860]/20 selection:text-[#F4B860]">
      {/* 1. Fixed Technical Navbar (z-40) */}
      <Navbar />

      {/* 2. Optical Backplate Headline ("AETHER" z-10) - Refracted by the 3D bottle */}
      <HeroBackplate />

      {/* 3. Fixed 100vw x 100vh Three.js WebGL Canvas (z-20) */}
      <ExperienceCanvas />

      {/* 4. Fixed Pointers-Events-None Stage HUD Overlays (z-30) */}
      <ScrollStagesOverlay />

      {/* 5. Master 560vh Pinned Scroll Choreography Track */}
      {/* Provides physical scroll height for Stages 1 through 4 */}
      <main id="pinned-scroll-container" className="relative w-full h-[560vh] pointer-events-none" />

      {/* 6. Natural-Flow Stage 5 Architectural Section (z-30) */}
      <div className="relative z-30 bg-[#050506]">
        <SensoryMatrixBento />
        <Footer />
      </div>

      {/* 7. Slide-Over Allocation Drawer (z-50) */}
      <AllocationDrawer />
    </div>
  );
}

export default App;

