import React, { useEffect, useState } from 'react';
import { scrollStore } from '../store/scrollStore';

export function HeroBackplate() {
  const [opacity, setOpacity] = useState(1);
  const [transformY, setTransformY] = useState(0);

  useEffect(() => {
    let animId: number;
    const updateBackplate = () => {
      const p = scrollStore.progress;
      if (p <= 0.22) {
        // Fade out smoothly between 0% and 22%
        const op = Math.max(0, 1 - (p / 0.18));
        setOpacity(op);
        setTransformY(p * 200); // Gentle parallax drop
      } else {
        setOpacity(0);
      }
      animId = requestAnimationFrame(updateBackplate);
    };

    animId = requestAnimationFrame(updateBackplate);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (opacity <= 0.01) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-center items-center overflow-hidden transition-opacity duration-150"
      style={{
        opacity,
        transform: `translateY(${transformY}px)`,
      }}
    >
      {/* Precision architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Coordinate watermarks */}
      <div className="absolute top-28 left-8 font-mono text-[10px] text-white/[0.15] tracking-[0.2em] uppercase">
        LAT: 47.3769° N // LON: 8.5417° E · ZURICH BIO-DISTILLERY
      </div>
      <div className="absolute top-28 right-8 font-mono text-[10px] text-white/[0.15] tracking-[0.2em] uppercase text-right">
        OPTICAL REFRACTION: 1.480 IOR · FLINT MATRIX
      </div>

      {/* Giant Editorial Wordmark: AETHER - physically refracted by the 3D bottle */}
      <div className="relative text-center select-none w-full px-4">
        <h1 className="font-display font-extrabold text-[clamp(4.8rem,16vw,15.5rem)] tracking-[-0.04em] leading-[0.88] text-[#F5F5F7]/90 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          AETHER
        </h1>
        <div className="flex justify-center items-center space-x-6 mt-4">
          <span className="w-12 h-[1px] bg-white/[0.15]" />
          <p className="font-mono text-xs sm:text-sm text-[#F4B860] uppercase tracking-[0.28em]">
            // 001 · ZERO-PROOF BOTANICAL ELIXIR
          </p>
          <span className="w-12 h-[1px] bg-white/[0.15]" />
        </div>
      </div>
    </div>
  );
}

