# Stellavis 3D Hardware Scroll-Animation — Build Specification
**Reference:** [Dribbble: Stellavis Webcam Website Scroll Animation by Adam Gotfryd for Riotters](https://dribbble.com/shots/23775115-Stellavis-Webcam-Website-Scroll-Animation)  
**Status:** Pre-Build Specification Approved & Ready for Generation  
**Target:** 1:1 Fidelity Cinematic Hardware Scroll Showcase

---

## 1. Executive Summary & Design DNA

The Stellavis showcase is an ultra-premium, industrial-design-led web experience inspired by iconic hardware studios (Teenage Engineering, Opal Camera, Braun/Dieter Rams, and Apple). The experience centers on a single continuous, pinned viewport scroll choreography where physical camera movements seamlessly narrate the product's optical engineering, acoustic design, and finish choices.

### Key Design Pillars
- **Zero AI-Slop:** Strict industrial color discipline. High-contrast typography, razor-sharp specular highlights on anodized aluminum and multi-element glass, and physical tactile controls.
- **Continuous Scrubbed Storytelling:** The viewport remains pinned (`100vh`) while the user scrubs through 5 choreographed acts, from the master isometric hero array down to individual glass lens elements and an interactive colorway configurator.
- **Inertia-Driven Smoothness:** Lenis smooth scrolling synced frame-for-frame with GSAP ScrollTrigger and zero lag-smoothing jitter.

---

## 2. Color Palette & Design Tokens

### Color Tokens
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-hero-floor` | `#FF4E26` / `#FF5533` | Hero isometric stage floor, vibrant saturated international orange / coral |
| `--bg-studio` | `#FAF8F5` | Off-white warm gallery background for Acts II & III |
| `--bg-obsidian` | `#000000` / `#080808` | Pitch obsidian black background for Act IV (Colorway Configurator) |
| `--color-accent` | `#FF4E26` | Signature punctuation dot (`.`), active color indicators, stat card surfaces |
| `--color-card-orange` | `#FF4E26` | Bento feature metric cards in Act II |
| `--text-primary-dark` | `#111111` | Primary display headlines in light mode |
| `--text-primary-light`| `#F3F4F6` | Primary headlines and labels in dark mode |
| `--text-secondary` | `#666666` | Body copy and explanatory subtexts in light mode |
| `--text-muted` | `#9CA3AF` / `#52525B` | Telemetry specs, micro-labels, and metadata |
| `--hw-black-body` | `#141414` | Matte bead-blasted anodized black aluminum finish |
| `--hw-white-body` | `#F4F4F4` | Ceramic / powder-coated warm white finish |
| `--hw-orange-body` | `#FF4E26` | International orange edition body finish |
| `--hw-glass-rim` | `#222222` / `#FFFFFF` | Specular chamfer reflections on circular lens bezel |

### Typography Tokens
- **Display Sans:** `Inter`, `Geist`, or `SF Pro Display` (`system-ui` fallback)
  - Display Title Tracking: `letter-spacing: -0.035em` to `-0.04em`
  - Weights: `600` (SemiBold) for headlines, `400` (Regular) for body
- **Signature Accent Dot:** Every primary headline terminates with an orange punctuation dot (`<span class="text-[#FF4E26]">.</span>`):
  - `Crisp.`
  - `Colorful.`
  - `True-to-tone.`
  - `Choose your color.`
- **Micro-Labels & Technical Specs:**
  - Font: Monospace (`ui-monospace`, `JetBrains Mono`, `SF Mono`)
  - Tracking: `letter-spacing: 0.15em` uppercase, `11px` / `12px` font size
- **Background Marquee Ticker:**
  - `clamp(4rem, 8vw, 9rem)`, weight 500, uppercase text `"LIGHTS CAMERA ACTION"`, repeating infinitely with low-contrast muted tones and illuminated active word.

---

## 3. Reference Media & Asset Inventory

All raw reference assets and extracted keyframes have been downloaded and verified in the local workspace:

```
./reference-assets/
├── stellavis-hero.mp4            # Primary 1440x1080 3D scroll animation video (15.95s, 30fps)
├── stellavis-hero-still.png      # High-res poster of the hero isometric stage
├── stellavis-secondary.mp4       # 1920x1080 3D colorway transition video (5.48s, 30fps)
├── stellavis-secondary-still.png # High-res poster of the colorway stage
├── stellavis-shot1.png           # Still asset 1
├── stellavis-shot2.png           # High-angle hero shot of white & black hardware array
├── browser-viewport.png          # Dribbble web player inspection screenshot
├── browser-fullpage.png          # Full Dribbble page layout capture
├── frames/                       # 16 chronological keyframes extracted across the hero scrub
│   ├── frame_01.png to frame_16.png
└── filler-frames/                # Chronological keyframes extracted from the colorway video
    ├── filler_01.png to filler_05.png
```

---

## 4. Technical Architecture & Stack

### Core Technologies
1. **Engine:** Single-file standalone HTML5/ES6 application (zero build friction, runs directly in browser or easily wrapped in React/Vite/Next.js).
2. **Smooth Scroll Engine:** `@studio-freight/lenis` v1.0.42 (or modern Lenis) configured with exponential ease-out curve.
3. **Choreography & Pinning:** GSAP 3.12.5 + `ScrollTrigger` driving pinned viewport stages and bidirectional timeline scrubbing.
4. **Scrubbing Mechanism:** Dual-Mode Rendering Architecture:
   - **Mode A (High-Performance Canvas Scrubbing - Default):** HTML5 Canvas 2D context with subpixel rendering, device pixel ratio scaling (`window.devicePixelRatio`), and requestAnimationFrame interpolation scrubbing through the 3D frame sequence.
   - **Mode B (Realtime WebGL / Three.js Layer):** Three.js scene utilizing `ACESFilmicToneMapping`, physical glass transmission (`MeshPhysicalMaterial`), and studio rim lighting for interactive tilt and mouse-following parallax.
5. **Interactive Colorway Engine:** State-driven switcher dynamically alternating textures/frames between **Obsidian Black**, **Ceramic White**, and **International Orange** with synchronized ambient background morphing.

---

## 5. Viewport Stages & Choreography (0% – 100% Scroll)

The master scroll track is pinned for `600vh` total scroll distance:

```
0% ──────────── 20% ──────────── 45% ──────────── 70% ──────────── 85% ─────────── 100%
[ Act I: Array ]   [ Act II: Bento ]   [ Act III: Optical ]   [ Act IV: Tone ]   [ Act V: Color ]
Orange Floor        Off-White Studio    Right 3/4 Float        Frontal View       Obsidian Black
"Stellavis"         "2.4x / 64 / 7x"    "Crisp." / "Color."    "True-to-tone."    "Choose your color."
```

### Act I: The Master Array (0% – 18% Scroll)
- **Visuals:** Fullscreen isometric array on vibrant orange floor (`#FF4E26`). Six obsidian black cameras flank a pristine white center unit.
- **UI:** Minimal sticky header: `Stellavis` logo (top-left) and minimalist menu icon (top-right). Bold white typography `"Stellavis"` dead-center.
- **Scroll Action:** White center camera unlocks from the floor, levitating upward with depth-of-field blur on surrounding units.

### Act II: Transition & Bento Spec Cards (18% – 40% Scroll)
- **Visuals:** The orange ground plane smoothly rolls away into a calm, gallery off-white background (`#FAF8F5`). In the background, a huge kinetic marquee ticker (`"LIGHTS CAMERA ACTION"`) scrolls horizontally.
- **UI:** Three rounded international orange Bento cards slide up with staggered GSAP easing:
  - **Card 1 (Left):** `2.4x` — *"An f1.8, six-element, glass lens brings in 2.4x more light than any other webcam."* (Aperture icon)
  - **Card 2 (Middle):** `64` — *"The Stellavis focuses from 64 unique points on every frame."* (Sensor matrix icon)
  - **Card 3 (Right):** `7.8mm` & `7x` — *"With a 7.8mm, 4K Sony sensor... reaches full potential with companion app Composer."*

### Act III: The Optical Showcase — "Crisp." & "Colorful." (40% – 65% Scroll)
- **Visuals:** Bento cards slide down; the camera smoothly pans to the right side of the screen, floating at an angled 3/4 perspective revealing top dials and orange accent triggers.
- **UI (Left Column):**
  - **Sub-stage 3A:** Headline `"Crisp."` fades in with body *"Every detail is rendered in exquisite clarity"*.
  - **Sub-stage 3B:** Headline morphs into `"Colorful."` with body *"From the fiery reds to the cool blues of a tranquil lake"*, while the camera smoothly rotates to highlight the multi-element glass coating.

### Act IV: Acoustic & Sensor Precision — "True-to-tone." (65% – 82% Scroll)
- **Visuals:** Camera rotates into direct frontal elevation, emphasizing the 80-hole precision beamforming microphone array and deep concentric optical elements.
- **UI (Left Column):**
  - Headline `"True-to-tone."` with body *"Whether it's the warm glow of candlelight or the cool landscape"*.

### Act V: Interactive Colorway Configurator — "Choose your color." (82% – 100% Scroll)
- **Visuals:** The background seamlessly darkens into deep obsidian black (`#000000`). The camera sits centered in the viewport.
- **UI:**
  - Header: `"Choose your color."` centered above the camera.
  - Interactive Pill Dock: Centered below the camera with three interactive circular swatches:
    1. `Obsidian Black` (`#181818`)
    2. `Ceramic White` (`#F4F4F4`)
    3. `International Orange` (`#FF4E26`)
  - Clicking any swatch triggers an instantaneous smooth cross-dissolve/animation showing that exact colorway in high-definition (utilizing the extracted `filler1.mp4` sequence).
  - Floating CTA Dock: `"Pre-order Stellavis — $299"` button with subtle glassmorphic glow.

---

## 6. Anti-AI-Slop & Craft Checklist

- [x] **No Generic AI Gradients:** Zero purple/cyan neon blobs or generic gradients; strict palette of pure obsidian, crisp ceramic white, and international orange.
- [x] **Precise Typography:** Display headers use tight tracking (`-0.035em`) with signature orange accent periods.
- [x] **No Janky Scroll Jumps:** GSAP `ScrollTrigger` updates strictly hooked to Lenis ticker with `lagSmoothing(0)`.
- [x] **High-DPI Retina Support:** Canvas buffer automatically scales to device pixel ratio with aspect-contain sizing.
- [x] **Responsive Adaptation:** Mobile layout stacks text above/below the camera canvas and adjusts scrub sensitivity.
- [x] **Accessible Reduced Motion:** Respects `prefers-reduced-motion` with graceful static layout fallback.

---

## 7. Next Step

All 4 preparation pipeline steps are complete:
1. Media extracted, downloaded, and verified.
2. Skills installed (`motionsites-web-builder` and `hardware-3d-scroll`).
3. Reference shot visuals, colors, and motion choreography analyzed.
4. Complete build specification documented.

Ready for the final user prompt to generate the website code.

