import * as THREE from 'three';

export interface LiquidPalette {
  deepCore: string;
  body: string;
  glow: string;
  rimHighlight: string;
}

export const LIQUID_PALETTES: Record<string, LiquidPalette> = {
  yuzu: {
    deepCore: '#B45309',     // Rich roasted Tokushima citrus amber core
    body: '#D97706',         // Saturated warm golden citrine
    glow: '#F59E0B',         // Radiant luminous amber
    rimHighlight: '#FEF3C7', // Champagne golden meniscus light
  },
  blood_orange: {
    deepCore: '#9F1239',     // Deep torched Sicilian amaro core
    body: '#BE123C',         // Saturated botanical crimson ruby
    glow: '#E11D48',         // Radiant vibrant Moro blood orange
    rimHighlight: '#FFE4E6', // Rosé glowing meniscus light
  },
  juniper: {
    deepCore: '#065F46',     // Deep sub-alpine fir core
    body: '#047857',         // Rich forest emerald elixir
    glow: '#059669',         // Luminous vibrant alpine tincture
    rimHighlight: '#D1FAE5', // Glacial glowing meniscus light
  },
};

// Generates an ultra-pure vertical Beer-Lambert volumetric absorption gradient
export function createLiquidGradientTexture(palette: LiquidPalette): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const vGrad = ctx.createLinearGradient(0, 512, 0, 0);
  vGrad.addColorStop(0.0, palette.deepCore);
  vGrad.addColorStop(0.35, palette.body);
  vGrad.addColorStop(0.85, palette.glow);
  vGrad.addColorStop(0.97, palette.rimHighlight);
  vGrad.addColorStop(1.0, palette.glow);

  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, 128, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
