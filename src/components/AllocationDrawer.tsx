import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
  const shipping = 0;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08090C] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-[#F5F5F7] overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] text-[#E5A958] uppercase tracking-widest">
                  LABORATORY RESERVATION // BATCH 04
                </span>
                <h3 className="font-sans font-medium text-xl text-white mt-1">
                  Allocation Dossier
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Body */}
            {!isConfirmed ? (
              <div className="mt-6 space-y-6">
                {/* Selected Tier Banner */}
                <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.015]">
                  <div className="flex justify-between items-start mb-1 font-mono text-[11px]">
                    <span className="text-white/40">SELECTED ALLOCATION:</span>
                    <span className="text-[#E5A958] font-medium">${tierPrices[tier].price}</span>
                  </div>
                  <div className="font-sans font-medium text-base text-white">
                    {tierPrices[tier].name}
                  </div>
                  <div className="font-mono text-[10px] text-white/35 mt-0.5">
                    {tierPrices[tier].bottles * quantity} Bottles Total · 500mL Each · 0.0% ABV
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.08] bg-black/40">
                  <span className="font-mono text-xs text-white/50">ALLOCATION QUANTITY:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded border border-white/[0.08] bg-white/[0.03] text-sm hover:bg-white/[0.08] flex items-center justify-center font-mono"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-medium w-6 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-7 h-7 rounded border border-white/[0.08] bg-white/[0.03] text-sm hover:bg-white/[0.08] flex items-center justify-center font-mono"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Accessory Toggle */}
                <div
                  onClick={() => setIncludeGlassware(!includeGlassware)}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-white/[0.08] bg-white/[0.015] cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                    includeGlassware ? 'border-[#E5A958] bg-[#E5A958]' : 'border-white/20'
                  }`}>
                    {includeGlassware && <Check size={10} className="text-[#050506] stroke-[3]" />}
                  </div>
                  <div>
                    <div className="font-sans font-medium text-xs text-white">
                      Include Silicone King-Cube Ice Mold
                    </div>
                    <div className="font-sans text-[11px] text-white/45 mt-0.5 font-light">
                      Custom 2-inch artisanal mold calibrated for Stage 4 "Over Ice" serve ritual. ($0.00)
                    </div>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-2 border-t border-white/[0.08] pt-4 font-mono text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>SUBTOTAL:</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>COLD-CHAIN SHIPPING:</span>
                    <span className="text-[#E5A958]">COMPLIMENTARY ($0.00)</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-white border-t border-white/[0.08] pt-3">
                    <span>ESTIMATED TOTAL:</span>
                    <span className="text-[#E5A958]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded font-mono text-[10px] text-white/40 flex items-center space-x-2">
                  <ShieldCheck size={13} className="text-[#E5A958]" />
                  <span>BATCH 04 FULLY INSURED · GUARANTEED REFUND WINDOW</span>
                </div>
              </div>
            ) : (
              /* Confirmation Screen */
              <div className="mt-8 text-center space-y-6">
                <div className="w-14 h-14 rounded-full border border-[#E5A958]/30 bg-[#E5A958]/10 mx-auto flex items-center justify-center">
                  <Sparkles size={24} className="text-[#E5A958]" />
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#E5A958] uppercase tracking-widest">
                    RESERVATION CONFIRMED
                  </span>
                  <h4 className="font-sans font-medium text-xl text-white mt-1">
                    Allocation Vault Assigned
                  </h4>
                  <p className="font-sans text-xs text-white/50 mt-2 leading-relaxed font-light">
                    Your allocation for Batch N° 04 has been authenticated in the AETHER Zurich bio-distillery vault registry.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-[#E5A958]/30 bg-[#E5A958]/[0.03] font-mono">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">OFFICIAL SERIAL NUMBER</div>
                  <div className="text-base font-medium text-[#E5A958] tracking-widest mt-1">
                    {serialNumber}
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">NITROGEN BLANKET STORAGE · BATCH 04</div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] font-mono text-xs uppercase tracking-wider transition-colors"
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
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#E5A958] text-[#050506] font-mono font-medium text-xs uppercase tracking-[0.18em] transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>CONFIRM BATCH 04 RESERVATION</span>
                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
