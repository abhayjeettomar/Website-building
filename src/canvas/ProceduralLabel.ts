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

  function draw(customName = 'AETHER', initials = 'AT', seal = 'gold') {
    let accentColor = '#E5A958'; // Champagne Gold
    let sealRing = '#D4AF37';
    if (seal === 'noir') {
      accentColor = '#CCCCCC';
      sealRing = '#888888';
    } else if (seal === 'copper') {
      accentColor = '#E07A5F';
      sealRing = '#C85A32';
    }

    // --- 1. Diffuse (Color) Canvas ---
    ctx.fillStyle = '#08090C';
    ctx.fillRect(0, 0, width, height);

    // Micro-speckle paper grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 12000; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Outer refined hairline borders
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Top laboratory classification
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('BESPOKE APOTHECARY // ALCHEMY NO° 01', 84, 96);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText('BATCH SERIAL: AT-2026-CUSTOM', width - 84, 96);

    // Divider rule
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(84, 120);
    ctx.lineTo(width - 84, 120);
    ctx.stroke();

    // Primary Dynamic Wordmark (User's custom name!)
    ctx.fillStyle = '#F5F5F7';
    const displayName = (customName || 'AETHER').toUpperCase().slice(0, 24);
    ctx.font = '700 120px "Syne", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayName, 84, 255);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ZERO-PROOF COLD-VACUUM BOTANICAL ELIXIR · 500ML', 84, 315);

    // Bespoke Formulation Seal Stamp (Right side)
    const sealX = width - 240;
    const sealY = 240;
    ctx.strokeStyle = sealRing;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = '700 36px "Instrument Serif", serif';
    ctx.textAlign = 'center';
    ctx.fillText((initials || 'AT').toUpperCase().slice(0, 3), sealX, sealY + 12);

    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('SEALED // VERIFIED', sealX, sealY + 98);

    // Swiss Technical Spec Grid
    const gridY = 380;
    const gridH = 450;
    const colW = (width - 168) / 3;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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
    ctx.fillText('[ 01 // DISTILLATE BASE ]', 110, gridY + 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHARRED MOUNTAIN CITRUS', 110, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Wild Yuzu & Cold-Pressed Bergamot', 110, gridY + 145);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('38°C rotary vacuum extraction protects', 110, gridY + 220);
    ctx.fillText('delicate monoterpenes and floral aldehydes.', 110, gridY + 252);

    // Column 2
    ctx.fillStyle = accentColor;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('[ 02 // ADAPTOGEN STACK ]', 110 + colW, gridY + 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('500MG LION\'S MANE', 110 + colW, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Dual-Extract + 200mg L-Theanine', 110 + colW, gridY + 145);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Targets sustained alpha-wave cognitive', 110 + colW, gridY + 220);
    ctx.fillText('flow without caffeine crash or rebound.', 110 + colW, gridY + 252);

    // Column 3
    ctx.fillStyle = accentColor;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText('[ 03 // VESSEL ASSAY ]', 110 + colW * 2, gridY + 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('500ML APOTHECARY', 110 + colW * 2, gridY + 105);
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Heavy-Flint Optical Borosilicate', 110 + colW * 2, gridY + 145);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('4.2mm wall gauge, 1.480 refractive index,', 110 + colW * 2, gridY + 220);
    ctx.fillText('argon-flushed nitrogen headspace blanket.', 110 + colW * 2, gridY + 252);

    // Bottom Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText('FORMULATED UNDER INERT NITROGEN // AETHER BIOLABS ZURICH · TOKYO', 84, 915);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText('0.0% ABV · PURITY CERTIFIED', width - 84, 915);

    // --- 2. Bump Map Canvas ---
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    bCtx.strokeStyle = '#FFFFFF';
    bCtx.lineWidth = 3;
    bCtx.strokeRect(40, 40, width - 80, height - 80);

    bCtx.fillStyle = '#FFFFFF';
    bCtx.font = '700 120px "Syne", "Plus Jakarta Sans", sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText(displayName, 84, 255);

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
