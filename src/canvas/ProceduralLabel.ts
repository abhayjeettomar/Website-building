import * as THREE from 'three';

export interface LabelController {
  diffuseMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  updateLabel: (customName: string, initials: string, sealColor: string, paperStyle?: string, batchYear?: string) => void;
}

export function createProceduralLabel(): LabelController {
  const width = 2048;
  const height = 1024;

  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const ctx = diffuseCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
  diffuseMap.anisotropy = 16;
  diffuseMap.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 16;

  function draw(
    customName = 'AETHER // BESPOKE',
    initials = 'AT',
    seal = 'brass',
    paperStyle = 'ivory',
    batchYear = '2026 // CASK 01'
  ) {
    let accentColor = '#B86B27'; // Warm atelier bronze / champagne gold foil
    let sealRing = '#C59B27';
    if (seal === 'noir') {
      accentColor = '#242220';
      sealRing = '#383531';
    } else if (seal === 'copper') {
      accentColor = '#B3542E';
      sealRing = '#C25D34';
    } else if (seal === 'silver') {
      accentColor = '#8A8D93';
      sealRing = '#A8ABB2';
    } else if (seal === 'gold') {
      accentColor = '#D4AF37';
      sealRing = '#F5D061';
    }

    // Paper background tones
    let bgColor = '#FAF7F0';
    let primaryTextColor = '#171614';
    let secondaryTextColor = '#6E6961';

    if (paperStyle === 'noir') {
      bgColor = '#141312';
      primaryTextColor = '#FAF7F0';
      secondaryTextColor = '#8E8A82';
      accentColor = '#E5A84B';
      sealRing = '#F4B860';
    } else if (paperStyle === 'washi') {
      bgColor = '#F4EFEB';
      primaryTextColor = '#1A1816';
      secondaryTextColor = '#6B665E';
    }

    // --- 1. Diffuse Canvas ---
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle paper grain fibers
    ctx.fillStyle = paperStyle === 'noir' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(23, 22, 20, 0.035)';
    for (let i = 0; i < 9000; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1.2, 1.2);
    }

    // Outer hot-stamped foil border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Inner hairline border
    ctx.strokeStyle = paperStyle === 'noir' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(23, 22, 20, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Top classification
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('BESPOKE BOTANICAL ATELIER // NO° 01', 84, 96);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText(`PURITY: 0.0% ABV · ${batchYear}`, width - 84, 96);

    // Divider rule
    ctx.strokeStyle = paperStyle === 'noir' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(23, 22, 20, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(84, 120);
    ctx.lineTo(width - 84, 120);
    ctx.stroke();

    // Primary Dynamic Wordmark (User's custom engraved title)
    ctx.fillStyle = primaryTextColor;
    const displayName = (customName || 'AETHER').toUpperCase().slice(0, 24);
    ctx.font = '600 112px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayName, 84, 252);

    // Subtitle
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('COLD-VACUUM FRACTIONAL DISTILLATE · 500ML', 84, 312);

    // Bespoke Formulation Monogram Stamp (Right side)
    const sealX = width - 240;
    const sealY = 240;
    ctx.strokeStyle = sealRing;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = '600 52px "Instrument Serif", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((initials || 'AT').toUpperCase().slice(0, 3), sealX, sealY);
    ctx.textBaseline = 'alphabetic';

    // Technical laboratory formulation metrics grid
    ctx.font = '400 17px "JetBrains Mono", monospace';
    ctx.fillStyle = secondaryTextColor;

    ctx.textAlign = 'left';
    ctx.fillText('// BOTTLING SPEC', 84, 430);
    ctx.fillStyle = primaryTextColor;
    ctx.fillText('FRACTIONAL TERPENES', 84, 460);
    ctx.fillText('Dual-Vacuum Distillate 500mL', 84, 485);

    ctx.fillStyle = secondaryTextColor;
    ctx.fillText('// ACTIVE BIOACTIVES', 520, 430);
    ctx.fillStyle = primaryTextColor;
    ctx.fillText('ADAPTOGENIC MATRIX', 520, 460);
    ctx.fillText('Alpha-Wave Cognitive Infusion', 520, 485);

    ctx.fillStyle = secondaryTextColor;
    ctx.fillText('// VESSEL VESICULATION', 960, 430);
    ctx.fillStyle = primaryTextColor;
    ctx.fillText('BOROSILICATE FLINT', 960, 460);
    ctx.fillText('100% UV Protective Flint', 960, 485);

    // Bottom authenticity strip
    ctx.strokeStyle = paperStyle === 'noir' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(23, 22, 20, 0.1)';
    ctx.beginPath();
    ctx.moveTo(84, 520);
    ctx.lineTo(width - 84, 520);
    ctx.stroke();

    ctx.fillStyle = secondaryTextColor;
    ctx.font = '400 16px "JetBrains Mono", monospace';
    ctx.fillText('ATELIER REGISTER: KYOTO · TOKYO · NEW YORK · PARIS', 84, 555);
    ctx.textAlign = 'right';
    ctx.fillText('COLD-CHAIN VERIFIED // CERTIFICATE ENCLOSED', width - 84, 555);

    diffuseMap.needsUpdate = true;

    // --- 2. Bump Map (Tactile Letterpress Embossing) ---
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    // Embossed wordmark
    bCtx.fillStyle = '#FFFFFF';
    bCtx.font = '600 112px "Syne", "Plus Jakarta Sans", sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText(displayName, 84, 252);

    // Embossed Monogram
    bCtx.strokeStyle = '#FFFFFF';
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.arc(sealX, sealY, 70, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.font = '600 52px "Instrument Serif", serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText((initials || 'AT').toUpperCase().slice(0, 3), sealX, sealY);
    bCtx.textBaseline = 'alphabetic';

    // Embossed borders
    bCtx.strokeStyle = '#D0D0D0';
    bCtx.lineWidth = 2.5;
    bCtx.strokeRect(40, 40, width - 80, height - 80);

    diffuseMap.needsUpdate = true;
    bumpMap.needsUpdate = true;
  }

  // Draw initial default
  draw();

  return {
    diffuseMap,
    bumpMap,
    updateLabel: (customName: string, initials: string, sealColor: string, paperStyle?: string, batchYear?: string) => {
      draw(customName, initials, sealColor, paperStyle, batchYear);
    },
  };
}
