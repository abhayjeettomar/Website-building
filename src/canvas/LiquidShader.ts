import * as THREE from 'three';

export interface LiquidPalette {
  deepCore: string;
  body: string;
  glow: string;
  rimHighlight: string;
}

export const LIQUID_PALETTES: Record<string, LiquidPalette> = {
  yuzu: {
    deepCore: '#78350F',     // Deep roasted citrus core
    body: '#D97706',         // Warm botanical amber
    glow: '#F59E0B',         // Radiant liquid gold
    rimHighlight: '#FEF3C7', // Champagne meniscus light
  },
  blood_orange: {
    deepCore: '#450A0A',     // Dark torched orange amaro core
    body: '#991B1B',         // Rich Sicilian ruby
    glow: '#DC2626',         // Glowing botanical crimson
    rimHighlight: '#FEE2E2', // Rosé meniscus light
  },
  juniper: {
    deepCore: '#022C22',     // Deep sub-alpine fir core
    body: '#065F46',         // Crisp forest emerald
    glow: '#059669',         // Vibrant mint tincture
    rimHighlight: '#D1FAE5', // Glacial meniscus light
  },
};

export function createLiquidGradientTexture(palette: LiquidPalette): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical light absorption gradient (dark at bottom, glowing towards surface)
  const vGrad = ctx.createLinearGradient(0, 512, 0, 0);
  vGrad.addColorStop(0.0, palette.deepCore);
  vGrad.addColorStop(0.35, palette.body);
  vGrad.addColorStop(0.82, palette.glow);
  vGrad.addColorStop(0.97, palette.rimHighlight);
  vGrad.addColorStop(1.0, palette.glow);

  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Horizontal cylindrical rim scattering (luminous backlit edges, deep optical core)
  const hGrad = ctx.createLinearGradient(0, 0, 256, 0);
  hGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.28)');
  hGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)');
  hGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
  hGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
  hGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.28)');

  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, 256, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

