import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollStore, BaseDistillate } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidVolumeRef = useRef<THREE.Mesh>(null);
  const meniscusRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const impactRingRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const condensationRef = useRef<THREE.InstancedMesh>(null);
  const particulatesRef = useRef<THREE.InstancedMesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const capMedallionRef = useRef<THREE.Mesh>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);

  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const meniscusMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // --- 1. Procedural Label Textures & Live 3D Texture Updater ---
  const { diffuseMap, bumpMap, updateLabel } = useMemo(() => createProceduralLabel(), []);

  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      const f = scrollStore.formula;
      updateLabel(f.customName, f.engravedInitials, f.seal);
    });
    return unsub;
  }, [updateLabel]);

  // --- 2. Heavy-Flint Borosilicate Glass Lathe Geometry ---
  // Authentic heavy punt, precision laboratory shoulder, knurled neck collar
  const glassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.35));    // Inner punt dome
    points.push(new THREE.Vector2(0.22, -1.38));
    points.push(new THREE.Vector2(0.48, -1.45));   // Heavy crystal base
    points.push(new THREE.Vector2(0.575, -1.43));
    points.push(new THREE.Vector2(0.585, -1.35));  // Outer base bevel
    points.push(new THREE.Vector2(0.585, -0.60));  // Straight optical cylinder
    points.push(new THREE.Vector2(0.585, 0.0));
    points.push(new THREE.Vector2(0.585, 0.55));
    points.push(new THREE.Vector2(0.565, 0.65));   // Curving apothecary shoulder
    points.push(new THREE.Vector2(0.48, 0.78));
    points.push(new THREE.Vector2(0.35, 0.88));
    points.push(new THREE.Vector2(0.24, 0.96));
    points.push(new THREE.Vector2(0.22, 1.05));    // Threaded neck collar
    points.push(new THREE.Vector2(0.22, 1.25));
    points.push(new THREE.Vector2(0.22, 1.38));
    points.push(new THREE.Vector2(0.255, 1.40));   // Beveled pouring lip
    points.push(new THREE.Vector2(0.255, 1.46));
    points.push(new THREE.Vector2(0.18, 1.47));    // Inner mouth aperture
    points.push(new THREE.Vector2(0.18, 1.38));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 3. Form-Fitted Liquid Inner Volume Geometry ---
  const liquidGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.22));    // Fits snug against inner punt
    points.push(new THREE.Vector2(0.35, -1.21));
    points.push(new THREE.Vector2(0.538, -1.18));  // Snug 0.538 inner radius
    points.push(new THREE.Vector2(0.538, 0.0));
    points.push(new THREE.Vector2(0.538, 0.55));
    points.push(new THREE.Vector2(0.51, 0.62));
    points.push(new THREE.Vector2(0.44, 0.68));
    points.push(new THREE.Vector2(0.28, 0.72));
    points.push(new THREE.Vector2(0.0, 0.71));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // Meniscus circular fluid surface disc with raised boundary rim
  const meniscusGeometry = useMemo(() => new THREE.CircleGeometry(0.536, 48), []);
  // Fluid impact ripple ring
  const impactGeometry = useMemo(() => new THREE.RingGeometry(0.02, 0.18, 32), []);

  // --- 4. Micro-Bubbles Setup (Instanced) ---
  const BUBBLE_COUNT = 150;
  const bubbleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 0.46;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -1.18 + Math.random() * 1.80;
      const scale = 0.007 + Math.random() * 0.015;
      const speed = 0.16 + Math.random() * 0.30;
      const wobbleSpeed = 1.8 + Math.random() * 2.8;
      const wobbleRadius = 0.012 + Math.random() * 0.022;
      data.push({ x, y, z, scale, speed, wobbleSpeed, wobbleRadius, seed: Math.random() * 10 });
    }
    return data;
  }, []);

  // --- 5. Suspended Botanical Colloidal Particulates (Lion's Mane / Schisandra) ---
  const PARTICULATE_COUNT = 90;
  const particulateData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICULATE_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 0.44;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -1.15 + Math.random() * 1.70;
      const scale = 0.008 + Math.random() * 0.012;
      const driftSpeed = 0.04 + Math.random() * 0.08;
      data.push({ x, y, z, scale, driftSpeed, seed: Math.random() * 10 });
    }
    return data;
  }, []);

  // --- 6. Surface Condensation Droplets ---
  const CONDENSATION_COUNT = 280;
  const condensationData = useMemo(() => {
    const data = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < CONDENSATION_COUNT; i++) {
      const t = i / CONDENSATION_COUNT;
      const y = -1.25 + t * 1.85;
      const angle = i * 2 * Math.PI * (phi - 1) + (Math.random() - 0.5) * 0.25;

      let r = 0.585;
      if (y > 0.55 && y <= 0.95) {
        const st = (y - 0.55) / 0.40;
        r = THREE.MathUtils.lerp(0.585, 0.225, st * st);
      } else if (y > 0.95) {
        r = 0.225;
      }

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const baseScale = 0.007 + Math.random() * 0.014;
      data.push({ x, y, z, angle, baseScale, elongation: 1.25 });
    }
    return data;
  }, []);

  // --- 7. Orbitals & Particle Geometries ---
  const iceGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(0.28, 0.28, 0.28, 3, 3, 3);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = (Math.sin(vx * 10) + Math.cos(vy * 10) + Math.sin(vz * 10)) * 0.016;
      pos.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 12, 12), []);
  const yuzuGeometry = useMemo(() => new THREE.CylinderGeometry(0.32, 0.32, 0.025, 24), []);
  // Gravity-accelerated tapered fluid stream
  const streamGeometry = useMemo(() => new THREE.CylinderGeometry(0.040, 0.026, 2.2, 24), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  // Photorealistic Beer-Lambert Law Palette
  const colorPalette = useMemo(() => ({
    yuzu: { 
      color: new THREE.Color('#D97706'),
      emissive: new THREE.Color('#451A03'), 
      attenuation: new THREE.Color('#FEF3C7'),
      particulate: new THREE.Color('#F59E0B')
    },
    blood_orange: { 
      color: new THREE.Color('#991B1B'),
      emissive: new THREE.Color('#3B0712'), 
      attenuation: new THREE.Color('#FFE4E6'),
      particulate: new THREE.Color('#DC2626')
    },
    juniper: { 
      color: new THREE.Color('#065F46'),
      emissive: new THREE.Color('#022C22'), 
      attenuation: new THREE.Color('#D1FAE5'),
      particulate: new THREE.Color('#10B981')
    },
  }), []);

  const currentLiquidColor = useRef(new THREE.Color('#D97706'));
  const currentEmissiveColor = useRef(new THREE.Color('#451A03'));
  const currentAttenuationColor = useRef(new THREE.Color('#FEF3C7'));

  // --- 8. Main 60fps/120fps Animation Loop ---
  useFrame((state, delta) => {
    // Advance fluid pouring & vortex draining physics
    scrollStore.updatePourPhysics(delta);

    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    if (!masterBottleRef.current) return;

    // --- Master Bottle Spatial Positioning Across All Stages ---
    let bX = 0;
    let bY = 0;
    let bRotX = 0;
    let bRotY = 0;
    let bRotZ = 0;

    if (p < 0.16) {
      // STAGE 1: GENESIS (Clean, centered hero, comfortable framing)
      const t = p / 0.16;
      bY = THREE.MathUtils.lerp(-0.14, 0.02, t);
      bX = 0;
      bRotY = THREE.MathUtils.lerp(-0.25, Math.PI * 0.40, t);
      bRotZ = THREE.MathUtils.lerp(0.02, -0.01, t);
      bRotX = 0.02;
    } else if (p < 0.36) {
      // STAGE 2: BASE DISTILLATE POUR (Bottle slides to right with generous negative space)
      const t = (p - 0.16) / 0.20;
      bY = THREE.MathUtils.lerp(0.02, 0.05, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.44, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 0.40, Math.PI * 1.80, t);
      bRotZ = THREE.MathUtils.lerp(-0.01, -0.04, t);
      bRotX = 0.02;
    } else if (p < 0.56) {
      // STAGE 3: NOOTROPIC INFUSION & EXPLODED FORMULATION
      const t = (p - 0.36) / 0.20;
      bY = THREE.MathUtils.lerp(0.05, 0.0, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.44, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 1.80, Math.PI * 2.80, t);
      bRotZ = 0;
      bRotX = THREE.MathUtils.lerp(0.02, 0.12, t);
    } else if (p < 0.74) {
      // STAGE 4: CHILL & SERVE ARCHITECTURE (Bottle shifts left)
      const t = (p - 0.56) / 0.18;
      bY = 0.02;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.50, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 2.80, Math.PI * 3.80, t);
      bRotZ = -0.03;
      bRotX = 0.02;
    } else if (p < 0.88) {
      // STAGE 5: BESPOKE LABEL PERSONALIZATION (Centered, frontal view facing camera)
      const t = (p - 0.74) / 0.14;
      bY = 0.04;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.50, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 3.80, Math.PI * 4.0, t);
      bRotZ = 0;
      bRotX = 0.01;
    } else {
      // STAGE 6: DISPATCH VAULT (Bottle on left, checkout form on right)
      const t = Math.min(1, (p - 0.88) / 0.12);
      bY = 0.05;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.52, t);
      bRotY = Math.PI * 4.0 + (time * 0.16);
      bRotZ = -0.02;
      bRotX = 0.02;
    }

    // Apply smoothed motion
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 4.5, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 4.5, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, bRotX, 4.5, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 4.5, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, bRotZ, 4.5, delta);

    // Calculate factual fluid surface height based on proportional volume (0 to 500mL)
    const fLevel = pour.fillLevel;
    const surfaceY = -1.22 + fLevel * 1.84;

    // --- Dynamic Liquid Pouring Stream (Visible during active pour) ---
    if (pourStreamRef.current) {
      const isPouringActive = pour.isPouring;
      pourStreamRef.current.visible = isPouringActive;
      if (isPouringActive) {
        const streamTop = 1.45;
        const streamHeight = Math.max(0.12, streamTop - surfaceY);
        pourStreamRef.current.scale.set(
          1 + Math.sin(time * 24) * 0.12,
          streamHeight / 2.2,
          1 + Math.cos(time * 20) * 0.12
        );
        pourStreamRef.current.position.set(
          Math.sin(time * 26) * 0.008,
          surfaceY + streamHeight * 0.5,
          Math.cos(time * 22) * 0.008
        );
      }
    }

    // --- Surface Impact Ripple Ring ---
    if (impactRingRef.current) {
      const showImpact = pour.isPouring && fLevel > 0.02;
      impactRingRef.current.visible = showImpact;
      if (showImpact) {
        impactRingRef.current.position.y = surfaceY + 0.006;
        const rippleScale = 1.0 + Math.sin(time * 18) * 0.35;
        impactRingRef.current.scale.set(rippleScale, rippleScale, 1);
      }
    }

    // --- Dynamic Liquid Core Filling & Vortex Drain ---
    if (liquidVolumeRef.current) {
      liquidVolumeRef.current.visible = fLevel > 0.008;

      if (fLevel > 0.008) {
        const currentScaleY = Math.max(0.001, fLevel);
        liquidVolumeRef.current.scale.set(1, currentScaleY, 1);
        liquidVolumeRef.current.position.y = -1.22 * (1 - currentScaleY);

        // Vortex spin when draining
        if (pour.isDraining) {
          liquidVolumeRef.current.rotation.y += delta * 4.5;
        }

        // Fluid inertia slosh responding to velocity and pour stream
        const sloshZ = THREE.MathUtils.clamp(velocity * 0.010, -0.05, 0.05) + (pour.isPouring ? Math.sin(time * 16) * 0.012 : 0);
        const sloshX = THREE.MathUtils.clamp(velocity * 0.008, -0.04, 0.04) + (pour.isPouring ? Math.cos(time * 14) * 0.012 : 0);
        liquidVolumeRef.current.rotation.z = THREE.MathUtils.damp(liquidVolumeRef.current.rotation.z, sloshZ, 5, delta);
        liquidVolumeRef.current.rotation.x = THREE.MathUtils.damp(liquidVolumeRef.current.rotation.x, sloshX, 5, delta);
      }
    }

    // --- Meniscus Fluid Surface Disk (Glistening wet top cap) ---
    if (meniscusRef.current) {
      const showMeniscus = fLevel > 0.02;
      meniscusRef.current.visible = showMeniscus;
      if (showMeniscus) {
        const rippleY = (pour.isPouring ? Math.sin(time * 18) * 0.006 : 0);
        meniscusRef.current.position.y = surfaceY + rippleY;
        const meniscusScale = pour.isDraining ? Math.max(0.2, fLevel) : 1.0;
        meniscusRef.current.scale.set(meniscusScale, meniscusScale, 1);
        meniscusRef.current.rotation.z += (pour.isDraining ? delta * 4.0 : delta * 0.15);
      }
    }

    // --- Dynamic Liquid Color Transition ---
    if (liquidMaterialRef.current) {
      const baseKey = (formula.base || 'yuzu') as BaseDistillate;
      const activePalette = colorPalette[baseKey] || colorPalette.yuzu;
      currentLiquidColor.current.lerp(activePalette.color, delta * 3.5);
      currentEmissiveColor.current.lerp(activePalette.emissive, delta * 3.5);
      currentAttenuationColor.current.lerp(activePalette.attenuation, delta * 3.5);

      liquidMaterialRef.current.color.copy(currentLiquidColor.current);
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      liquidMaterialRef.current.attenuationColor.copy(currentAttenuationColor.current);

      if (meniscusMaterialRef.current) {
        meniscusMaterialRef.current.color.copy(currentLiquidColor.current);
        meniscusMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      }
    }

    // --- Cap Medallion Material Transition ---
    if (capMedallionRef.current) {
      const mat = capMedallionRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        let targetMedallion = '#C59B27'; // Brass
        if (formula.seal === 'noir') targetMedallion = '#22201D';
        else if (formula.seal === 'copper') targetMedallion = '#B3542E';
        mat.color.lerp(new THREE.Color(targetMedallion), delta * 4);
      }
    }

    // --- Stage 3: Exploded Mechanical Formulation ---
    let e = 0;
    if (p >= 0.38 && p < 0.48) {
      e = (p - 0.38) / 0.10;
    } else if (p >= 0.48 && p < 0.54) {
      e = 1.0;
    } else if (p >= 0.54 && p < 0.60) {
      e = 1.0 - (p - 0.54) / 0.06;
    } else {
      e = 0;
    }

    if (capGroupRef.current) {
      const capTargetY = 0 + e * 0.95;
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * 0.35 * e;
    }

    if (orbitalsGroupRef.current) {
      const targetScale = Math.max(e, formula.chill === 'glacial' && p >= 0.58 && p < 0.78 ? 0.85 : 0);
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      orbitalsGroupRef.current.rotation.y += delta * 0.22;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
    }

    // --- Micro-Bubbles Animation (Only active when liquid has poured in) ---
    if (bubblesRef.current) {
      const isLiquidPresent = pour.fillLevel > 0.08;
      bubblesRef.current.visible = isLiquidPresent;
      if (isLiquidPresent) {
        const maxY = surfaceY - 0.02;
        const bubbleSpeedMultiplier = (formula.chill === 'glacial' ? 1.6 : 1.0) + (pour.isPouring ? 2.5 : 0);
        for (let i = 0; i < BUBBLE_COUNT; i++) {
          const b = bubbleData[i];
          b.y += delta * b.speed * bubbleSpeedMultiplier;
          if (b.y > maxY) b.y = -1.15;

          const currentAngle = b.seed + time * b.wobbleSpeed;
          const driftX = b.x + Math.sin(currentAngle) * b.wobbleRadius;
          const driftZ = b.z + Math.cos(currentAngle) * b.wobbleRadius;
          dummyPos.set(driftX, b.y, driftZ);
          dummyScale.setScalar(b.scale);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          bubblesRef.current.setMatrixAt(i, dummyMatrix);
        }
        bubblesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- Suspended Botanical Colloidal Particulates ---
    if (particulatesRef.current) {
      const showParticulates = fLevel > 0.12 && (formula.nootropic !== null || formula.modifier !== null);
      particulatesRef.current.visible = showParticulates;
      if (showParticulates) {
        const maxY = surfaceY - 0.04;
        for (let i = 0; i < PARTICULATE_COUNT; i++) {
          const pt = particulateData[i];
          pt.y += delta * pt.driftSpeed * 0.5;
          if (pt.y > maxY) pt.y = -1.15;

          const angle = pt.seed + time * 0.8;
          dummyPos.set(pt.x + Math.sin(angle) * 0.02, pt.y, pt.z + Math.cos(angle) * 0.02);
          dummyScale.setScalar(pt.scale);
          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          particulatesRef.current.setMatrixAt(i, dummyMatrix);
        }
        particulatesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // --- Surface Condensation Droplets (Form when chill === 'glacial' and liquid poured) ---
    if (condensationRef.current) {
      const showCondensation = formula.chill === 'glacial' && pour.fillLevel > 0.15 && p >= 0.20;
      condensationRef.current.visible = showCondensation;
      if (showCondensation) {
        for (let i = 0; i < CONDENSATION_COUNT; i++) {
          const c = condensationData[i];
          dummyPos.set(c.x, c.y, c.z);
          const normalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), c.angle);
          const finalScale = c.baseScale * 1.25;
          dummyScale.set(finalScale, finalScale * c.elongation, finalScale * 0.6);
          dummyMatrix.compose(dummyPos, normalQuat, dummyScale);
          condensationRef.current.setMatrixAt(i, dummyMatrix);
        }
        condensationRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={masterBottleRef} position={[0, -0.14, 0]}>
      {/* 1. Heavy-Flint Borosilicate Apothecary Glass Vessel */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          transmission={0.98}
          roughness={0.015}
          ior={1.51}
          thickness={0.65}
          transparent={true}
          opacity={1.0}
          reflectivity={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          color="#FFFFFF"
          attenuationColor="#F4EFEA"
          attenuationDistance={1.8}
        />
      </mesh>

      {/* 2. Live Pouring Stream (Laminar gravity-tapered flow) */}
      <mesh ref={pourStreamRef} geometry={streamGeometry} visible={false}>
        <meshPhysicalMaterial
          ref={liquidMaterialRef}
          color="#D97706"
          emissive="#451A03"
          emissiveIntensity={0.25}
          roughness={0.02}
          transmission={0.88}
          ior={1.345}
          thickness={0.65}
          transparent={true}
          opacity={0.95}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Surface Impact Ripple Ring */}
      <mesh ref={impactRingRef} geometry={impactGeometry} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <meshBasicMaterial color="#FFFBEB" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* 4. Photorealistic Beer-Lambert Liquid Core Volume */}
      <mesh ref={liquidVolumeRef} geometry={liquidGeometry}>
        <meshPhysicalMaterial
          color="#D97706"
          emissive="#451A03"
          emissiveIntensity={0.16}
          transmission={0.88}
          ior={1.345}
          roughness={0.02}
          thickness={0.92}
          attenuationDistance={0.44}
          attenuationColor="#FEF3C7"
          transparent={true}
          opacity={0.97}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
        />
      </mesh>

      {/* 5. Glistening Fluid Surface Meniscus Disc */}
      <mesh ref={meniscusRef} geometry={meniscusGeometry} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <meshPhysicalMaterial
          ref={meniscusMaterialRef}
          color="#D97706"
          emissive="#451A03"
          emissiveIntensity={0.2}
          roughness={0.012}
          reflectivity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          transmission={0.78}
          transparent={true}
          opacity={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 6. Micro-Bubbles (Instanced) */}
      <instancedMesh
        ref={bubblesRef}
        args={[sphereGeometry, undefined, BUBBLE_COUNT]}
      >
        <meshStandardMaterial
          color="#FFF8E7"
          roughness={0.03}
          metalness={0.1}
          opacity={0.85}
          transparent={true}
          emissive="#D97706"
          emissiveIntensity={0.22}
        />
      </instancedMesh>

      {/* 7. Suspended Botanical Colloidal Particulates */}
      <instancedMesh
        ref={particulatesRef}
        args={[sphereGeometry, undefined, PARTICULATE_COUNT]}
      >
        <meshStandardMaterial
          color="#D97706"
          roughness={0.3}
          metalness={0.1}
          opacity={0.65}
          transparent={true}
        />
      </instancedMesh>

      {/* 8. Surface Condensation Droplets */}
      <instancedMesh
        ref={condensationRef}
        args={[sphereGeometry, undefined, CONDENSATION_COUNT]}
      >
        <meshPhysicalMaterial
          roughness={0.015}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          reflectivity={0.96}
          opacity={0.90}
          transparent={true}
          color="#FFFFFF"
        />
      </instancedMesh>

      {/* 9. Knurled Atelier Cap & Medallion */}
      <group ref={capGroupRef}>
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.265, 0.265, 0.34, 48]} />
          <meshStandardMaterial color="#2B2825" metalness={0.85} roughness={0.32} />
        </mesh>

        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.272, 0.272, 0.22, 64]} />
          <meshStandardMaterial color="#201E1C" metalness={0.90} roughness={0.38} />
        </mesh>

        {/* Dynamic Seal Medallion */}
        <mesh ref={capMedallionRef} position={[0, 1.652, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.02, 36]} />
          <meshStandardMaterial color="#C59B27" metalness={0.88} roughness={0.25} />
        </mesh>

        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.232, 0.232, 0.16, 36]} />
          <meshStandardMaterial color="#171614" metalness={0.65} roughness={0.45} />
        </mesh>
      </group>

      {/* 10. Dynamic Procedural Parchment Label */}
      <mesh ref={labelMeshRef} position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.586, 0.586, 1.15, 48, 1, true, -Math.PI * 0.55, Math.PI * 1.1]} />
        <meshStandardMaterial
          map={diffuseMap}
          bumpMap={bumpMap}
          bumpScale={0.007}
          roughness={0.42}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 11. Floating Botanical & Ice Orbitals */}
      <group ref={orbitalsGroupRef} scale={0}>
        <mesh geometry={iceGeometry} position={[0.78, 0.42, 0.35]} rotation={[0.4, 0.6, 0.2]}>
          <meshPhysicalMaterial
            transmission={0.96}
            roughness={0.08}
            ior={1.31}
            thickness={0.5}
            transparent={true}
            color="#EBF4F6"
          />
        </mesh>

        <mesh geometry={iceGeometry} position={[-0.72, -0.25, 0.48]} rotation={[-0.3, 0.8, 0.5]} scale={0.7}>
          <meshPhysicalMaterial
            transmission={0.96}
            roughness={0.08}
            ior={1.31}
            thickness={0.4}
            transparent={true}
            color="#EBF4F6"
          />
        </mesh>

        <mesh position={[0.65, -0.45, -0.35]} scale={0.065}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#C2410C" roughness={0.4} />
        </mesh>
        <mesh position={[-0.58, 0.55, -0.28]} scale={0.055}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>

        <mesh geometry={yuzuGeometry} position={[-0.68, 0.15, 0.42]} rotation={[1.2, 0.4, -0.5]} scale={0.65}>
          <meshStandardMaterial color="#D97706" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
