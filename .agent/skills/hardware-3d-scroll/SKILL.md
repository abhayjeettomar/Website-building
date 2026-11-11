---
name: hardware-3d-scroll
description: Rules, architectures, and implementation patterns for ultra-premium hardware showcase scroll animations (inspired by Apple, Teenage Engineering, Opal, and high-end industrial design presentations).
---

# Hardware 3D Scroll Animation Skill

This skill defines the technical, visual, and architectural requirements for building cinematic, award-winning hardware product scroll-scrub experiences.

---

## 1. Core Architecture & Scroll Synchronization

### Lenis + GSAP ScrollTrigger Synchronization
Smooth inertia scrolling must be decoupled from default browser jank and synchronized frame-for-frame with GSAP ScrollTrigger.

```javascript
// Canonical Lenis + GSAP ScrollTrigger Setup
import Lenis from '@studio-freight/lenis'; // or cdnjs / unpkg @studio-freight/lenis
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
});

// Bridge Lenis scroll events to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Direct GSAP ticker to drive Lenis RAF
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Turn off GSAP lag smoothing to eliminate micro-stutters during rapid scrubbing
gsap.ticker.lagSmoothing(0);
```

---

## 2. Canvas Frame-Sequence Scrubbing (Apple Showcase Pattern)

For photorealistic pre-rendered 3D hardware footage (e.g. Cinema4D / Blender / Octane / Redshift exports):
- **Preloading:** Load sequential frames (PNG/WebP) with a background loader and progressive display (first frame renders instantly).
- **High-DPI Retina Support:** Scale canvas buffer by `window.devicePixelRatio` while keeping CSS size responsive.
- **Aspect Fit / Cover:** Calculate letterboxing or cover dimensions so the hardware remains centered and distortion-free across viewports.
- **Scroll Pinning:** Pin a `100vh` sticky stage with a parent scroll container (e.g. `height: 500vh` to `800vh`) providing ample scrub travel.

```javascript
// Canvas Scrubbing Example
const canvas = document.getElementById('hardware-canvas');
const ctx = canvas.getContext('2d');
const frameCount = 120; // Number of frames
const images = [];
const hardware = { frame: 0 };

// Preload images into memory
function preloadImages() {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    images.push(img);
  }
}

// Render active frame to canvas with aspect-cover math
function renderFrame(index) {
  const img = images[index];
  if (!img || !img.complete) return;
  
  const dpr = window.devicePixelRatio || 1;
  const cw = canvas.width;
  const ch = canvas.height;
  
  ctx.clearRect(0, 0, cw, ch);
  
  // Object-fit: contain (or cover) math
  const imgRatio = img.width / img.height;
  const canvasRatio = cw / ch;
  let renderW, renderH, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    renderH = ch;
    renderW = ch * imgRatio;
    offsetX = (cw - renderW) / 2;
    offsetY = 0;
  } else {
    renderW = cw;
    renderH = cw / imgRatio;
    offsetX = 0;
    offsetY = (ch - renderH) / 2;
  }
  
  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}

// GSAP Scrubbing
gsap.to(hardware, {
  frame: frameCount - 1,
  snap: 'frame',
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero-scroll-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: () => renderFrame(hardware.frame),
  }
});
```

---

## 3. Realtime 3D (React Three Fiber / Three.js) Standards

When rendering dynamic geometry or interactive GLTF/USDZ models:
- **Tone Mapping:** Always set `renderer.toneMapping = THREE.ACESFilmicToneMapping` and `renderer.toneMappingExposure = 1.0` to avoid blown-out specular highlights on metallic edges.
- **Color Space:** Output encoding must be `THREE.SRGBColorSpace`.
- **Lighting & Studio HDRI:**
  - Avoid flat ambient lights.
  - Use `<Environment preset="studio" />` or a custom dark studio HDRI with sharp rim lights (`directionalLight` with intensity 3–5) to illuminate chamfered aluminum edges and knurled dials.
  - Use `MeshPhysicalMaterial` for camera optics:
    - `roughness: 0.05`
    - `transmission: 0.96`
    - `ior: 1.52` (optical crown glass)
    - `thickness: 1.2`
    - `clearcoat: 1.0`
    - `clearcoatRoughness: 0.1`
  - Anodized space-black / obsidian metal body:
    - `color: '#121212'`
    - `metalness: 0.85`
    - `roughness: 0.28`

---

## 4. Anti-AI-Slop & Industrial Design Rules

### A. Color Palette: The Obsidian Discipline
- **Backgrounds:** Pure obsidian `#000000`, deep charcoal `#070707`, tinted slate `#0c0d0e`.
- **Borders & Dividers:** Subtle, hairline 1px borders with low-opacity white: `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.14)`.
- **Card Surfaces:** Dark frosted glass `rgba(18, 18, 20, 0.7)` with `backdrop-filter: blur(20px)` and subtle top highlight `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1)`.
- **Text:**
  - Primary: `#f3f4f6` (pure crisp off-white)
  - Secondary: `#9ca3af` (neutral mid-gray)
  - Tertiary / Muted: `#52525b` (recessed technical slate)
- **STRICT FORBIDDEN:**
  - NO purple/cyan neon drop shadows.
  - NO garish rainbow linear gradients.
  - NO bubbly floating rounded elements.

### B. Typography & Letter Spacing
- **Display Headlines:**
  - Tight tracking: `letter-spacing: -0.04em` to `-0.03em`.
  - Font choices: Geist, Space Grotesk, Inter Tight, Syne, SF Pro Display.
  - Font weight: 600 (SemiBold) or 500 (Medium) — avoid ultra-heavy 900 weights that feel clumsy.
- **Overline / Micro-Labels:**
  - Monospace or uppercase tracking: `text-transform: uppercase`, `letter-spacing: 0.15em` to `0.2em`, font size `10px`–`12px`, weight 500.
- **Technical Telemetry Specs:**
  - Monospace font family (`ui-monospace`, `JetBrains Mono`, `SF Mono`).
  - Labeled with colon notation: `SENSOR // 4K 1/1.8" SONY STARVIS`, `OPTICS // 6-ELEMENT GLASS f/1.8`.

### C. Sticky Viewport Stages & Choreography
- Pinned stages must occupy exactly `100vh` (`h-screen`) and `100vw`.
- Overlays must fade cleanly with `autoAlpha` (opacity + visibility toggle) so off-stage cards do not capture mouse events.
- Synchronize text progression with physical model transformations:
  1. **Stage 1 (0%–20%):** Pristine hero silhouette & product nomenclature.
  2. **Stage 2 (20%–45%):** Frontal zoom into multi-element optical glass & aperture diaphragm.
  3. **Stage 3 (45%–75%):** Exploded mechanical view / internal thermal architecture / sensor assembly.
  4. **Stage 4 (75%–100%):** Reassembly, desktop mount docking, technical telemetry & pre-order CTA.

