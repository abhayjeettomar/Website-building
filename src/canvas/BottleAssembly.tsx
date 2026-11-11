import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollStore, BaseDistillate } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';
import { createLiquidGradientTexture, LIQUID_PALETTES } from './LiquidShader';
import { fluidPhysics } from '../utils/fluidPhysics';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidBodyRef = useRef<THREE.Mesh>(null);
  const liquidPuntRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const impactRingRef = useRef<THREE.Mesh>(null);
  const splashParticlesRef = useRef<THREE.InstancedMesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const corkRef = useRef<THREE.Mesh>(null);
  const capMedallionRef = useRef<THREE.Mesh>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);

  const liquidMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const meniscusMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const streamMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const impactMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

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
      updateLabel(f.customName, f.engravedInitials, f.seal);

      const baseKey = f.base || 'yuzu';
      const tex = liquidTextures[baseKey] || liquidTextures.yuzu;
      if (liquidMaterialRef.current && liquidMaterialRef.current.map !== tex) {
        liquidMaterialRef.current.map = tex;
        liquidMaterialRef.current.needsUpdate = true;
      }
    });
    return unsub;
  }, [updateLabel, liquidTextures]);

  // --- 3. Architectural Luxury Decanter Lathe Geometry ---
  const glassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.30));    // Deep punt apex
    points.push(new THREE.Vector2(0.18, -1.34));
    points.push(new THREE.Vector2(0.38, -1.45));   // Heavy crystal base floor
    points.push(new THREE.Vector2(0.46, -1.43));
    points.push(new THREE.Vector2(0.47, -1.38));   // Beveled base heel
    points.push(new THREE.Vector2(0.47, -0.60));   // Slim optical cylinder wall
    points.push(new THREE.Vector2(0.47, 0.0));
    points.push(new THREE.Vector2(0.47, 0.52));
    points.push(new THREE.Vector2(0.45, 0.64));   // Elegant tapered shoulder
    points.push(new THREE.Vector2(0.38, 0.78));
    points.push(new THREE.Vector2(0.26, 0.90));
    points.push(new THREE.Vector2(0.18, 1.00));
    points.push(new THREE.Vector2(0.165, 1.10));  // Precision fluted neck
    points.push(new THREE.Vector2(0.165, 1.30));
    points.push(new THREE.Vector2(0.20, 1.33));   // Beveled apothecary lip
    points.push(new THREE.Vector2(0.20, 1.38));
    points.push(new THREE.Vector2(0.135, 1.39));  // Inner aperture
    points.push(new THREE.Vector2(0.135, 1.25));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 4. Liquid Body Geometry (Strictly calibrated within inner glass bore r=0.412) ---
  const liquidCylinderGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.412, 0.412, 1.0, 48, 1, false);
    geom.translate(0, 0.5, 0); // Anchor pivot at bottom
    return geom;
  }, []);

  // Inner punt dome liquid cap (snug at bottom -1.24 to -1.18)
  const liquidPuntGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.24));
    points.push(new THREE.Vector2(0.18, -1.22));
    points.push(new THREE.Vector2(0.412, -1.18));
    points.push(new THREE.Vector2(0.412, -1.14));
    points.push(new THREE.Vector2(0.0, -1.14));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  // Meniscus circular fluid surface disc (snug r=0.410, capillary rim tension)
  const meniscusGeometry = useMemo(() => {
    const geom = new THREE.RingGeometry(0.0, 0.410, 36, 6);
    const pos = geom.attributes.position;
    // Elevate outer boundary vertices slightly to create physical capillary meniscus curvature
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const r = Math.sqrt(vx * vx + vy * vy) / 0.410;
      // Capillary adhesion curve
      pos.setZ(i, Math.pow(r, 4) * 0.014);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Fluid impact ripple ring
  const impactGeometry = useMemo(() => new THREE.RingGeometry(0.02, 0.20, 36), []);

  // Tapered Laminar Pour Stream (Gravity accelerated narrowing from nozzle down to surface)
  const streamGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.016, 0.010, 1.0, 24);
    geom.translate(0, -0.5, 0); // Anchor pivot at top
    return geom;
  }, []);

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

  // Splash particle droplets
  const SPLASH_COUNT = 16;
  const splashGeometry = useMemo(() => new THREE.SphereGeometry(0.015, 8, 8), []);
  const splashData = useMemo(() => {
    return Array.from({ length: SPLASH_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.03 + Math.random() * 0.09,
      height: 0.04 + Math.random() * 0.14,
      speed: 10 + Math.random() * 8
    }));
  }, []);

  // Effervescent Micro-Bubbles (35 bubbles suspended in the liquid that drift with slosh physics)
  const BUBBLE_COUNT = 35;
  const bubbleGeometry = useMemo(() => new THREE.SphereGeometry(0.009, 8, 8), []);
  const bubbleData = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      r: Math.sqrt(Math.random()) * 0.36,
      angle: Math.random() * Math.PI * 2,
      y: -1.20 + Math.random() * 1.5,
      speed: 0.12 + Math.random() * 0.24,
      wobbleSeed: Math.random() * 10
    }));
  }, []);

  // Orbitals: Crystal Clear Hand-Cut Ice Cube & Botanical Juniper Spheres
  const iceGeometry = useMemo(() => new THREE.BoxGeometry(0.28, 0.28, 0.28), []);
  const berryGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 12, 12), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  const currentLiquidColor = useRef(new THREE.Color('#F59E0B'));
  const currentEmissiveColor = useRef(new THREE.Color('#582103'));
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

    // --- 1. Continuous Parametric Scroll Trajectory (Never Static) ---
    // Every single pixel of scroll produces continuous cinematic choreography!
    let bX = 0;
    let bY = -0.16;
    // Continuous rotation across the 100% scroll span
    let bRotY = 0.12 + p * Math.PI * 2.2;

    if (p < 0.16) {
      // Stage 1: Genesis (Center hero, breathing float)
      const t = p / 0.16;
      bX = 0;
      bY = -0.16 + Math.sin(time * 1.2) * 0.015;
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
      // Smoothly turns to 0.15 radians so the engraved label squarely faces the viewer!
      bRotY = THREE.MathUtils.lerp(1.85, 0.15, Math.min(1.0, t * 1.3));
    } else {
      // Stage 6: Dispatch Vault (Glides to left presentation, slow showroom turntable rotation)
      const t = Math.min(1, (p - 0.88) / 0.12);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.82, -0.85, Math.min(1.0, t * 1.4));
      bY = -0.14;
      bRotY = 0.15 + Math.sin(time * 0.6) * 0.18;
    }

    // --- 2. Dynamic Scroll Velocity & Cursor Aerodynamics ---
    // When the user scrolls fast, the bottle dynamically leans into the motion!
    const scrollLeanX = THREE.MathUtils.clamp(velocity * 0.0016, -0.12, 0.12);
    const scrollLeanZ = THREE.MathUtils.clamp(-velocity * 0.0012, -0.10, 0.10);
    const cursorTiltX = cursor.y * 0.05;
    const cursorTiltZ = -cursor.x * 0.06;

    const targetRotX = 0.02 + scrollLeanX + cursorTiltX;
    const targetRotZ = scrollLeanZ + cursorTiltZ;

    // Smooth master bottle spring dampening
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 5, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 5, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, targetRotX, 5, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 5, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, targetRotZ, 5, delta);

    // --- 3. Fluid Physics Engine & Real-Time Gravity Alignment ---
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

    // Dynamic fluid height (anchored at -1.18, 500mL reaches exactly 0.40 below shoulder)
    const fLevel = pour.fillLevel;
    const maxFluidHeight = 1.58;
    const currentHeight = Math.max(0.001, fLevel * maxFluidHeight);
    const surfaceY = -1.18 + currentHeight;

    // --- 4. Liquid Body Scaling (Upright inside inner bore, zero glass clipping) ---
    if (liquidBodyRef.current) {
      const showLiquid = fLevel > 0.005;
      liquidBodyRef.current.visible = showLiquid;
      if (showLiquid) {
        liquidBodyRef.current.scale.set(1, currentHeight, 1);
        liquidBodyRef.current.position.set(0, -1.18, 0);

        if (pour.isDraining) {
          liquidBodyRef.current.rotation.y += delta * 8.5;
        }

        // Fluid cylinder stays upright within inner bore - slosh is expressed on meniscus surface!
        liquidBodyRef.current.rotation.x = 0;
        liquidBodyRef.current.rotation.z = 0;
      }
    }

    if (liquidPuntRef.current) {
      liquidPuntRef.current.visible = fLevel > 0.005;
      if (pour.isDraining) {
        liquidPuntRef.current.rotation.y += delta * 8.5;
      }
    }

    // --- 5. Meniscus Surface Disc (Gravity-Aligned Capillary Seal with Slosh Tilt & Vortex) ---
    if (meniscusRef.current) {
      const showMeniscus = fLevel > 0.015;
      meniscusRef.current.visible = showMeniscus;
      if (showMeniscus) {
        // Surface wave ripple during pour or scroll slosh
        const surfaceWave = fluidPhysics.getSurfaceWave(0.1, time);
        const vortexOffset = fluidPhysics.getVortexOffset(0.0);
        meniscusRef.current.position.y = surfaceY + surfaceWave + vortexOffset;

        // Counter-rotate meniscus to stay flat relative to real-world gravity!
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
        for (let i = 0; i < BUBBLE_COUNT; i++) {
          const b = bubbleData[i];
          b.y += delta * b.speed * (formula.chill === 'glacial' ? 1.5 : 1.0);
          if (b.y > maxY) b.y = -1.18;

          // Bubbles drift with fluid slosh angle!
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

    // --- 7. Laminar Pour Stream (Refracted Inside Vessel) ---
    if (pourStreamRef.current && streamMaterialRef.current) {
      const isPouringActive = pour.isPouring;
      pourStreamRef.current.visible = isPouringActive;

      if (isPouringActive) {
        const streamOriginY = 2.05;
        const streamLength = Math.max(0.08, streamOriginY - surfaceY);
        const pulse = 1 + Math.sin(time * 26) * 0.08;

        pourStreamRef.current.scale.set(pulse, streamLength, pulse);
        pourStreamRef.current.position.set(0, streamOriginY, 0);
        pourStreamRef.current.rotation.y += delta * 12.0;

        streamMaterialRef.current.color.copy(currentLiquidColor.current);
      }
    }

    // --- 8. Surface Impact Splash Ripple Ring ---
    if (impactRingRef.current && impactMaterialRef.current) {
      const showImpact = pour.isPouring && fLevel > 0.02;
      impactRingRef.current.visible = showImpact;
      if (showImpact) {
        impactRingRef.current.position.y = surfaceY + 0.005;
        const ripplePhase = (time * 3.5) % 1;
        const rippleScale = 0.6 + ripplePhase * 1.6;
        impactRingRef.current.scale.set(rippleScale, rippleScale, 1);
        impactMaterialRef.current.opacity = (1 - ripplePhase) * 0.75;
        impactMaterialRef.current.color.copy(currentStreamColor.current);
      }
    }

    // --- 9. Splash Particle Droplets (During active pour) ---
    if (splashParticlesRef.current) {
      const isPouring = pour.isPouring && fLevel > 0.03;
      splashParticlesRef.current.visible = isPouring;
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

    // --- 10. Dynamic Liquid Color Transitions ---
    const baseKey = (formula.base || 'yuzu') as BaseDistillate;
    const pal = LIQUID_PALETTES[baseKey] || LIQUID_PALETTES.yuzu;
    currentLiquidColor.current.lerp(new THREE.Color(pal.glow), delta * 4.0);
    currentEmissiveColor.current.lerp(new THREE.Color(pal.deepCore), delta * 4.0);
    currentStreamColor.current.lerp(new THREE.Color(pal.rimHighlight), delta * 4.0);

    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.color.set('#FFFFFF'); // Pure absorption map readout
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      liquidMaterialRef.current.emissiveIntensity = 0.03; // Subtle optical depth, no cartoon neon!
    }

    if (meniscusMaterialRef.current) {
      meniscusMaterialRef.current.color.copy(currentLiquidColor.current);
      meniscusMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      meniscusMaterialRef.current.emissiveIntensity = 0.03;
    }

    // --- 11. Cap Medallion Material Transition ---
    if (capMedallionRef.current) {
      const mat = capMedallionRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        let targetColor = '#D4AF37';
        let metalness = 0.95;
        let roughness = 0.22;
        if (formula.seal === 'noir') {
          targetColor = '#1F1D1A';
          roughness = 0.35;
        } else if (formula.seal === 'copper') {
          targetColor = '#B3542E';
          roughness = 0.26;
        }
        mat.color.lerp(new THREE.Color(targetColor), delta * 4);
        mat.metalness = metalness;
        mat.roughness = roughness;
      }
    }

    // --- 12. Stage 3: Exploded Hardware View Elevation ---
    let explodeAmount = 0;
    if (p >= 0.38 && p < 0.48) {
      explodeAmount = (p - 0.38) / 0.10;
    } else if (p >= 0.48 && p < 0.54) {
      explodeAmount = 1.0;
    } else if (p >= 0.54 && p < 0.60) {
      explodeAmount = 1.0 - (p - 0.54) / 0.06;
    }

    // Elevate stopper if pouring or in exploded view
    let capTargetY = 0;
    let corkTargetY = 1.22;
    if (explodeAmount > 0) {
      capTargetY = explodeAmount * 0.65;
      corkTargetY = 1.22 + explodeAmount * 0.32;
    } else if (pour.isPouring) {
      // Elevate stopper and cork safely above bottle mouth aperture (1.39) during pour
      capTargetY = 0.58;
      corkTargetY = 1.65;
    }

    if (capGroupRef.current) {
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * (0.25 * explodeAmount + (pour.isPouring ? 0.3 : 0));
    }

    if (corkRef.current) {
      corkRef.current.position.y = THREE.MathUtils.damp(corkRef.current.position.y, corkTargetY, 5, delta);
    }

    // --- 13. Stage 4: External Floating Botanical Orbitals ---
    if (orbitalsGroupRef.current) {
      const isStage4 = p >= 0.56 && p < 0.76;
      const targetScale = isStage4 ? 1.0 : 0.0;
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      orbitalsGroupRef.current.rotation.y += delta * 0.35;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.8) * 0.06;
    }

    // --- 14. Glass Frost Sheen when 'Glacial Serve' is active ---
    if (outerGlassRef.current) {
      const glassMat = outerGlassRef.current.material as THREE.MeshPhysicalMaterial;
      if (glassMat) {
        const targetRoughness = (formula.chill === 'glacial' && p >= 0.56) ? 0.08 : 0.015;
        glassMat.roughness = THREE.MathUtils.damp(glassMat.roughness, targetRoughness, 3, delta);
      }
    }
  });

  return (
    <group ref={masterBottleRef} scale={[0.88, 0.88, 0.88]} position={[0, -0.16, 0]}>
      {/* ========================================================================= */}
      {/* 1. LIQUID MESHES (Rendered with Volumetric Gradient Map)                  */}
      {/* ========================================================================= */}
      
      {/* Inner Punt Dome Liquid Cap */}
      <mesh ref={liquidPuntRef} geometry={liquidPuntGeometry} renderOrder={1} visible={false}>
        <meshStandardMaterial
          map={liquidTextures.yuzu}
          color="#FFFFFF"
          emissive="#120600"
          emissiveIntensity={0.03}
          roughness={0.018}
          metalness={0.0}
        />
      </mesh>

      {/* Main Liquid Column with Volumetric Gradient Map */}
      <mesh ref={liquidBodyRef} geometry={liquidCylinderGeometry} renderOrder={1} visible={false}>
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

      {/* Meniscus Top Disc with Capillary Curvature */}
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

      {/* ========================================================================= */}
      {/* 2. POUR STREAM & SPLASHES (Rendered INSIDE Glass with renderOrder=1)       */}
      {/* ========================================================================= */}

      {/* Laminar Pour Stream (Refracted through outer glass) */}
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
      {/* 3. OPTICAL GLASS VESSEL (Refracts volumetric liquid and background)       */}
      {/* ========================================================================= */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} renderOrder={2} castShadow receiveShadow>
        <meshPhysicalMaterial
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
      {/* 4. HARDWARE: CORK, STOPPER, LABEL, ORBITALS (renderOrder = 4)             */}
      {/* ========================================================================= */}

      {/* Precision Inset Portuguese Cork Ring */}
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

      {/* Embossed Ivory Parchment Botanical Label */}
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

      {/* External Floating Botanical Orbitals (Stage 4) */}
      <group ref={orbitalsGroupRef} scale={[0, 0, 0]} position={[0, 0.1, 0]} renderOrder={4}>
        {/* Hand-Cut Crystal Ice Cube (Gently floating at safe r = 0.95) */}
        <mesh geometry={iceGeometry} position={[0.92, 0.25, 0.25]} rotation={[0.4, 0.6, 0.2]}>
          <meshPhysicalMaterial
            transmission={0.96}
            roughness={0.02}
            ior={1.31}
            thickness={0.6}
            transparent
            opacity={0.95}
            color="#FFFFFF"
            clearcoat={1.0}
          />
        </mesh>

        {/* Botanical Juniper Berry */}
        <mesh geometry={berryGeometry} position={[0.75, -0.25, 0.45]}>
          <meshStandardMaterial
            color="#064E3B"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        <mesh geometry={berryGeometry} position={[0.85, 0.65, 0.35]}>
          <meshStandardMaterial
            color="#047857"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}
