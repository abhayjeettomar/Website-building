import React, { useEffect, useRef, useState } from 'react';
import { scrollStore } from '../store/scrollStore';
import { audioSystem } from '../utils/audioSystem';

const TOTAL_FRAMES = 90;

export function CinematicBottleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const animFrameId = useRef<number>(0);
  const isLoadedRef = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Dynamic filter string for real-time liquid grading
  const [filterStyle, setFilterStyle] = useState('contrast(1.08) brightness(1.06) saturate(1.3)');

  // Mouse tilt tracking for subtle 3D physical depth
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // 1. Preload 90 cinematic slow-motion frames
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/ritual-frames/frame_${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount >= 10 && !isLoadedRef.current) {
          isLoadedRef.current = true;
          drawFrame(0);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    // 2. Mouse move handler for physical parallax tilt
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePosRef.current.targetX = nx * 8; // Max 8px / 4deg tilt
      mousePosRef.current.targetY = ny * 8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3. Draw frame on canvas with retina crispness & aspect fit
    const drawFrame = (frameIdx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const img = imagesRef.current[frameIdx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Aspect contain calculation
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = w / h;

      let drawW: number;
      let drawH: number;
      let offX: number;
      let offY: number;

      // Fit inside viewport with luxury margins (never zoomed in too tight)
      const scaleMultiplier = Math.min(1.0, Math.max(0.72, w / 1100));

      if (canvasAspect > imgAspect) {
        drawH = h * 0.90 * scaleMultiplier;
        drawW = drawH * imgAspect;
      } else {
        drawW = w * 0.92 * scaleMultiplier;
        drawH = drawW / imgAspect;
      }

      // Dynamic horizontal shift across stages (centered in genesis, shifts slightly right when HUD appears)
      const p = scrollStore.progress;
      let stageOffset = 0;
      if (p > 0.12) {
        // Shift bottle rightwards to create gallery balance with left HUD card
        stageOffset = Math.min(w * 0.16, 210);
      }

      offX = (w - drawW) / 2 + stageOffset;
      offY = (h - drawH) / 2 + 10;

      ctx.drawImage(img, offX, offY, drawW, drawH);
      ctx.restore();
    };

    // 4. Smooth 60fps RAF Animation Loop
    let lastProgress = -1;
    let lastPoured = false;

    const renderLoop = () => {
      const p = scrollStore.progress;

      // Smooth lerp frame index to avoid any stutter
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, p * (TOTAL_FRAMES - 1)));
      currentFrameRef.current += (targetFrame - currentFrameRef.current) * 0.16;
      const frameToDraw = Math.round(currentFrameRef.current);

      drawFrame(frameToDraw);

      // Subtle audio feedback during pouring scrub
      const isCurrentlyPouring = p >= 0.22 && p <= 0.70;
      if (isCurrentlyPouring && !lastPoured && Math.abs(p - lastProgress) > 0.005) {
        audioSystem.playPour();
        lastPoured = true;
      } else if (!isCurrentlyPouring) {
        lastPoured = false;
      }
      lastProgress = p;

      // Parallax lerp
      const m = mousePosRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1200px) rotateY(${m.x * 0.35}deg) rotateX(${-m.y * 0.35}deg) translate3d(${m.x * 0.5}px, ${m.y * 0.5}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    // 5. Subscribe to formula updates for real-time liquid grading
    const updateFormulaColor = () => {
      const b = scrollStore.formula.base;
      const c = scrollStore.formula.chill;

      let filter = 'contrast(1.08) brightness(1.06) saturate(1.3)'; // Default Single Malt Amber

      if (b === 'blood_orange') {
        filter = 'contrast(1.12) brightness(1.04) hue-rotate(-22deg) saturate(1.9)';
      } else if (b === 'juniper') {
        filter = 'contrast(1.15) brightness(1.12) saturate(0.06)';
      } else if (b === 'yuzu') {
        filter = 'contrast(1.08) brightness(1.07) saturate(1.35) hue-rotate(4deg)';
      }

      // Add chill filtration effect
      if (c === 'glacial') {
        filter += ' drop-shadow(0 0 12px rgba(200,225,245,0.25))';
      }

      setFilterStyle(filter);
    };

    const unsubscribe = scrollStore.subscribe(updateFormulaColor);
    updateFormulaColor();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-20 flex items-center justify-center overflow-hidden">
      {/* Container with hardware-accelerated 3D parallax and seamless cyclorama blend */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out will-change-transform"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 96%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 96%)',
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            mixBlendMode: 'multiply',
            filter: filterStyle,
            transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Ambient Warm Floor Caustic Shadow */}
        <div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[650px] h-[75px] rounded-[100%] pointer-events-none blur-2xl -z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(184,107,39,0.16) 0%, rgba(35,25,18,0.12) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Progressive Load Indicator (Minimal hairline luxury pill) */}
      {loadProgress < 100 && (
        <div className="absolute bottom-6 right-8 text-[11px] font-mono tracking-widest text-[#171614]/40 uppercase pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B86B27] animate-ping" />
          <span>Cinematic Frames {loadProgress}%</span>
        </div>
      )}
    </div>
  );
}
