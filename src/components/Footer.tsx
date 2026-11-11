import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { globalLenis } from '../hooks/useLenisScroll';

export function Footer() {
  const [times, setTimes] = useState({
    zurich: '',
    tokyo: '',
    newyork: '',
    utc: '',
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      const formatTime = (timeZone: string) => {
        return new Intl.DateTimeFormat('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now);
      };

      setTimes({
        zurich: formatTime('Europe/Zurich'),
        tokyo: formatTime('Asia/Tokyo'),
        newyork: formatTime('America/New_York'),
        utc: formatTime('UTC'),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBackToTop = () => {
    if (globalLenis) {
      globalLenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-30 border-t border-white/[0.08] bg-[#050506] pt-16 pb-20 px-6 sm:px-12 text-[#F5F5F7] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* World Clocks Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-12 border-b border-white/[0.08] font-mono text-xs">
          <div>
            <div className="text-[#686A73] uppercase tracking-wider mb-1">ZURICH BIO-LABS</div>
            <div className="text-[#F5F5F7] text-sm font-semibold tabular-nums">{times.zurich || '12:00:00'} CET</div>
          </div>
          <div>
            <div className="text-[#686A73] uppercase tracking-wider mb-1">TOKYO BOTANICAL</div>
            <div className="text-[#F5F5F7] text-sm font-semibold tabular-nums">{times.tokyo || '20:00:00'} JST</div>
          </div>
          <div>
            <div className="text-[#686A73] uppercase tracking-wider mb-1">NEW YORK DISPENSARY</div>
            <div className="text-[#F5F5F7] text-sm font-semibold tabular-nums">{times.newyork || '06:00:00'} EST</div>
          </div>
          <div>
            <div className="text-[#686A73] uppercase tracking-wider mb-1">COORDINATED TIME</div>
            <div className="text-[#F4B860] text-sm font-semibold tabular-nums">{times.utc || '11:00:00'} UTC</div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-white/[0.08] font-mono text-xs">
          <div>
            <div className="text-[#F4B860] uppercase tracking-widest mb-4">SPECIFICATIONS</div>
            <ul className="space-y-2.5 text-[#8E9099]">
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">GC-MS Assay Reports</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Terpene Fraction Certificates</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Optical Glass Safety Dossier</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Vacuum Distillation Patents</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[#F4B860] uppercase tracking-widest mb-4">DISTRIBUTION</div>
            <ul className="space-y-2.5 text-[#8E9099]">
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Michelin Star Stockists</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Private Member Cellars</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Tokyo Flagship Apothecary</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Zurich Bio-Distillery Tours</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[#F4B860] uppercase tracking-widest mb-4">LEGAL ASSAY</div>
            <ul className="space-y-2.5 text-[#8E9099]">
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">0.0% ABV Certification</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">FDA Dietary Compliance</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">EFSA Botanical Purity</a></li>
              <li><a href="#" className="hover:text-[#F5F5F7] transition-colors">Allocation Terms & Vault Vaults</a></li>
            </ul>
          </div>

          <div className="flex flex-col justify-between items-start md:items-end">
            <div>
              <div className="text-[#F4B860] uppercase tracking-widest mb-2">SCROLL SYSTEM</div>
              <p className="font-sans text-xs text-[#8E9099] max-w-xs font-light">
                Rendered with ACES Filmic Tone Mapping and synchronized Lenis + GSAP inertia frame pacing.
              </p>
            </div>

            <button
              onClick={handleBackToTop}
              className="mt-6 inline-flex items-center space-x-2 px-4 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#F4B860]/40 transition-all text-[#F5F5F7] font-mono text-xs uppercase tracking-wider"
            >
              <span>BACK TO TOP [00.0%]</span>
              <ArrowUp size={13} className="text-[#F4B860]" />
            </button>
          </div>
        </div>

        {/* Massive Edge-to-Edge Watermark */}
        <div className="pt-12 select-none overflow-hidden text-center">
          <div className="font-display font-extrabold text-[clamp(2.8rem,11vw,11.5rem)] tracking-[-0.04em] leading-none text-white/[0.03] hover:text-white/[0.06] transition-colors">
            AETHER // LABS
          </div>
        </div>

        {/* Bottom Micro-Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-[#686A73] border-t border-white/[0.04]">
          <div>
            © 2026 AETHER BOTANICAL BIOLABS AG. ALL RIGHTS RESERVED.
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span>ZERO-PROOF FORMULA</span>
            <span>·</span>
            <span>HEAVY-FLINT APOTHECARY</span>
            <span>·</span>
            <span>ZURICH · TOKYO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

