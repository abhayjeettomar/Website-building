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
        setTransformY(p * 150);
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
      className="fixed inset-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-center items-center overflow-hidden transition-opacity duration-200"
      style={{
        opacity,
        transform: `translateY(${transformY}px)`,
      }}
    >
      {/* Precision hairline grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:8rem_8rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Crosshairs & Swiss layout indicators */}
      <div className="absolute top-24 left-12 font-mono text-[10px] text-white/20 tracking-[0.25em] uppercase">
        + 47.3769° N // 8.5417° E · ZURICH
      </div>
      <div className="absolute top-24 right-12 font-mono text-[10px] text-white/20 tracking-[0.25em] uppercase text-right">
        OPTICAL FLINT // 1.480 IOR +
      </div>

      {/* Giant Editorial Ghost Wordmark: AETHER */}
      {/* Refracted physically through the 3D borosilicate glass */}
      <div className="relative text-center select-none w-full px-6">
        <h1 className="font-display font-medium text-[clamp(5.5rem,18vw,16rem)] tracking-[-0.04em] leading-[0.85] bg-gradient-to-b from-white/40 via-white/15 to-transparent bg-clip-text text-transparent">
          AETHER
        </h1>
        <div className="flex justify-center items-center space-x-6 mt-6">
          <span className="w-8 h-[1px] bg-white/10" />
          <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.3em]">
            COLD-VACUUM FRACTIONAL DISTILLATION // N° 001
          </p>
          <span className="w-8 h-[1px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}
