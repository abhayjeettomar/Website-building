import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { scrollStore, BaseDistillate } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidCoreRef = useRef<THREE.Mesh>(null);
  const pourStreamRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const condensationRef = useRef<THREE.InstancedMesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const capMedallionRef = useRef<THREE.Mesh>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);

  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // --- 1. Procedural Label Textures & Live 3D Texture Updater ---
  const { diffuseMap, bumpMap, updateLabel } = useMemo(() => createProceduralLabel(), []);

  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      const f = scrollStore.formula;
      updateLabel(f.customName, f.engravedInitials, f.seal);
    });
    return unsub;
  }, [updateLabel]);

  // --- 2. Heavy-Flint Glass Lathe Geometry (Heavy laboratory borosilicate) ---
  const glassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.38));
    points.push(new THREE.Vector2(0.24, -1.43));
    points.push(new THREE.Vector2(0.48, -1.45));
    points.push(new THREE.Vector2(0.575, -1.43));
    points.push(new THREE.Vector2(0.58, -1.35));
    points.push(new THREE.Vector2(0.58, -0.60));
    points.push(new THREE.Vector2(0.58, 0.0));
    points.push(new THREE.Vector2(0.58, 0.55));
    points.push(new THREE.Vector2(0.56, 0.65));
    points.push(new THREE.Vector2(0.48, 0.78));
    points.push(new THREE.Vector2(0.36, 0.88));
    points.push(new THREE.Vector2(0.24, 0.95));
    points.push(new THREE.Vector2(0.22, 1.05));
    points.push(new THREE.Vector2(0.22, 1.25));
    points.push(new THREE.Vector2(0.22, 1.38));
    points.push(new THREE.Vector2(0.255, 1.40));
    points.push(new THREE.Vector2(0.255, 1.45));
    points.push(new THREE.Vector2(0.18, 1.46));
    points.push(new THREE.Vector2(0.18, 1.38));
    return new THREE.LatheGeometry(points, 48); // Optimized segment count for high FPS
  }, []);

  // --- 3. Liquid Core Lathe Geometry (Fills from base punt up) ---
  const liquidGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -1.22));
    points.push(new THREE.Vector2(0.35, -1.21));
    points.push(new THREE.Vector2(0.535, -1.18));
    points.push(new THREE.Vector2(0.535, 0.0));
    points.push(new THREE.Vector2(0.535, 0.55));
    points.push(new THREE.Vector2(0.51, 0.62));
    points.push(new THREE.Vector2(0.44, 0.68));
    points.push(new THREE.Vector2(0.28, 0.72));
    points.push(new THREE.Vector2(0.0, 0.71));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  // --- 4. Micro-Bubbles Setup (Optimized for 60-120fps) ---
  const BUBBLE_COUNT = 140;
  const bubbleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 0.46;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -1.15 + Math.random() * 1.75;
      const scale = 0.008 + Math.random() * 0.016;
      const speed = 0.16 + Math.random() * 0.32;
      const wobbleSpeed = 1.5 + Math.random() * 2.5;
      const wobbleRadius = 0.015 + Math.random() * 0.025;
      data.push({ x, y, z, scale, speed, wobbleSpeed, wobbleRadius, seed: Math.random() * 10 });
    }
    return data;
  }, []);

  // --- 5. Surface Condensation Setup ---
  const CONDENSATION_COUNT = 320;
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

  // --- 6. Orbitals & Particle Geometries ---
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
  const streamGeometry = useMemo(() => new THREE.CylinderGeometry(0.038, 0.048, 2.2, 16), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  // Appetizing botanical color palettes tailored for warm cream contrast
  const colorPalette = useMemo(() => ({
    yuzu: { 
      color: new THREE.Color('#D97706'),      // Vibrant charred yuzu amber
      emissive: new THREE.Color('#78350F'), 
      attenuation: new THREE.Color('#FDE68A') 
    },
    blood_orange: { 
      color: new THREE.Color('#B91C1C'),      // Smoked blood orange ruby
      emissive: new THREE.Color('#500724'), 
      attenuation: new THREE.Color('#FECDD3') 
    },
    juniper: { 
      color: new THREE.Color('#047857'),      // Deep alpine pine emerald
      emissive: new THREE.Color('#064E3B'), 
      attenuation: new THREE.Color('#A7F3D0') 
    },
  }), []);

  const currentLiquidColor = useRef(new THREE.Color('#D97706'));
  const currentEmissiveColor = useRef(new THREE.Color('#78350F'));

  // --- 7. Main High-Performance Animation Loop ---
  useFrame((state, delta) => {
    // Advance liquid pouring / draining physics
    scrollStore.updatePourPhysics(delta);

    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    if (!masterBottleRef.current) return;

    // --- Master Bottle Spatial Spline across the 6 Stages ---
    let bX = 0;
    let bY = 0;
    let bRotX = 0;
    let bRotY = 0;
    let bRotZ = 0;

    if (p < 0.18) {
      // STAGE 1: EMPTY VESSEL (Top hero presentation)
      const t = p / 0.18;
      bY = THREE.MathUtils.lerp(-0.20, 0.05, t);
      bX = 0;
      bRotY = THREE.MathUtils.lerp(-0.35, Math.PI * 0.45, t);
      bRotZ = THREE.MathUtils.lerp(0.04, -0.02, t);
      bRotX = 0.02;
    } else if (p < 0.38) {
      // STAGE 2: BASE DISTILLATE FILLING (Bottle shifts to right on desktop)
      const t = (p - 0.18) / 0.20;
      bY = THREE.MathUtils.lerp(0.05, 0.10, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.48, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 0.45, Math.PI * 1.85, t);
      bRotZ = THREE.MathUtils.lerp(-0.02, -0.06, t);
      bRotX = 0.03;
    } else if (p < 0.58) {
      // STAGE 3: NOOTROPIC INFUSION & EXPLODED FORMULATION
      const t = (p - 0.38) / 0.20;
      bY = THREE.MathUtils.lerp(0.10, 0.0, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.48, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 1.85, Math.PI * 2.85, t);
      bRotZ = 0;
      bRotX = THREE.MathUtils.lerp(0.03, 0.15, t);
    } else if (p < 0.76) {
      // STAGE 4: CHILL & SERVE ARCHITECTURE (Bottle shifts to left)
      const t = (p - 0.58) / 0.18;
      bY = 0.02;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.62, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 2.85, Math.PI * 3.85, t);
      bRotZ = -0.04;
      bRotX = 0.03;
    } else if (p < 0.90) {
      // STAGE 5: BESPOKE LABEL PERSONALIZATION (Centered, frontal view)
      const t = (p - 0.76) / 0.14;
      bY = 0.05;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.62, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 3.85, Math.PI * 4.0, t);
      bRotZ = 0;
      bRotX = 0.02;
    } else {
      // STAGE 6: DISPATCH VAULT (Bottle on left, address form on right)
      const t = Math.min(1, (p - 0.90) / 0.10);
      bY = 0.06;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.68, t);
      // Gentle continuous luxury rotation
      bRotY = Math.PI * 4.0 + (time * 0.22);
      bRotZ = -0.02;
      bRotX = 0.03;
    }

    // Apply smoothed motion
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 4.5, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 4.5, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, bRotX, 4.5, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 4.5, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, bRotZ, 4.5, delta);

    // --- Dynamic Liquid Pouring Stream (Visible during active pour) ---
    if (pourStreamRef.current) {
      const isPouringActive = pour.isPouring;
      pourStreamRef.current.visible = isPouringActive;
      if (isPouringActive) {
        // Position stream entering from top neck down towards liquid surface
        const surfaceY = -1.2 + pour.fillLevel * 1.85;
        const streamHeight = Math.max(0.1, 1.6 - surfaceY);
        pourStreamRef.current.scale.set(
          1 + Math.sin(time * 30) * 0.15,
          streamHeight / 2.2,
          1 + Math.cos(time * 28) * 0.15
        );
        pourStreamRef.current.position.y = surfaceY + streamHeight * 0.5;
      }
    }

    // --- Dynamic Liquid Core Filling & Slosh ---
    if (liquidCoreRef.current) {
      const fLevel = pour.fillLevel;
      liquidCoreRef.current.visible = fLevel > 0.008;

      if (fLevel > 0.008) {
        // Bottom-anchored vertical fill scaling
        // When scale.y drops, shift position.y so the base stays planted at -1.22
        const currentScaleY = Math.max(0.001, fLevel);
        liquidCoreRef.current.scale.set(1, currentScaleY, 1);
        liquidCoreRef.current.position.y = -1.22 * (1 - currentScaleY);

        // Responsive liquid slosh based on scroll velocity and pour stream
        const sloshZ = THREE.MathUtils.clamp(velocity * 0.012, -0.06, 0.06) + (pour.isPouring ? Math.sin(time * 18) * 0.015 : 0);
        const sloshX = THREE.MathUtils.clamp(velocity * 0.010, -0.05, 0.05) + (pour.isPouring ? Math.cos(time * 16) * 0.015 : 0);
        liquidCoreRef.current.rotation.z = THREE.MathUtils.damp(liquidCoreRef.current.rotation.z, sloshZ, 5, delta);
        liquidCoreRef.current.rotation.x = THREE.MathUtils.damp(liquidCoreRef.current.rotation.x, sloshX, 5, delta);
      }
    }

    // --- Dynamic Liquid Color Transition ---
    if (liquidMaterialRef.current) {
      const baseKey = (formula.base || 'yuzu') as BaseDistillate;
      const activePalette = colorPalette[baseKey] || colorPalette.yuzu;
      currentLiquidColor.current.lerp(activePalette.color, delta * 3.5);
      currentEmissiveColor.current.lerp(activePalette.emissive, delta * 3.5);
      liquidMaterialRef.current.color.copy(currentLiquidColor.current);
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
      liquidMaterialRef.current.attenuationColor.copy(activePalette.attenuation);
    }

    // --- Cap Medallion Material Transition ---
    if (capMedallionRef.current) {
      const mat = capMedallionRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        let targetMedallion = '#C59B27'; // Atelier gold
        if (formula.seal === 'noir') targetMedallion = '#22201D';
        else if (formula.seal === 'copper') targetMedallion = '#B3542E';
        mat.color.lerp(new THREE.Color(targetMedallion), delta * 4);
      }
    }

    // --- Stage 3: Exploded Mechanical Formulation ---
    let e = 0;
    if (p >= 0.38 && p < 0.48) {
      e = (p - 0.38) / 0.10; // Levitation separation
    } else if (p >= 0.48 && p < 0.54) {
      e = 1.0; // Pinned exploded hold
    } else if (p >= 0.54 && p < 0.60) {
      e = 1.0 - (p - 0.54) / 0.06; // Reassemble smoothly
    } else {
      e = 0;
    }

    if (capGroupRef.current) {
      const capTargetY = 0 + e * 0.95;
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * 0.35 * e;
    }

    if (orbitalsGroupRef.current) {
      const targetScale = Math.max(e, formula.chill === 'ice' && p >= 0.58 && p < 0.78 ? 0.85 : 0);
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
        const maxY = -1.22 + pour.fillLevel * 1.82;
        const bubbleSpeedMultiplier = (formula.chill === 'ice' ? 1.6 : 1.0) + (pour.isPouring ? 2.5 : 0);
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

    // --- Surface Condensation Droplets (Form when chill === 'ice' and liquid poured) ---
    if (condensationRef.current) {
      const showCondensation = formula.chill === 'ice' && pour.fillLevel > 0.15 && p >= 0.20;
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
    <group ref={masterBottleRef} position={[0, -0.20, 0]}>
      {/* 1. Heavy-Flint Apothecary Borosilicate Glass Vessel */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          transmission={0.97}
          roughness={0.03}
          ior={1.48}
          thickness={0.52}
          transparent={true}
          opacity={1.0}
          reflectivity={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          color="#FFFFFF"
          attenuationColor="#F7F3EB"
          attenuationDistance={1.4}
        />
      </mesh>

      {/* 2. Live Pouring Stream (Active when selecting/pouring distillation) */}
      <mesh ref={pourStreamRef} geometry={streamGeometry} visible={false}>
        <meshPhysicalMaterial
          ref={liquidMaterialRef}
          color="#D97706"
          emissive="#78350F"
          emissiveIntensity={0.6}
          roughness={0.02}
          transmission={0.85}
          transparent={true}
          opacity={0.92}
        />
      </mesh>

      {/* 3. Dynamic Liquid Core (Pours and fills from base) */}
      <mesh ref={liquidCoreRef} geometry={liquidGeometry}>
        <meshPhysicalMaterial
          color="#D97706"
          emissive="#78350F"
          emissiveIntensity={0.35}
          transmission={0.88}
          ior={1.333}
          roughness={0.05}
          thickness={0.85}
          attenuationDistance={0.65}
          transparent={true}
          opacity={0.96}
        />
      </mesh>

      {/* 4. Micro-Bubbles (Optimized high-specular material) */}
      <instancedMesh
        ref={bubblesRef}
        args={[sphereGeometry, undefined, BUBBLE_COUNT]}
      >
        <meshStandardMaterial
          color="#FFF8E7"
          roughness={0.05}
          metalness={0.1}
          opacity={0.75}
          transparent={true}
          emissive="#D97706"
          emissiveIntensity={0.3}
        />
      </instancedMesh>

      {/* 5. Surface Condensation (High-performance crystal beads) */}
      <instancedMesh
        ref={condensationRef}
        args={[sphereGeometry, undefined, CONDENSATION_COUNT]}
      >
        <meshPhysicalMaterial
          roughness={0.02}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          reflectivity={0.95}
          opacity={0.88}
          transparent={true}
          color="#FFFFFF"
        />
      </instancedMesh>

      {/* 6. Knurled Atelier Cap & Medallion */}
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

      {/* 7. Dynamic Procedural Parchment Label */}
      <mesh ref={labelMeshRef} position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.584, 0.584, 1.15, 48, 1, true, -Math.PI * 0.55, Math.PI * 1.1]} />
        <meshStandardMaterial
          map={diffuseMap}
          bumpMap={bumpMap}
          bumpScale={0.007}
          roughness={0.42}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 8. Floating Botanical & Ice Orbitals */}
      <group ref={orbitalsGroupRef} scale={0}>
        {/* Hand-cut ice block */}
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

        {/* Botanical sphere particulates (Lion's mane / schisandra) */}
        <mesh position={[0.65, -0.45, -0.35]} scale={0.065}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#C2410C" roughness={0.4} />
        </mesh>
        <mesh position={[-0.58, 0.55, -0.28]} scale={0.055}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.4} />
        </mesh>

        {/* Charred Yuzu slice */}
        <mesh geometry={yuzuGeometry} position={[-0.68, 0.15, 0.42]} rotation={[1.2, 0.4, -0.5]} scale={0.65}>
          <meshStandardMaterial color="#D97706" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
