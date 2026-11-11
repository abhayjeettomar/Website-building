import * as THREE from 'three';

export interface LiquidPalette {
  deepCore: string;
  body: string;
  glow: string;
  rimHighlight: string;
}

export const LIQUID_PALETTES: Record<string, LiquidPalette> = {
  yuzu: {
    deepCore: '#582103',     // Deep roasted botanical citrus core
    body: '#C25E00',         // Saturated warm liquid amber
    glow: '#F59E0B',         // Radiant glowing citrine
    rimHighlight: '#FEF3C7', // Champagne top meniscus light
  },
  blood_orange: {
    deepCore: '#300508',     // Deep torched gentian amaro core
    body: '#88131B',         // Rich Sicilian ruby
    glow: '#DC2626',         // Vibrant botanical crimson
    rimHighlight: '#FEE2E2', // Rosé top meniscus light
  },
  juniper: {
    deepCore: '#011D17',     // Deep sub-alpine fir core
    body: '#04523B',         // Crisp forest emerald
    glow: '#059669',         // Luminous mint tincture
    rimHighlight: '#D1FAE5', // Glacial top meniscus light
  },
};

// Generates a pure vertical Beer-Lambert volumetric absorption gradient
// Dark, dense, concentrated at the crystal punt base, radiating warm translucency at the surface
export function createLiquidGradientTexture(palette: LiquidPalette): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure vertical light absorption (bottom = dense extract, top = luminous meniscus)
  const vGrad = ctx.createLinearGradient(0, 512, 0, 0);
  vGrad.addColorStop(0.0, palette.deepCore);
  vGrad.addColorStop(0.25, palette.body);
  vGrad.addColorStop(0.78, palette.glow);
  vGrad.addColorStop(0.96, palette.rimHighlight);
  vGrad.addColorStop(1.0, palette.glow);

  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, 128, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
