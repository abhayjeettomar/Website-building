import * as THREE from 'three';

export interface LabelTextures {
  diffuseMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

export function createProceduralLabel(): LabelTextures {
  const width = 2048;
  const height = 1024;

  // --- 1. Diffuse (Color) Map ---
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const ctx = diffuseCanvas.getContext('2d')!;

  // Base luxury paper texture: deep obsidian with subtle micro-grain
  ctx.fillStyle = '#08090C';
  ctx.fillRect(0, 0, width, height);

  // Micro-speckle paper grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 15000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Double hairline champagne gold outer border
  ctx.strokeStyle = '#F4B860';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(244, 184, 96, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  // Corner registration tick marks
  const tickLen = 24;
  ctx.strokeStyle = '#F4B860';
  ctx.lineWidth = 2;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(30, 50); ctx.lineTo(50, 50);
  ctx.moveTo(50, 30); ctx.lineTo(50, 50);
  // Top-right
  ctx.moveTo(width - 30, 50); ctx.lineTo(width - 50, 50);
  ctx.moveTo(width - 50, 30); ctx.lineTo(width - 50, 50);
  // Bottom-left
  ctx.moveTo(30, height - 50); ctx.lineTo(50, height - 50);
  ctx.moveTo(50, height - 30); ctx.lineTo(50, height - 50);
  // Bottom-right
  ctx.moveTo(width - 30, height - 50); ctx.lineTo(width - 50, height - 50);
  ctx.moveTo(width - 50, height - 30); ctx.lineTo(width - 50, height - 50);
  ctx.stroke();

  // Top laboratory header
  ctx.fillStyle = '#8E9099';
  ctx.font = '500 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('COLLECTION 001 // LABORATORY SPECIFICATION', 74, 95);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#F4B860';
  ctx.fillText('BATCH N° 04 · ALLOCATION 2026', width - 74, 95);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(74, 120);
  ctx.lineTo(width - 74, 120);
  ctx.stroke();

  // Giant Editorial Wordmark: AETHER // 001
  ctx.fillStyle = '#F5F5F7';
  ctx.font = '800 135px "Syne", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.letterSpacing = '-4px';
  ctx.fillText('AETHER', 74, 260);

  ctx.fillStyle = '#F4B860';
  ctx.font = '700 80px "Syne", sans-serif';
  ctx.fillText('// 001', 780, 260);

  // Subtitle / Formula classification
  ctx.fillStyle = '#8E9099';
  ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('ZERO-PROOF NEURO-BOTANICAL & SMOKED YUZU ELIXIR', 76, 318);

  ctx.fillStyle = '#D97724';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('COLD-VACUUM FRACTIONAL DISTILLATION · 0.0% ABV', 76, 356);

  // Middle Architectural Spec Table (Swiss 1px Hairlines)
  const gridY = 410;
  const gridH = 430;
  const colW = (width - 148) / 3;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.strokeRect(74, gridY, width - 148, gridH);

  // Vertical column dividers
  ctx.beginPath();
  ctx.moveTo(74 + colW, gridY);
  ctx.lineTo(74 + colW, gridY + gridH);
  ctx.moveTo(74 + colW * 2, gridY);
  ctx.lineTo(74 + colW * 2, gridY + gridH);
  ctx.stroke();

  // Column 1: CORTEX / NOOTROPIC
  ctx.fillStyle = '#F4B860';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('[ 01 // CORTEX MATRIX ]', 100, gridY + 50);

  ctx.fillStyle = '#F5F5F7';
  ctx.font = '700 36px "Syne", sans-serif';
  ctx.fillText('500MG LION\'S MANE', 100, gridY + 110);
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#8E9099';
  ctx.fillText('+ 200mg L-Theanine Blend', 100, gridY + 155);

  ctx.fillStyle = '#686A73';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dual fruiting-body extraction for', 100, gridY + 230);
  ctx.fillText('enhanced neuro-genesis and calm,', 100, gridY + 262);
  ctx.fillText('uncluttered alpha-wave velocity.', 100, gridY + 294);

  ctx.fillStyle = '#F4B860';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('REFRACTIVE ASSAY: 1.480 IOR', 100, gridY + 365);

  // Column 2: BOTANICAL / TERPENES
  ctx.fillStyle = '#F4B860';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('[ 02 // VOLATILE PROFILE ]', 100 + colW, gridY + 50);

  ctx.fillStyle = '#F5F5F7';
  ctx.font = '700 36px "Syne", sans-serif';
  ctx.fillText('SMOKED YUZU PEEL', 100 + colW, gridY + 110);
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#8E9099';
  ctx.fillText('Schisandra & Wild Damiana', 100 + colW, gridY + 155);

  ctx.fillStyle = '#686A73';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Charred Japanese mountain citrus,', 100 + colW, gridY + 230);
  ctx.fillText('five-flavor adaptogenic berries,', 100 + colW, gridY + 262);
  ctx.fillText('and aromatic terpene fractions.', 100 + colW, gridY + 294);

  ctx.fillStyle = '#F4B860';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('VACUUM BOIL: 38°C / -0.08 BAR', 100 + colW, gridY + 365);

  // Column 3: VESSEL & ALLOCATION
  ctx.fillStyle = '#F4B860';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('[ 03 // APOTHECARY VESSEL ]', 100 + colW * 2, gridY + 50);

  ctx.fillStyle = '#F5F5F7';
  ctx.font = '700 36px "Syne", sans-serif';
  ctx.fillText('500ML / 16.9 FL OZ', 100 + colW * 2, gridY + 110);
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#8E9099';
  ctx.fillText('Heavy-Flint High Density', 100 + colW * 2, gridY + 155);

  ctx.fillStyle = '#686A73';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Deep optical punt architecture,', 100 + colW * 2, gridY + 230);
  ctx.fillText('argon-flushed headspace seal, and', 100 + colW * 2, gridY + 262);
  ctx.fillText('sub-4°C thermal holding capacity.', 100 + colW * 2, gridY + 294);

  ctx.fillStyle = '#F4B860';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('SERIAL N°: AETH-2026-B04-8842', 100 + colW * 2, gridY + 365);

  // Bottom Footer Bar on Label
  ctx.fillStyle = '#F5F5F7';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('DISTILLED & BOTTLED UNDER NITROGEN BLANKET // AETHER LABS ZURICH · TOKYO', 74, 910);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#D97724';
  ctx.fillText('ALCOHOL FREE · FORMULA CERTIFIED', width - 74, 910);

  // --- 2. Bump Map (High-Contrast Height/Emboss Map) ---
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Neutral mid-gray base
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);

  // Embossed gold borders and lettering in pure white for bump elevation
  bCtx.strokeStyle = '#FFFFFF';
  bCtx.lineWidth = 4;
  bCtx.strokeRect(36, 36, width - 72, height - 72);

  bCtx.fillStyle = '#FFFFFF';
  bCtx.font = '800 135px "Syne", "Plus Jakarta Sans", sans-serif';
  bCtx.textAlign = 'left';
  bCtx.fillText('AETHER', 74, 260);

  bCtx.font = '700 80px "Syne", sans-serif';
  bCtx.fillText('// 001', 780, 260);

  // Spec table borders
  bCtx.strokeStyle = '#D0D0D0';
  bCtx.lineWidth = 2;
  bCtx.strokeRect(74, gridY, width - 148, gridH);
  bCtx.beginPath();
  bCtx.moveTo(74 + colW, gridY);
  bCtx.lineTo(74 + colW, gridY + gridH);
  bCtx.moveTo(74 + colW * 2, gridY);
  bCtx.lineTo(74 + colW * 2, gridY + gridH);
  bCtx.stroke();

  const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
  diffuseMap.anisotropy = 16;
  diffuseMap.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.anisotropy = 16;

  return { diffuseMap, bumpMap };
}

