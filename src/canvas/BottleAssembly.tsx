import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollStore, BaseDistillate } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';
import { createLiquidGradientTexture, LIQUID_PALETTES } from './LiquidShader';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidBodyRef = useRef<THREE.Mesh>(null);
  const liquidPuntRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const impactRingRef = useRef<THREE.Mesh>(null);
  const splashParticlesRef = useRef<THREE.InstancedMesh>(null);
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

      // Update liquid gradient map on base change
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

  // --- 4. Liquid Body Geometry (Cylinder column anchored at base -1.24) ---
  const liquidCylinderGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.426, 0.426, 1.0, 48, 1, false);
    geom.translate(0, 0.5, 0); // Anchor pivot at bottom
    return geom;
  }, []);

  // Inner punt dome liquid cap (snug at bottom -1.24)
  const liquidPuntGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.24));
    points.push(new THREE.Vector2(0.20, -1.22));
    points.push(new THREE.Vector2(0.426, -1.18));
    points.push(new THREE.Vector2(0.426, -1.14));
    points.push(new THREE.Vector2(0.0, -1.14));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  // Meniscus circular fluid surface disc
  const meniscusGeometry = useMemo(() => new THREE.CircleGeometry(0.424, 48), []);

  // Fluid impact ripple ring
  const impactGeometry = useMemo(() => new THREE.RingGeometry(0.02, 0.16, 32), []);

  // Tapered Laminar Pour Stream (From neck down to liquid surface)
  const streamGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.032, 0.022, 1.0, 24);
    geom.translate(0, -0.5, 0); // Anchor pivot at top
    return geom;
  }, []);

  // Portuguese Cork Geometry (Fits neck cavity)
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

  // Orbitals: Crystal Clear Hand-Cut Ice Cube & Botanical Juniper Spheres
  const iceGeometry = useMemo(() => new THREE.BoxGeometry(0.28, 0.28, 0.28), []);
  const berryGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 12, 12), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  const currentLiquidColor = useRef(new THREE.Color('#F59E0B'));
  const currentEmissiveColor = useRef(new THREE.Color('#78350F'));
  const currentStreamColor = useRef(new THREE.Color('#FBBF24'));

  // --- Animation Frame Loop ---
  useFrame((state, delta) => {
    scrollStore.updatePourPhysics(delta);

    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    if (!masterBottleRef.current) return;

    // --- Master Bottle Spatial Positioning & Clean Negative Space Separations ---
    let bX = 0;
    let bY = -0.16;
    let bRotX = 0.02;
    let bRotY = 0;
    let bRotZ = 0;

    if (p < 0.16) {
      // STAGE 1: GENESIS (Centered, pristine vessel, gentle breathing float)
      const t = p / 0.16;
      bY = -0.16 + Math.sin(time * 1.2) * 0.015;
      bX = 0;
      bRotY = THREE.MathUtils.lerp(0.0, 0.18, t);
    } else if (p < 0.36) {
      // STAGE 2: BASE DISTILLATE POUR (Bottle slides to RIGHT, Card on LEFT)
      const rawT = (p - 0.16) / 0.20;
      const t = Math.min(1.0, rawT * 2.5);
      bY = -0.14;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.85, t);
      bRotY = THREE.MathUtils.lerp(0.18, 0.28, t);
      bRotZ = THREE.MathUtils.lerp(0, -0.02, t);
    } else if (p < 0.56) {
      // STAGE 3: NOOTROPIC INFUSION (Bottle slides to LEFT, Card on RIGHT)
      const rawT = (p - 0.36) / 0.20;
      const t = Math.min(1.0, rawT * 2.5);
      bY = -0.16;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.85, -0.85, t);
      bRotY = THREE.MathUtils.lerp(0.28, 0.15, t);
      bRotX = THREE.MathUtils.lerp(0.02, 0.06, t);
    } else if (p < 0.74) {
      // STAGE 4: CHILL & SERVE ARCHITECTURE (Bottle stays on LEFT, Card on RIGHT)
      const rawT = (p - 0.56) / 0.18;
      const t = Math.min(1.0, rawT * 2.5);
      bY = -0.14;
      bX = isMobile ? 0 : -0.85;
      bRotY = THREE.MathUtils.lerp(0.15, -0.15, t);
      bRotZ = -0.02;
    } else if (p < 0.88) {
      // STAGE 5: BESPOKE LABEL ENGRAVING (Bottle on RIGHT, Card on LEFT, frontal face)
      const rawT = (p - 0.74) / 0.14;
      const t = Math.min(1.0, rawT * 2.5);
      bY = -0.12;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.85, 0.82, t);
      bRotY = THREE.MathUtils.lerp(-0.15, 0.0, t);
      bRotX = 0.01;
    } else {
      // STAGE 6: DISPATCH VAULT (Bottle on LEFT, Form on RIGHT)
      const rawT = Math.min(1, (p - 0.88) / 0.12);
      const t = Math.min(1.0, rawT * 2.5);
      bY = -0.14;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.82, -0.85, t);
      bRotY = THREE.MathUtils.lerp(0.0, 0.25, t) + (time * 0.12);
      bRotZ = -0.01;
    }

    // Smooth dampening
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 5, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 5, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, bRotX, 5, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 5, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, bRotZ, 5, delta);

    // --- Dynamic Factual Fluid Height Calculation ---
    const fLevel = pour.fillLevel;
    const maxFluidHeight = 1.84;
    const currentHeight = Math.max(0.001, fLevel * maxFluidHeight);
    const surfaceY = -1.24 + currentHeight;

    // --- Liquid Body Scaling & Positioning ---
    if (liquidBodyRef.current) {
      const showLiquid = fLevel > 0.005;
      liquidBodyRef.current.visible = showLiquid;
      if (showLiquid) {
        liquidBodyRef.current.scale.set(1, currentHeight, 1);
        liquidBodyRef.current.position.set(0, -1.24, 0);

        if (pour.isDraining) {
          liquidBodyRef.current.rotation.y += delta * 7.0;
        }

        // Inertial slosh
        const sloshZ = THREE.MathUtils.clamp(velocity * 0.008, -0.04, 0.04);
        const sloshX = THREE.MathUtils.clamp(velocity * 0.006, -0.03, 0.03);
        liquidBodyRef.current.rotation.z = THREE.MathUtils.damp(liquidBodyRef.current.rotation.z, sloshZ, 6, delta);
        liquidBodyRef.current.rotation.x = THREE.MathUtils.damp(liquidBodyRef.current.rotation.x, sloshX, 6, delta);
      }
    }

    if (liquidPuntRef.current) {
      liquidPuntRef.current.visible = fLevel > 0.005;
    }

    // --- Meniscus Fluid Surface Disc (Wets inner glass wall) ---
    if (meniscusRef.current) {
      const showMeniscus = fLevel > 0.015;
      meniscusRef.current.visible = showMeniscus;
      if (showMeniscus) {
        const wave = pour.isPouring ? Math.sin(time * 22) * 0.008 : 0;
        meniscusRef.current.position.y = surfaceY + wave;

        // Radius scales smoothly along the shoulder
        let rAtHeight = 0.424;
        if (surfaceY > 0.52) {
          const st = (surfaceY - 0.52) / 0.58;
          rAtHeight = THREE.MathUtils.lerp(0.424, 0.145, Math.min(1, st));
        }
        const scaleFactor = rAtHeight / 0.424;
        meniscusRef.current.scale.set(scaleFactor, scaleFactor, 1);
        meniscusRef.current.rotation.z += (pour.isDraining ? delta * 5.0 : delta * 0.1);
      }
    }

    // --- Dynamic Liquid Pouring Stream (Laminar flow from neck top) ---
    if (pourStreamRef.current && streamMaterialRef.current) {
      const isPouringActive = pour.isPouring;
      pourStreamRef.current.visible = isPouringActive;

      if (isPouringActive) {
        const streamOriginY = 1.55;
        const streamLength = Math.max(0.10, streamOriginY - surfaceY);
        const pulse = 1 + Math.sin(time * 30) * 0.18;

        pourStreamRef.current.scale.set(pulse, streamLength, pulse);
        pourStreamRef.current.position.set(0, streamOriginY, 0);

        streamMaterialRef.current.color.copy(currentStreamColor.current);
        streamMaterialRef.current.emissive.copy(currentLiquidColor.current);
      }
    }

    // --- Surface Impact Splash Ripple Ring ---
    if (impactRingRef.current && impactMaterialRef.current) {
      const showImpact = pour.isPouring && fLevel > 0.02;
      impactRingRef.current.visible = showImpact;
      if (showImpact) {
        impactRingRef.current.position.y = surfaceY + 0.006;
        const rippleScale = 1.0 + Math.sin(time * 24) * 0.45;
        impactRingRef.current.scale.set(rippleScale, rippleScale, 1);
        impactMaterialRef.current.color.copy(currentStreamColor.current);
      }
    }

    // --- Splash Particle Droplets (During active pour) ---
    if (splashParticlesRef.current) {
      const isPouring = pour.isPouring && fLevel > 0.03;
      splashParticlesRef.current.visible = isPouring;
      if (isPouring) {
        for (let i = 0; i < SPLASH_COUNT; i++) {
          const sp = splashData[i];
          const curTime = time * sp.speed + i;
          const cycle = (curTime % 1);
          const r = sp.dist + cycle * 0.10;
          const px = Math.cos(sp.angle) * r;
          const pz = Math.sin(sp.angle) * r;
          const py = surfaceY + Math.sin(cycle * Math.PI) * sp.height;
          const pScale = (1 - cycle) * 1.1;

          dummyPos.set(px, py, pz);
          dummyScale.setScalar(Math.max(0.001, pScale));
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          splashParticlesRef.current.setMatrixAt(i, dummyMatrix);
        }
        splashParticlesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- Dynamic Liquid Colors (Smooth Botanical Blend Lerping) ---
    const baseKey = (formula.base || 'yuzu') as BaseDistillate;
    const pal = LIQUID_PALETTES[baseKey] || LIQUID_PALETTES.yuzu;
    currentLiquidColor.current.lerp(new THREE.Color(pal.glow), delta * 4.0);
    currentEmissiveColor.current.lerp(new THREE.Color(pal.deepCore), delta * 4.0);
    currentStreamColor.current.lerp(new THREE.Color(pal.rimHighlight), delta * 4.0);

    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.color.copy(currentLiquidColor.current);
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
    }

    if (meniscusMaterialRef.current) {
      meniscusMaterialRef.current.color.copy(currentLiquidColor.current);
      meniscusMaterialRef.current.emissive.copy(currentEmissiveColor.current);
    }

    // --- Cap Medallion Material Transition ---
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

    // --- Stage 3: Exploded Mechanical Hardware Elevation ---
    let explodeAmount = 0;
    if (p >= 0.38 && p < 0.48) {
      explodeAmount = (p - 0.38) / 0.10;
    } else if (p >= 0.48 && p < 0.54) {
      explodeAmount = 1.0;
    } else if (p >= 0.54 && p < 0.60) {
      explodeAmount = 1.0 - (p - 0.54) / 0.06;
    }

    if (capGroupRef.current) {
      const capTargetY = explodeAmount * 0.65;
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * 0.25 * explodeAmount;
    }

    if (corkRef.current) {
      const corkTargetY = 1.22 + explodeAmount * 0.32;
      corkRef.current.position.y = THREE.MathUtils.damp(corkRef.current.position.y, corkTargetY, 5, delta);
    }

    // --- Stage 4: External Floating Botanical Orbitals ---
    if (orbitalsGroupRef.current) {
      const isStage4 = p >= 0.56 && p < 0.76;
      const targetScale = isStage4 ? 1.0 : 0.0;
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      orbitalsGroupRef.current.rotation.y += delta * 0.35;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.8) * 0.06;
    }

    // --- Glass Frost Sheen when 'Glacial Serve' is selected ---
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
          color="#F59E0B"
          emissive="#78350F"
          emissiveIntensity={0.45}
          roughness={0.04}
          metalness={0.02}
        />
      </mesh>

      {/* Main Liquid Column with Volumetric Gradient Map */}
      <mesh ref={liquidBodyRef} geometry={liquidCylinderGeometry} renderOrder={1} visible={false}>
        <meshStandardMaterial
          ref={liquidMaterialRef}
          map={liquidTextures.yuzu}
          color="#F59E0B"
          emissive="#78350F"
          emissiveIntensity={0.35}
          roughness={0.04}
          metalness={0.02}
        />
      </mesh>

      {/* Meniscus Top Disc */}
      <mesh ref={meniscusRef} geometry={meniscusGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} visible={false}>
        <meshStandardMaterial
          ref={meniscusMaterialRef}
          color="#F59E0B"
          emissive="#78350F"
          emissiveIntensity={0.25}
          roughness={0.08}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. POUR STREAM & SPLASHES                                                 */}
      {/* ========================================================================= */}

      {/* Laminar Pour Stream (Enters from top of bottle neck) */}
      <mesh ref={pourStreamRef} geometry={streamGeometry} renderOrder={3} visible={false}>
        <meshStandardMaterial
          ref={streamMaterialRef}
          color="#FBBF24"
          emissive="#D97706"
          emissiveIntensity={0.9}
          roughness={0.02}
          metalness={0.05}
        />
      </mesh>

      {/* Surface Impact Splash Ripple Ring */}
      <mesh ref={impactRingRef} geometry={impactGeometry} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3} visible={false}>
        <meshBasicMaterial ref={impactMaterialRef} color="#FBBF24" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Active Splash Droplets */}
      <instancedMesh
        ref={splashParticlesRef}
        args={[splashGeometry, undefined, SPLASH_COUNT]}
        renderOrder={3}
        visible={false}
      >
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#F59E0B"
          emissiveIntensity={0.7}
          roughness={0.02}
        />
      </instancedMesh>

      {/* ========================================================================= */}
      {/* 3. OPTICAL GLASS VESSEL (Refracts volumetric liquid and background)       */}
      {/* ========================================================================= */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} renderOrder={2} castShadow receiveShadow>
        <meshPhysicalMaterial
          transmission={0.95}
          roughness={0.015}
          ior={1.52}
          thickness={0.80}
          transparent={true}
          opacity={1.0}
          reflectivity={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.015}
          color="#FFFFFF"
          attenuationColor="#FAF6F0"
          attenuationDistance={2.4}
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
