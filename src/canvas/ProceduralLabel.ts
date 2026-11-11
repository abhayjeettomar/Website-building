import * as THREE from 'three';

export interface LabelController {
  diffuseMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  updateLabel: (customName: string, initials: string, sealColor: string) => void;
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

  function draw(customName = 'AETHER // BESPOKE', initials = 'AT', seal = 'gold') {
    let accentColor = '#B86B27'; // Warm atelier bronze / champagne gold foil
    let sealRing = '#C59B27';
    if (seal === 'noir') {
      accentColor = '#242220';
      sealRing = '#383531';
    } else if (seal === 'copper') {
      accentColor = '#B3542E';
      sealRing = '#C25D34';
    }

    // --- 1. Diffuse Canvas (Luxury Textured Ivory Parchment) ---
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper grain fibers
    ctx.fillStyle = 'rgba(23, 22, 20, 0.035)';
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
    ctx.strokeStyle = 'rgba(23, 22, 20, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Top classification
    ctx.fillStyle = '#6E6961';
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('BESPOKE BOTANICAL ATELIER // NO° 01', 84, 96);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText('PURITY SPEC: 0.0% ABV · BOROSILICATE', width - 84, 96);

    // Divider rule
    ctx.strokeStyle = 'rgba(23, 22, 20, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(84, 120);
    ctx.lineTo(width - 84, 120);
    ctx.stroke();

    // Primary Dynamic Wordmark (User's custom engraved title)
    ctx.fillStyle = '#171614';
    const displayName = (customName || 'AETHER').toUpperCase().slice(0, 24);
    ctx.font = '600 112px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayName, 84, 252);

    // Subtitle
    ctx.fillStyle = '#6E6961';
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
    ctx.font = '600 38px "Instrument Serif", serif';
    ctx.textAlign = 'center';
    ctx.fillText((initials || 'AT').toUpperCase().slice(0, 3), sealX, sealY + 14);

    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A857D';
    ctx.fillText('ENGRAVED ATELIER', sealX, sealY + 98);

    // Swiss Technical Spec Grid (Parchment ink aesthetic)
    const gridY = 380;
    const gridH = 450;
    const colW = (width - 168) / 3;

    ctx.strokeStyle = 'rgba(23, 22, 20, 0.08)';
    ctx.strokeRect(84, gridY, width - 168, gridH);

    ctx.beginPath();
    ctx.moveTo(84 + colW, gridY);
    ctx.lineTo(84 + colW, gridY + gridH);
    ctx.moveTo(84 + colW * 2, gridY);
    ctx.lineTo(84 + colW * 2, gridY + gridH);
    ctx.stroke();

    // Column 1
    ctx.textAlign = 'left';
    ctx.fillStyle = accentColor;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('[ I. DISTILLATE BASE ]', 110, gridY + 50);

    ctx.fillStyle = '#171614';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FRACTIONAL TERPENES', 110, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#5A564F';
    ctx.fillText('Rotary Vacuum Cold Extraction', 110, gridY + 145);
    ctx.fillStyle = '#7E7971';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sub-zero distillation preserves delicate', 110, gridY + 220);
    ctx.fillText('top-note aldehydes and botanical aromatics.', 110, gridY + 252);

    // Column 2
    ctx.fillStyle = accentColor;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('[ II. ADAPTOGEN INFUSION ]', 110 + colW, gridY + 50);

    ctx.fillStyle = '#171614';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ACTIVE NEUROTROPICS', 110 + colW, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#5A564F';
    ctx.fillText('Bio-Enhanced Dual Extract', 110 + colW, gridY + 145);
    ctx.fillStyle = '#7E7971';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Targets serene alpha-wave cognitive flow', 110 + colW, gridY + 220);
    ctx.fillText('without caffeine tension or energy crash.', 110 + colW, gridY + 252);

    // Column 3
    ctx.fillStyle = accentColor;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('[ III. FLINT VESSEL ]', 110 + colW * 2, gridY + 50);

    ctx.fillStyle = '#171614';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('500ML BOROSILICATE', 110 + colW * 2, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#5A564F';
    ctx.fillText('Heavy-Flint Laboratory Glass', 110 + colW * 2, gridY + 145);
    ctx.fillStyle = '#7E7971';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Optical 1.480 index, argon blanket headspace,', 110 + colW * 2, gridY + 220);
    ctx.fillText('knurled airtight gunmetal closure.', 110 + colW * 2, gridY + 252);

    // Bottom Footer
    ctx.fillStyle = '#7E7971';
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText('FORMULATED UNDER INERT ATMOSPHERE // AETHER ATELIER', 84, 915);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText('AUTHENTICATED HANDCRAFT · ZERO ADDITIVES', width - 84, 915);

    // --- 2. Bump Map Canvas ---
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    bCtx.strokeStyle = '#FFFFFF';
    bCtx.lineWidth = 3;
    bCtx.strokeRect(40, 40, width - 80, height - 80);

    bCtx.fillStyle = '#FFFFFF';
    bCtx.font = '600 112px "Syne", "Plus Jakarta Sans", sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText(displayName, 84, 252);

    diffuseMap.needsUpdate = true;
    bumpMap.needsUpdate = true;
  }

  // Initial draw
  draw();

  return {
    diffuseMap,
    bumpMap,
    updateLabel: (customName: string, initials: string, sealColor: string) => {
      draw(customName, initials, sealColor);
    }
  };
}
