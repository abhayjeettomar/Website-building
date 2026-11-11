import React, { useEffect, useRef } from 'react';
import { scrollStore } from '../store/scrollStore';

export function HeroBackplate() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // High-performance direct DOM style manipulation without React re-renders
    const onScroll = () => {
      if (!containerRef.current) return;
      const p = scrollStore.progress;
      if (p <= 0.22) {
        const op = Math.max(0, 1 - (p / 0.16));
        containerRef.current.style.opacity = op.toString();
        containerRef.current.style.transform = `translateY(${p * 120}px)`;
        containerRef.current.style.display = op > 0.005 ? 'flex' : 'none';
      } else {
        containerRef.current.style.display = 'none';
      }
    };

    // Listen on scrollStore notify or animation ticker
    const interval = setInterval(onScroll, 33); // 30fps lightweight DOM sync
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-center items-center overflow-hidden transition-opacity duration-150"
    >
      {/* Precision hairline grid against warm cream */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,22,20,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,22,20,0.03)_1px,transparent_1px)] bg-[size:7rem_7rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_50%,transparent_100%)]" />

      {/* Crosshairs & Atelier layout indicators */}
      <div className="absolute top-24 left-8 sm:left-14 font-mono text-[10px] text-[#171614]/35 tracking-[0.25em] uppercase">
        + 47.3769° N // 8.5417° E · ATELIER ALCHEMY
      </div>
      <div className="absolute top-24 right-8 sm:right-14 font-mono text-[10px] text-[#171614]/35 tracking-[0.25em] uppercase text-right">
        OPTICAL FLINT // 1.480 IOR +
      </div>

      {/* Giant Editorial Ghost Wordmark: AETHER */}
      {/* Refracted physically through the 3D borosilicate glass */}
      <div className="relative text-center select-none w-full px-6">
        <h1 className="font-display font-medium text-[clamp(5.5rem,18vw,16rem)] tracking-[-0.04em] leading-[0.85] text-[#171614]/[0.055]">
          AETHER
        </h1>
        <div className="flex justify-center items-center space-x-6 mt-6">
          <span className="w-8 h-[1px] bg-[#171614]/15" />
          <p className="font-mono text-[11px] text-[#171614]/40 uppercase tracking-[0.3em]">
            COLD-VACUUM FRACTIONAL DISTILLATION // N° 001
          </p>
          <span className="w-8 h-[1px] bg-[#171614]/15" />
        </div>
      </div>
    </div>
  );
}
