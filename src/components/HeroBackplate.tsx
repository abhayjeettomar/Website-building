import React, { useEffect, useRef } from 'react';
import { scrollStore } from '../store/scrollStore';

export function HeroBackplate() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pure CSS/DOM style updates without React re-render overhead
    const onScroll = () => {
      if (!containerRef.current) return;
      const p = scrollStore.progress;
      if (p <= 0.18) {
        const op = Math.max(0, 1 - (p / 0.14));
        containerRef.current.style.opacity = op.toString();
        containerRef.current.style.transform = `translateY(${p * 80}px)`;
        containerRef.current.style.display = op > 0.005 ? 'flex' : 'none';
      } else {
        containerRef.current.style.display = 'none';
      }
    };

    const interval = setInterval(onScroll, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-10 pointer-events-none flex flex-col justify-center items-center overflow-hidden transition-opacity duration-200"
    >
      {/* Precision hairline gallery grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,22,20,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,22,20,0.025)_1px,transparent_1px)] bg-[size:8rem_8rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      {/* Ultra-subtle ghost architectural watermark refracted through borosilicate glass */}
      <div className="relative text-center select-none w-full px-6">
        <span className="font-display font-medium text-[clamp(6rem,19vw,17rem)] tracking-[-0.04em] leading-[0.8] text-[#171614]/[0.025] select-none block">
          AETHER
        </span>
      </div>
    </div>
  );
}
