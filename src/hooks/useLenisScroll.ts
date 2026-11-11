import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore } from '../store/scrollStore';

gsap.registerPlugin(ScrollTrigger);

export let globalLenis: Lenis | null = null;

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Lenis v1.1.x: snappy, responsive smooth scroll with zero dead-lag
    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.65,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.35,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      scrollStore.velocity = e.velocity || 0;
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Mouse parallax tracking for high-fidelity interactive tilt
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      scrollStore.cursor.x = nx;
      scrollStore.cursor.y = ny;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);
}
