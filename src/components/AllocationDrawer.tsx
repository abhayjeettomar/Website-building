import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { scrollStore, AllocationTier } from '../store/scrollStore';

export function AllocationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState<AllocationTier>('ritual');
  const [quantity, setQuantity] = useState(1);
  const [includeGlassware, setIncludeGlassware] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');

  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      setIsOpen(scrollStore.isDrawerOpen);
      setTier(scrollStore.selectedTier);
    });
    return unsub;
  }, []);

  const tierPrices: Record<AllocationTier, { name: string; price: number; bottles: number }> = {
    single: { name: 'THE SINGLE VESSEL (500mL)', price: 58, bottles: 1 },
    ritual: { name: 'THE RITUAL CASE (3 × 500mL)', price: 156, bottles: 3 },
    vault: { name: 'THE FOUNDERS\' VAULT (6 × 500mL)', price: 290, bottles: 6 },
  };

  const handleClose = () => {
    scrollStore.setDrawerOpen(false);
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    setSerialNumber(`AETH-2026-B04-${randomHex}`);
    setIsConfirmed(true);
  };

  const subtotal = tierPrices[tier].price * quantity;
  const shipping = 0; // Complimentary
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0B0E] border-l border-white/[0.09] shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-[#F5F5F7] overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] text-[#F4B860] uppercase tracking-widest">
                  LABORATORY RESERVATION // BATCH 04
                </span>
                <h3 className="font-display font-bold text-2xl text-[#F5F5F7] mt-0.5">
                  Allocation Dossier
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-[#8E9099] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            {!isConfirmed ? (
              <div className="mt-6 space-y-6">
                {/* Selected Tier Banner */}
                <div className="p-4 rounded-xl border border-white/[0.09] bg-white/[0.02]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-[#8E9099]">SELECTED ALLOCATION:</span>
                    <span className="font-mono text-xs text-[#F4B860] font-bold">${tierPrices[tier].price}</span>
                  </div>
                  <div className="font-display font-bold text-lg text-[#F5F5F7]">
                    {tierPrices[tier].name}
                  </div>
                  <div className="font-mono text-[11px] text-[#686A73] mt-1">
                    {tierPrices[tier].bottles * quantity} Bottles Total · 500mL Each · 0.0% ABV
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-black/40">
                  <span className="font-mono text-xs text-[#8E9099]">ALLOCATION QUANTITY:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-white/[0.1] bg-white/[0.03] text-sm hover:bg-white/[0.08] flex items-center justify-center font-mono font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold w-6 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-8 h-8 rounded-lg border border-white/[0.1] bg-white/[0.03] text-sm hover:bg-white/[0.08] flex items-center justify-center font-mono font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Complimentary Accessory Toggle */}
                <div
                  onClick={() => setIncludeGlassware(!includeGlassware)}
                  className="flex items-start space-x-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] cursor-pointer hover:border-white/[0.16] transition-colors"
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    includeGlassware ? 'border-[#F4B860] bg-[#F4B860]' : 'border-white/[0.2]'
                  }`}>
                    {includeGlassware && <Check size={12} className="text-[#050506] stroke-[3]" />}
                  </div>
                  <div>
                    <div className="font-mono text-xs font-semibold text-[#F5F5F7]">
                      Include Silicone King-Cube Ice Mold
                    </div>
                    <div className="font-sans text-[11px] text-[#8E9099] mt-0.5">
                      Custom 2-inch artisanal cube mold calibrated for Stage 4 "Over Ice" serve ritual. ($0.00)
                    </div>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-2 border-t border-white/[0.08] pt-4 font-mono text-xs">
                  <div className="flex justify-between text-[#8E9099]">
                    <span>SUBTOTAL:</span>
                    <span className="text-[#F5F5F7]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8E9099]">
                    <span>COLD-CHAIN SHIPPING:</span>
                    <span className="text-[#F4B860]">COMPLIMENTARY ($0.00)</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#F5F5F7] border-t border-white/[0.08] pt-3">
                    <span>ESTIMATED DUE TODAY:</span>
                    <span className="text-[#F4B860]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg font-mono text-[10px] text-[#686A73] flex items-center space-x-2">
                  <ShieldCheck size={14} className="text-[#22C55E]" />
                  <span>BATCH 04 IS FULLY INSURED · GUARANTEED REFUND WINDOW</span>
                </div>
              </div>
            ) : (
              /* Confirmation Screen */
              <div className="mt-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-[#F4B860] bg-[#F4B860]/10 mx-auto flex items-center justify-center">
                  <Sparkles size={28} className="text-[#F4B860]" />
                </div>

                <div>
                  <span className="font-mono text-xs text-[#22C55E] uppercase tracking-widest">
                    RESERVATION CONFIRMED
                  </span>
                  <h4 className="font-display font-bold text-2xl text-[#F5F5F7] mt-1">
                    Allocation Vault Assigned
                  </h4>
                  <p className="font-sans text-xs text-[#8E9099] mt-2 leading-relaxed">
                    Your allocation for Batch N° 04 has been authenticated in the AETHER Zurich bio-distillery vault registry.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#F4B860]/40 bg-[#F4B860]/[0.05] font-mono">
                  <div className="text-[10px] text-[#8E9099] uppercase tracking-wider">OFFICIAL SERIAL NUMBER</div>
                  <div className="text-lg font-bold text-[#F4B860] tracking-widest mt-1">
                    {serialNumber}
                  </div>
                  <div className="text-[10px] text-[#686A73] mt-1">SECURE NITROGEN STORAGE BATCH 04</div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-full border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  RETURN TO SHOWCASE
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer CTA */}
          {!isConfirmed && (
            <div className="pt-6 border-t border-white/[0.08]">
              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-full bg-[#F5F5F7] hover:bg-[#F4B860] text-[#050506] font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(244,184,96,0.3)]"
              >
                <span>CONFIRM BATCH 04 RESERVATION</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

