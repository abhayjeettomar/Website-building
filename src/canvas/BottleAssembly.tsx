import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollStore, BaseDistillate, NootropicStack, BotanicalModifier, ChillMode, SealColor, GlassTint, WaxDip } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';
import { createLiquidGradientTexture, LIQUID_PALETTES } from './LiquidShader';
import { fluidPhysics } from '../utils/fluidPhysics';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidBodyRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const impactRingRef = useRef<THREE.Mesh>(null);
  const splashParticlesRef = useRef<THREE.InstancedMesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const alphaParticlesRef = useRef<THREE.InstancedMesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const corkRef = useRef<THREE.Mesh>(null);
  const capMedallionRef = useRef<THREE.Mesh>(null);
  const waxDipRef = useRef<THREE.Mesh>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const jiggerRef = useRef<THREE.Group>(null);
  const marbleSlabRef = useRef<THREE.Group>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);
  const rosemaryRef = useRef<THREE.Mesh>(null);
  const shisoRef = useRef<THREE.Group>(null);
  const dustMotesRef = useRef<THREE.InstancedMesh>(null);

  const liquidMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const meniscusMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const streamMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const impactMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glassMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // --- 1. Procedural High-Flint Embossed Label ---
  const { diffuseMap, bumpMap, updateLabel } = useMemo(() => createProceduralLabel(), []);

  // --- 2. Procedural Volumetric Liquid Textures ---
  const liquidTextures = useMemo(() => ({
    yuzu: createLiquidGradientTexture(LIQUID_PALETTES.yuzu),
    blood_orange: createLiquidGradientTexture(LIQUID_PALETTES.blood_orange),
    juniper: createLiquidGradientTexture(LIQUID_PALETTES.juniper),
  }), []);

  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      const f = scrollStore.formula;
      updateLabel(f.customName, f.engravedInitials, f.seal, f.labelPaper, f.batchYear);

      const baseKey = f.base || 'yuzu';
      const tex = liquidTextures[baseKey] || liquidTextures.yuzu;
      if (liquidMaterialRef.current && liquidMaterialRef.current.map !== tex) {
        liquidMaterialRef.current.map = tex;
        liquidMaterialRef.current.needsUpdate = true;
      }
    });
    return unsub;
  }, [updateLabel, liquidTextures]);

  // --- 3. Solid Architectural Decanter Geometry (Outer & Inner Cavity Manifold) ---
  const glassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Outer wall profile (from bottom punt apex to lip)
    points.push(new THREE.Vector2(0.0, -1.30));    // Deep punt outer apex
    points.push(new THREE.Vector2(0.18, -1.34));
    points.push(new THREE.Vector2(0.38, -1.45));   // Heavy crystal base floor
    points.push(new THREE.Vector2(0.46, -1.43));
    points.push(new THREE.Vector2(0.47, -1.38));   // Beveled base heel
    points.push(new THREE.Vector2(0.47, 0.52));    // Slim optical cylinder wall
    points.push(new THREE.Vector2(0.45, 0.64));    // Tapered shoulder
    points.push(new THREE.Vector2(0.38, 0.78));
    points.push(new THREE.Vector2(0.26, 0.90));
    points.push(new THREE.Vector2(0.18, 1.00));
    points.push(new THREE.Vector2(0.165, 1.10));   // Precision fluted neck
    points.push(new THREE.Vector2(0.165, 1.30));
    points.push(new THREE.Vector2(0.20, 1.33));    // Apothecary lip outer bevel
    points.push(new THREE.Vector2(0.20, 1.38));
    points.push(new THREE.Vector2(0.135, 1.38));   // Inner aperture rim

    // Inner cavity wall (descending down to inner punt dome - true solid wall thickness)
    points.push(new THREE.Vector2(0.135, 1.10));   // Inner neck bore
    points.push(new THREE.Vector2(0.15, 1.00));
    points.push(new THREE.Vector2(0.24, 0.88));
    points.push(new THREE.Vector2(0.35, 0.76));
    points.push(new THREE.Vector2(0.425, 0.62));   // Inner shoulder
    points.push(new THREE.Vector2(0.435, 0.50));
    points.push(new THREE.Vector2(0.435, -1.12));  // Inner cylinder wall
    points.push(new THREE.Vector2(0.415, -1.20));  // Inner heel floor
    points.push(new THREE.Vector2(0.20, -1.16));   // Inner punt curve
    points.push(new THREE.Vector2(0.0, -1.12));    // Inner punt dome apex
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 4. Single Unified Liquid Geometry (Water-tight, Zero Z-Fighting) ---
  const liquidGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.410, 0.410, 1.0, 48, 1, false);
    geom.translate(0, 0.5, 0); // Anchor pivot at base
    return geom;
  }, []);

  // Meniscus circular fluid surface disc (snug r=0.408, capillary tension)
  const meniscusGeometry = useMemo(() => {
    const geom = new THREE.RingGeometry(0.0, 0.408, 36, 6);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const r = Math.sqrt(vx * vx + vy * vy) / 0.408;
      pos.setZ(i, Math.pow(r, 4) * 0.014);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Fluid impact ripple ring
  const impactGeometry = useMemo(() => new THREE.RingGeometry(0.02, 0.20, 36), []);

  // Curved Pour Stream along Catmull-Rom arc
  const streamCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 1.82, 0.0),  // Jigger spout lip
      new THREE.Vector3(-0.12, 1.62, 0.0),  // Parabolic acceleration curve
      new THREE.Vector3(0.0, 1.38, 0.0),    // Center of open decanter neck
      new THREE.Vector3(0.0, -0.60, 0.0),   // Mid chamber stream
    ]);
  }, []);

  const streamGeometry = useMemo(() => {
    return new THREE.TubeGeometry(streamCurve, 32, 0.014, 12, false);
  }, [streamCurve]);

  // Portuguese Cork Geometry
  const corkGeometry = useMemo(() => new THREE.CylinderGeometry(0.13, 0.125, 0.28, 32), []);

  // CNC Metal Stopper Geometry
  const stopperGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, 0.0));
    points.push(new THREE.Vector2(0.21, 0.0));
    points.push(new THREE.Vector2(0.22, 0.04));
    points.push(new THREE.Vector2(0.22, 0.22));
    points.push(new THREE.Vector2(0.21, 0.24));
    points.push(new THREE.Vector2(0.0, 0.24));
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // Medallion coin inlay on top of stopper
  const coinGeometry = useMemo(() => new THREE.CylinderGeometry(0.18, 0.18, 0.01, 32), []);

  // Artisanal Copper Laboratory Jigger (Pouring Vessel)
  const jiggerGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -0.22));
    points.push(new THREE.Vector2(0.10, -0.22));
    points.push(new THREE.Vector2(0.05, 0.0));   // Waist
    points.push(new THREE.Vector2(0.14, 0.25));  // Upper bowl flare
    points.push(new THREE.Vector2(0.145, 0.26));
    points.push(new THREE.Vector2(0.13, 0.26));  // Spout lip
    points.push(new THREE.Vector2(0.04, 0.0));
    points.push(new THREE.Vector2(0.09, -0.21));
    points.push(new THREE.Vector2(0.0, -0.21));
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // Luxury Honed Nero Marquina Marble Counter Slab (Stage 1 Opening Plinth)
  const marbleSlabGeometry = useMemo(() => new THREE.CylinderGeometry(1.65, 1.70, 0.14, 48), []);

  // Wax Dip Seal geometry around neck
  const waxGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.14, 1.20));
    points.push(new THREE.Vector2(0.175, 1.20));
    points.push(new THREE.Vector2(0.18, 1.32));
    points.push(new THREE.Vector2(0.21, 1.34));
    points.push(new THREE.Vector2(0.21, 1.39));
    points.push(new THREE.Vector2(0.14, 1.39));
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // Splash particle droplets
  const SPLASH_COUNT = 16;
  const splashGeometry = useMemo(() => new THREE.SphereGeometry(0.014, 8, 8), []);
  const splashData = useMemo(() => {
    return Array.from({ length: SPLASH_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.02 + Math.random() * 0.08,
      height: 0.04 + Math.random() * 0.14,
      speed: 10 + Math.random() * 8
    }));
  }, []);

  // Effervescent Micro-Bubbles (35 bubbles)
  const BUBBLE_COUNT = 35;
  const bubbleGeometry = useMemo(() => new THREE.SphereGeometry(0.008, 8, 8), []);
  const bubbleData = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      r: Math.sqrt(Math.random()) * 0.35,
      angle: Math.random() * Math.PI * 2,
      y: -1.18 + Math.random() * 1.5,
      speed: 0.14 + Math.random() * 0.28,
      wobbleSeed: Math.random() * 10
    }));
  }, []);

  // Alpha-Wave Neural Bio-Luminescent Particles (60 golden micro-glints)
  const ALPHA_PARTICLE_COUNT = 60;
  const alphaParticleGeometry = useMemo(() => new THREE.SphereGeometry(0.007, 6, 6), []);
  const alphaParticleData = useMemo(() => {
    return Array.from({ length: ALPHA_PARTICLE_COUNT }, () => ({
      r: 0.05 + Math.random() * 0.32,
      angle: Math.random() * Math.PI * 2,
      y: -1.15 + Math.random() * 1.4,
      vSpeed: 0.08 + Math.random() * 0.15,
      orbitSpeed: 0.5 + Math.random() * 1.2,
      pulseSeed: Math.random() * 10
    }));
  }, []);

  // Atmospheric Volumetric Dust Motes (45 golden floating specks in empty space)
  const DUST_COUNT = 45;
  const dustGeometry = useMemo(() => new THREE.SphereGeometry(0.009, 6, 6), []);
  const dustData = useMemo(() => {
    return Array.from({ length: DUST_COUNT }, () => ({
      x: (Math.random() - 0.5) * 5.0,
      y: -1.5 + Math.random() * 3.5,
      z: (Math.random() - 0.5) * 4.0,
      speedY: 0.02 + Math.random() * 0.04,
      driftX: 0.01 + Math.random() * 0.03,
      pulse: Math.random() * Math.PI * 2
    }));
  }, []);

  // Orbitals: Crystal Clear Ice Cube & Botanical Juniper Spheres
  const iceGeometry = useMemo(() => new THREE.BoxGeometry(0.26, 0.26, 0.26), []);
  const berryGeometry = useMemo(() => new THREE.SphereGeometry(0.042, 12, 12), []);
  const rosemaryGeometry = useMemo(() => new THREE.CylinderGeometry(0.008, 0.006, 0.45, 12), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  const currentLiquidColor = useRef(new THREE.Color('#F59E0B'));
  const currentEmissiveColor = useRef(new THREE.Color('#381502'));
  const currentStreamColor = useRef(new THREE.Color('#FEF3C7'));

  // --- Animation Frame Loop ---
  useFrame((state, delta) => {
    scrollStore.updatePourPhysics(delta);

    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();
    const cursor = scrollStore.cursor;
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    if (!masterBottleRef.current) return;

    // --- 1. Continuous Parametric Scroll Trajectory ---
    let bX = 0;
    let bY = -0.16;
    let bRotY = 0.15;

    if (p < 0.16) {
      // Stage 1: Genesis (Center hero resting on marble counter slab)
      const t = p / 0.16;
      bX = 0;
      bY = -0.16 + Math.sin(time * 1.2) * 0.012;
      bRotY = 0.15 + t * 0.15;
    } else if (p < 0.36) {
      // Stage 2: Distillate Base (Continuously glides to right flank, revealing profile)
      const t = (p - 0.16) / 0.20;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.0, 0.85, Math.min(1.0, t * 1.4));
      bY = -0.14 + Math.sin(time * 1.0) * 0.012;
      bRotY = 0.30 + t * 0.35;
    } else if (p < 0.56) {
      // Stage 3: Exploded Formulation (Continuously glides across to left flank)
      const t = (p - 0.36) / 0.20;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.85, -0.85, Math.min(1.0, t * 1.4));
      bY = -0.16;
      bRotY = 0.65 + t * 0.65;
    } else if (p < 0.74) {
      // Stage 4: Chill Architecture (Left flank, rotational reveal with orbiting ice)
      const t = (p - 0.56) / 0.18;
      bX = isMobile ? 0 : -0.85;
      bY = -0.14;
      bRotY = 1.30 + t * 0.55;
    } else if (p < 0.88) {
      // Stage 5: Bespoke Engraving (Glides to right, turns frontally to camera for laser engraving)
      const t = (p - 0.74) / 0.14;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.85, 0.82, Math.min(1.0, t * 1.3));
      bY = -0.12;
      // Frontal presentation angle so user sees the engraved label in full view!
      bRotY = THREE.MathUtils.lerp(1.85, 0.15, Math.min(1.0, t * 1.3));
    } else {
      // Stage 6: Dispatch Vault (Glides to left presentation, slow showroom turntable rotation)
      const t = Math.min(1, (p - 0.88) / 0.12);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.82, -0.85, Math.min(1.0, t * 1.4));
      bY = -0.14;
      bRotY = 0.15 + Math.sin(time * 0.6) * 0.18;
    }

    // --- 2. Dynamic Scroll Velocity & Cursor Parallax Aerodynamics ---
    const scrollLeanX = THREE.MathUtils.clamp(velocity * 0.0016, -0.12, 0.12);
    const scrollLeanZ = THREE.MathUtils.clamp(-velocity * 0.0012, -0.10, 0.10);
    const cursorTiltX = cursor.y * 0.045;
    const cursorTiltZ = -cursor.x * 0.055;

    const targetRotX = 0.02 + scrollLeanX + cursorTiltX;
    const targetRotZ = scrollLeanZ + cursorTiltZ;

    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 5, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 5, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, targetRotX, 5, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 5, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, targetRotZ, 5, delta);

    // --- 3. Fluid Physics Engine & Gravity Slosh Alignment ---
    fluidPhysics.update(
      delta,
      time,
      masterBottleRef.current.position.x,
      masterBottleRef.current.position.y,
      masterBottleRef.current.rotation.x,
      masterBottleRef.current.rotation.z,
      velocity,
      pour.isPouring,
      pour.isDraining
    );

    // Dynamic fluid height: base floor at -1.20, 500mL reaches exactly 0.38
    const fLevel = pour.fillLevel;
    const maxFluidHeight = 1.58;
    const currentHeight = Math.max(0.001, fLevel * maxFluidHeight);
    const surfaceY = -1.20 + currentHeight;

    // --- 4. Single Unified Liquid Body (Zero Z-Fighting) ---
    if (liquidBodyRef.current) {
      const showLiquid = fLevel > 0.005;
      liquidBodyRef.current.visible = showLiquid;
      if (showLiquid) {
        liquidBodyRef.current.scale.set(1, currentHeight, 1);
        liquidBodyRef.current.position.set(0, -1.20, 0);

        if (pour.isDraining) {
          liquidBodyRef.current.rotation.y += delta * 8.5;
        } else {
          liquidBodyRef.current.rotation.y = 0;
        }

        // Keep liquid column upright within inner bore - slosh tilts meniscus!
        liquidBodyRef.current.rotation.x = 0;
        liquidBodyRef.current.rotation.z = 0;
      }
    }

    // --- 5. Meniscus Surface Disc (Gravity-Aligned Capillary Tension & Vortex) ---
    if (meniscusRef.current) {
      const showMeniscus = fLevel > 0.015;
      meniscusRef.current.visible = showMeniscus;
      if (showMeniscus) {
        const surfaceWave = fluidPhysics.getSurfaceWave(0.1, time);
        const vortexOffset = fluidPhysics.getVortexOffset(0.0);
        meniscusRef.current.position.y = surfaceY + surfaceWave + vortexOffset;

        const meniscusPitch = -Math.PI / 2 + (-targetRotX * 0.85 + fluidPhysics.sloshPitch);
        const meniscusRoll = -targetRotZ * 0.85 + fluidPhysics.sloshRoll;
        meniscusRef.current.rotation.x = THREE.MathUtils.damp(meniscusRef.current.rotation.x, meniscusPitch, 10, delta);
        meniscusRef.current.rotation.z = THREE.MathUtils.damp(meniscusRef.current.rotation.z, meniscusRoll, 10, delta);
      }
    }

    // --- 6. Effervescent Botanical Micro-Bubbles ---
    if (bubblesRef.current) {
      const showBubbles = fLevel > 0.08;
      bubblesRef.current.visible = showBubbles;
      if (showBubbles) {
        const maxY = surfaceY - 0.02;
        const bubbleSpeedMult = formula.nootropic === 'social' ? 2.2 : (formula.chill === 'glacial' ? 1.4 : 1.0);

        for (let i = 0; i < BUBBLE_COUNT; i++) {
          const b = bubbleData[i];
          b.y += delta * b.speed * bubbleSpeedMult;
          if (b.y > maxY) b.y = -1.18;

          const driftAngle = b.angle + (time * 0.8);
          const bx = Math.cos(driftAngle) * b.r + fluidPhysics.sloshRoll * 0.12;
          const bz = Math.sin(driftAngle) * b.r + fluidPhysics.sloshPitch * 0.12;
          const by = b.y;

          dummyPos.set(bx, by, bz);
          dummyScale.setScalar(1.0);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          bubblesRef.current.setMatrixAt(i, dummyMatrix);
        }
        bubblesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- 7. Alpha-Wave Bio-Luminescent Particles (Active when Alpha stack selected) ---
    if (alphaParticlesRef.current) {
      const showAlpha = fLevel > 0.15 && formula.nootropic === 'alpha';
      alphaParticlesRef.current.visible = showAlpha;
      if (showAlpha) {
        const maxY = surfaceY - 0.03;
        for (let i = 0; i < ALPHA_PARTICLE_COUNT; i++) {
          const ap = alphaParticleData[i];
          ap.y += delta * ap.vSpeed;
          if (ap.y > maxY) ap.y = -1.15;

          const orbitAngle = ap.angle + time * ap.orbitSpeed;
          const ax = Math.cos(orbitAngle) * ap.r + fluidPhysics.sloshRoll * 0.10;
          const az = Math.sin(orbitAngle) * ap.r + fluidPhysics.sloshPitch * 0.10;
          const ay = ap.y;

          const pScale = 0.8 + Math.sin(time * 3 + ap.pulseSeed) * 0.4;
          dummyPos.set(ax, ay, az);
          dummyScale.setScalar(pScale);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          alphaParticlesRef.current.setMatrixAt(i, dummyMatrix);
        }
        alphaParticlesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- 8. Artisanal Copper Jigger & Parabolic Pour Stream ---
    const isPouring = pour.isPouring;

    if (jiggerRef.current) {
      // Jigger appears and tilts forward when pouring!
      const targetJiggerY = isPouring ? 1.82 : 2.5;
      const targetJiggerZRot = isPouring ? -0.72 : 0; // -41 degrees tilt
      const targetJiggerOpacity = isPouring ? 1.0 : 0.0;

      jiggerRef.current.position.y = THREE.MathUtils.damp(jiggerRef.current.position.y, targetJiggerY, 6, delta);
      jiggerRef.current.rotation.z = THREE.MathUtils.damp(jiggerRef.current.rotation.z, targetJiggerZRot, 6, delta);
      jiggerRef.current.visible = isPouring || jiggerRef.current.position.y < 2.3;
    }

    if (pourStreamRef.current && streamMaterialRef.current) {
      pourStreamRef.current.visible = isPouring;
      if (isPouring) {
        // Shimmering flowing wave along curve
        streamMaterialRef.current.color.copy(currentLiquidColor.current);
        const pulse = 1.0 + Math.sin(time * 24) * 0.10;
        pourStreamRef.current.scale.set(pulse, 1.0, pulse);
      }
    }

    // Surface impact ripple ring
    if (impactRingRef.current && impactMaterialRef.current) {
      impactRingRef.current.visible = isPouring && fLevel > 0.02;
      if (isPouring) {
        impactRingRef.current.position.y = surfaceY + 0.004;
        const ripplePhase = (time * 3.5) % 1;
        const rippleScale = 0.6 + ripplePhase * 1.6;
        impactRingRef.current.scale.set(rippleScale, rippleScale, 1);
        impactMaterialRef.current.opacity = (1 - ripplePhase) * 0.75;
        impactMaterialRef.current.color.copy(currentStreamColor.current);
      }
    }

    // Splash particle droplets
    if (splashParticlesRef.current) {
      splashParticlesRef.current.visible = isPouring && fLevel > 0.03;
      if (isPouring) {
        for (let i = 0; i < SPLASH_COUNT; i++) {
          const sp = splashData[i];
          const curTime = time * sp.speed + i;
          const cycle = (curTime % 1);
          const r = sp.dist + cycle * 0.08;
          const px = Math.cos(sp.angle) * r;
          const pz = Math.sin(sp.angle) * r;
          const py = surfaceY + Math.sin(cycle * Math.PI) * sp.height;
          const pScale = (1 - cycle) * 0.9;

          dummyPos.set(px, py, pz);
          dummyScale.setScalar(Math.max(0.001, pScale));
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          splashParticlesRef.current.setMatrixAt(i, dummyMatrix);
        }
        splashParticlesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- 9. Stopper & Cork Unsealing (Lifts out of way during pour) ---
    let explodeAmount = 0;
    if (p >= 0.38 && p < 0.48) {
      explodeAmount = (p - 0.38) / 0.10;
    } else if (p >= 0.48 && p < 0.54) {
      explodeAmount = 1.0;
    } else if (p >= 0.54 && p < 0.60) {
      explodeAmount = 1.0 - (p - 0.54) / 0.06;
    }

    let capTargetPos = new THREE.Vector3(0, 0, 0);
    let corkTargetPos = new THREE.Vector3(0, 1.22, 0);
    let capTargetRotZ = 0;

    if (explodeAmount > 0) {
      // Architectural exploded view in Stage 3
      capTargetPos.set(0, explodeAmount * 0.65, 0);
      corkTargetPos.set(0, 1.22 + explodeAmount * 0.32, 0);
    } else if (isPouring) {
      // Stopper and cork lift completely off bottle to the side so neck aperture is 100% open!
      capTargetPos.set(0.55, 0.45, 0);
      corkTargetPos.set(0.55, 1.62, 0);
      capTargetRotZ = 0.22;
    }

    if (capGroupRef.current) {
      capGroupRef.current.position.lerp(capTargetPos, delta * 6);
      capGroupRef.current.rotation.z = THREE.MathUtils.damp(capGroupRef.current.rotation.z, capTargetRotZ, 6, delta);
      capGroupRef.current.rotation.y += delta * (0.25 * explodeAmount + (isPouring ? 0.3 : 0));
    }

    if (corkRef.current) {
      corkRef.current.position.lerp(corkTargetPos, delta * 6);
      corkRef.current.rotation.z = THREE.MathUtils.damp(corkRef.current.rotation.z, capTargetRotZ, 6, delta);
    }

    // --- 10. Stage 1 Marble Counter Slab Fade ---
    if (marbleSlabRef.current) {
      const slabOpacity = p < 0.16 ? (1.0 - p / 0.14) : 0;
      marbleSlabRef.current.visible = slabOpacity > 0.01;
      marbleSlabRef.current.position.y = -1.55 - p * 1.5;
    }

    // --- 11. Volumetric Dust Motes in Studio Air ---
    if (dustMotesRef.current) {
      for (let i = 0; i < DUST_COUNT; i++) {
        const d = dustData[i];
        d.y += delta * d.speedY;
        d.x += Math.sin(time + d.pulse) * delta * d.driftX;
        if (d.y > 2.2) d.y = -1.5;

        const pulseScale = 0.7 + Math.sin(time * 2 + d.pulse) * 0.3;
        dummyPos.set(d.x, d.y, d.z);
        dummyScale.setScalar(pulseScale);
        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        dustMotesRef.current.setMatrixAt(i, dummyMatrix);
      }
      dustMotesRef.current.instanceMatrix.needsUpdate = true;
    }

    // --- 12. Dynamic Liquid Color Transitions ---
    const baseKey = (formula.base || 'yuzu') as BaseDistillate;
    const pal = LIQUID_PALETTES[baseKey] || LIQUID_PALETTES.yuzu;
    currentLiquidColor.current.lerp(new THREE.Color(pal.glow), delta * 4.0);
    currentEmissiveColor.current.lerp(new THREE.Color(pal.deepCore), delta * 4.0);
    currentStreamColor.current.lerp(new THREE.Color(pal.rimHighlight), delta * 4.0);

    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.color.set('#FFFFFF');
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      liquidMaterialRef.current.emissiveIntensity = 0.03;
    }

    if (meniscusMaterialRef.current) {
      meniscusMaterialRef.current.color.copy(currentLiquidColor.current);
      meniscusMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      meniscusMaterialRef.current.emissiveIntensity = 0.03;
    }

    // --- 13. Glass Material Tint (Stage 5 Customization) ---
    if (outerGlassRef.current && glassMaterialRef.current) {
      const tint = formula.glassTint || 'clear';
      let glassColor = '#FFFFFF';
      let glassRoughness = 0.015;
      let glassTrans = 0.96;

      if (tint === 'obsidian') {
        glassColor = '#1F1E24';
        glassTrans = 0.88;
      } else if (tint === 'amber') {
        glassColor = '#C27835';
        glassTrans = 0.90;
      } else if (tint === 'frosted') {
        glassRoughness = 0.18;
      }

      if (formula.chill === 'glacial' && p >= 0.56) {
        glassRoughness = Math.max(glassRoughness, 0.08);
      }

      glassMaterialRef.current.color.lerp(new THREE.Color(glassColor), delta * 4);
      glassMaterialRef.current.roughness = THREE.MathUtils.damp(glassMaterialRef.current.roughness, glassRoughness, 4, delta);
      glassMaterialRef.current.transmission = THREE.MathUtils.damp(glassMaterialRef.current.transmission, glassTrans, 4, delta);
    }

    // --- 14. Cap Metallurgy (Stage 5 Customization) ---
    if (capMedallionRef.current) {
      const mat = capMedallionRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        let targetColor = '#D4AF37'; // brass
        let metalness = 0.95;
        let roughness = 0.22;
        if (formula.seal === 'noir') {
          targetColor = '#1C1B1A';
          roughness = 0.35;
        } else if (formula.seal === 'copper') {
          targetColor = '#B3542E';
          roughness = 0.26;
        } else if (formula.seal === 'silver') {
          targetColor = '#D1D5DB';
          roughness = 0.18;
        } else if (formula.seal === 'gold') {
          targetColor = '#F59E0B';
          roughness = 0.16;
        }
        mat.color.lerp(new THREE.Color(targetColor), delta * 4);
        mat.metalness = metalness;
        mat.roughness = roughness;
      }
    }

    // --- 15. Neck Wax Dip (Stage 5 Customization) ---
    if (waxDipRef.current) {
      const waxType = formula.waxDip || 'none';
      waxDipRef.current.visible = waxType !== 'none';
      if (waxType !== 'none') {
        const mat = waxDipRef.current.material as THREE.MeshStandardMaterial;
        let waxColor = '#991B1B'; // crimson
        if (waxType === 'black') waxColor = '#171614';
        else if (waxType === 'gold') waxColor = '#D4AF37';
        mat.color.lerp(new THREE.Color(waxColor), delta * 4);
      }
    }

    // --- 16. Orbitals & Modifiers (Rosemary, Shiso, Ice) ---
    if (orbitalsGroupRef.current) {
      const isStage4 = p >= 0.56 && p < 0.76;
      const targetScale = isStage4 ? 1.0 : 0.0;
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      orbitalsGroupRef.current.rotation.y += delta * 0.35;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.8) * 0.06;
    }

    if (rosemaryRef.current) {
      rosemaryRef.current.visible = formula.modifier === 'rosemary';
      rosemaryRef.current.rotation.y += delta * 0.4;
    }

    if (shisoRef.current) {
      shisoRef.current.visible = formula.modifier === 'shiso';
      shisoRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group ref={masterBottleRef} scale={[0.88, 0.88, 0.88]} position={[0, -0.16, 0]}>
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC VOLUMETRIC DUST MOTES (Cinematic Studio Depth)              */}
      {/* ========================================================================= */}
      <instancedMesh
        ref={dustMotesRef}
        args={[dustGeometry, undefined, DUST_COUNT]}
        renderOrder={0}
      >
        <meshBasicMaterial color="#E8D5B5" transparent opacity={0.35} />
      </instancedMesh>

      {/* ========================================================================= */}
      {/* 2. STAGE 1 NERO MARQUINA MARBLE COUNTER SLAB PLINTH                      */}
      {/* ========================================================================= */}
      <group ref={marbleSlabRef} position={[0, -1.55, 0]}>
        <mesh geometry={marbleSlabGeometry} receiveShadow>
          <meshStandardMaterial
            color="#141416"
            roughness={0.12}
            metalness={0.25}
          />
        </mesh>
        {/* Brass Bevel Inlay Ring */}
        <mesh position={[0, 0.071, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.52, 1.54, 48]} />
          <meshStandardMaterial color="#C59B27" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. ARTISANAL COPPER LABORATORY JIGGER & POUR STREAM                      */}
      {/* ========================================================================= */}
      <group ref={jiggerRef} position={[-0.42, 2.5, 0]}>
        <mesh geometry={jiggerGeometry} castShadow>
          <meshStandardMaterial
            color="#B85D36"
            roughness={0.25}
            metalness={0.88}
          />
        </mesh>
      </group>

      {/* Curved Parabolic Laminar Pour Stream (Rendered inside vessel cavity) */}
      <mesh ref={pourStreamRef} geometry={streamGeometry} renderOrder={1} visible={false}>
        <meshStandardMaterial
          ref={streamMaterialRef}
          color="#FBBF24"
          roughness={0.015}
          metalness={0.0}
        />
      </mesh>

      {/* Surface Impact Splash Ripple Ring */}
      <mesh ref={impactRingRef} geometry={impactGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} visible={false}>
        <meshBasicMaterial ref={impactMaterialRef} color="#FBBF24" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Active Splash Droplets */}
      <instancedMesh
        ref={splashParticlesRef}
        args={[splashGeometry, undefined, SPLASH_COUNT]}
        renderOrder={1}
        visible={false}
      >
        <meshStandardMaterial
          color="#FEF3C7"
          roughness={0.02}
          metalness={0.0}
        />
      </instancedMesh>

      {/* ========================================================================= */}
      {/* 4. SINGLE UNIFIED LIQUID MESH (Zero Z-Fighting, Perfect Water-Tight)     */}
      {/* ========================================================================= */}
      <mesh ref={liquidBodyRef} geometry={liquidGeometry} renderOrder={1} visible={false}>
        <meshStandardMaterial
          ref={liquidMaterialRef}
          map={liquidTextures.yuzu}
          color="#FFFFFF"
          emissive="#120600"
          emissiveIntensity={0.03}
          roughness={0.018}
          metalness={0.0}
        />
      </mesh>

      {/* Meniscus Top Surface Disc with Capillary Tension */}
      <mesh ref={meniscusRef} geometry={meniscusGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} visible={false}>
        <meshStandardMaterial
          ref={meniscusMaterialRef}
          color="#F59E0B"
          roughness={0.015}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suspended Botanical Effervescent Micro-Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[bubbleGeometry, undefined, BUBBLE_COUNT]}
        renderOrder={1}
        visible={false}
      >
        <meshStandardMaterial
          color="#FFFDF7"
          roughness={0.02}
          metalness={0.0}
          transparent
          opacity={0.80}
        />
      </instancedMesh>

      {/* Alpha-Wave Bio-Luminescent Neural Micro-Particles */}
      <instancedMesh
        ref={alphaParticlesRef}
        args={[alphaParticleGeometry, undefined, ALPHA_PARTICLE_COUNT]}
        renderOrder={1}
        visible={false}
      >
        <meshStandardMaterial
          color="#FFDF73"
          emissive="#F59E0B"
          emissiveIntensity={0.85}
          roughness={0.02}
          metalness={0.1}
        />
      </instancedMesh>

      {/* ========================================================================= */}
      {/* 5. SOLID OPTICAL CRYSTAL DECANTER (Refracts Liquid & Studio Lights)       */}
      {/* ========================================================================= */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} renderOrder={2} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={glassMaterialRef}
          transmission={0.96}
          roughness={0.015}
          ior={1.50}
          thickness={0.07}
          transparent={true}
          opacity={1.0}
          reflectivity={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.015}
          color="#FFFFFF"
          attenuationColor="#FAF6F0"
          attenuationDistance={3.2}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 6. STOPPER, PORTUGUESE CORK & WAX DIP SEAL                               */}
      {/* ========================================================================= */}
      <mesh ref={corkRef} geometry={corkGeometry} position={[0, 1.22, 0]} renderOrder={4}>
        <meshStandardMaterial
          color="#D4A373"
          roughness={0.75}
          metalness={0.02}
        />
      </mesh>

      {/* CNC-Machined Architectural Metallic Cap Stopper */}
      <group ref={capGroupRef} position={[0, 0, 0]} renderOrder={4}>
        <mesh ref={capMedallionRef} geometry={stopperGeometry} position={[0, 1.37, 0]}>
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.24}
          />
        </mesh>

        <mesh geometry={coinGeometry} position={[0, 1.61, 0]}>
          <meshStandardMaterial
            color="#FFF1C2"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>
      </group>

      {/* Optional Neck Wax Dip Seal */}
      <mesh ref={waxDipRef} geometry={waxGeometry} position={[0, 0, 0]} renderOrder={4} visible={false}>
        <meshStandardMaterial color="#991B1B" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* ========================================================================= */}
      {/* 7. PROCEDURAL EMBOSSED PARCHMENT BOTANICAL LABEL                         */}
      {/* ========================================================================= */}
      <mesh ref={labelMeshRef} position={[0, -0.05, 0]} renderOrder={4}>
        <cylinderGeometry args={[0.473, 0.473, 0.95, 48, 1, true, -Math.PI * 0.31, Math.PI * 0.62]} />
        <meshStandardMaterial
          map={diffuseMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          roughness={0.82}
          metalness={0.04}
          transparent={true}
          opacity={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 8. EXTERNAL FLOATING BOTANICAL ORBITALS & ICE (Stage 4)                  */}
      {/* ========================================================================= */}
      <group ref={orbitalsGroupRef} scale={[0, 0, 0]} position={[0, 0.1, 0]} renderOrder={4}>
        {/* Hand-Cut Artisanal Crystal Ice Cubes */}
        <mesh geometry={iceGeometry} position={[0.92, 0.25, 0.25]} rotation={[0.4, 0.6, 0.2]}>
          <meshPhysicalMaterial
            transmission={0.94}
            roughness={0.05}
            ior={1.31}
            thickness={0.5}
            color="#E0F7FA"
            clearcoat={1.0}
          />
        </mesh>
        <mesh geometry={iceGeometry} position={[-0.88, -0.35, 0.35]} rotation={[0.2, 0.8, 0.5]} scale={[0.7, 0.7, 0.7]}>
          <meshPhysicalMaterial
            transmission={0.94}
            roughness={0.05}
            ior={1.31}
            thickness={0.5}
            color="#E0F7FA"
            clearcoat={1.0}
          />
        </mesh>

        {/* Wild Alpine Juniper Berries */}
        <mesh geometry={berryGeometry} position={[0.82, -0.32, -0.15]}>
          <meshStandardMaterial color="#1B3A2B" roughness={0.45} />
        </mesh>
        <mesh geometry={berryGeometry} position={[-0.75, 0.48, -0.2]}>
          <meshStandardMaterial color="#224231" roughness={0.45} />
        </mesh>
      </group>

      {/* Floating Charred Rosemary Botanical Sprig */}
      <mesh ref={rosemaryRef} geometry={rosemaryGeometry} position={[0.15, -0.2, 0.1]} rotation={[0.3, 0.4, 0.2]} renderOrder={1} visible={false}>
        <meshStandardMaterial color="#2E4A28" roughness={0.6} />
      </mesh>

      {/* Floating Purple Shiso Leaves Orbitals */}
      <group ref={shisoRef} position={[0.85, 0.1, 0]} renderOrder={4} visible={false}>
        <mesh rotation={[0.5, 0.3, 0.2]} scale={[0.18, 0.02, 0.26]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#4A154B" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
