import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { scrollStore } from '../store/scrollStore';
import { createProceduralLabel } from './ProceduralLabel';

export function BottleAssembly() {
  const masterBottleRef = useRef<THREE.Group>(null);
  const outerGlassRef = useRef<THREE.Mesh>(null);
  const liquidCoreRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const condensationRef = useRef<THREE.InstancedMesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);

  // Dynamic Liquid Material Ref for color lerping in Serve Mode
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // --- 1. Procedural Label Textures ---
  const { diffuseMap, bumpMap } = useMemo(() => createProceduralLabel(), []);

  // --- 2. Heavy-Flint Glass Lathe Geometry ---
  const glassGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Concave inner punt bottom center
    points.push(new THREE.Vector2(0.0, -1.38));
    points.push(new THREE.Vector2(0.24, -1.43));
    points.push(new THREE.Vector2(0.48, -1.45));
    // Base heel curvature
    points.push(new THREE.Vector2(0.575, -1.43));
    points.push(new THREE.Vector2(0.58, -1.35));
    // Cylindrical main body
    points.push(new THREE.Vector2(0.58, -0.60));
    points.push(new THREE.Vector2(0.58, 0.0));
    points.push(new THREE.Vector2(0.58, 0.55));
    // Architectural shoulder taper curve
    points.push(new THREE.Vector2(0.56, 0.65));
    points.push(new THREE.Vector2(0.48, 0.78));
    points.push(new THREE.Vector2(0.36, 0.88));
    points.push(new THREE.Vector2(0.24, 0.95));
    // Tall apothecary neck
    points.push(new THREE.Vector2(0.22, 1.05));
    points.push(new THREE.Vector2(0.22, 1.25));
    points.push(new THREE.Vector2(0.22, 1.38));
    // Thickened pouring lip flange
    points.push(new THREE.Vector2(0.255, 1.40));
    points.push(new THREE.Vector2(0.255, 1.45));
    points.push(new THREE.Vector2(0.18, 1.46));
    points.push(new THREE.Vector2(0.18, 1.38));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 3. Inner Glowing Liquid Core Lathe Geometry ---
  const liquidGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Base resting inside punt
    points.push(new THREE.Vector2(0.0, -1.22));
    points.push(new THREE.Vector2(0.35, -1.21));
    points.push(new THREE.Vector2(0.535, -1.18));
    // Body
    points.push(new THREE.Vector2(0.535, 0.0));
    points.push(new THREE.Vector2(0.535, 0.55));
    // Shoulder liquid meniscus
    points.push(new THREE.Vector2(0.51, 0.62));
    points.push(new THREE.Vector2(0.44, 0.68));
    points.push(new THREE.Vector2(0.28, 0.72));
    // Meniscus center dip
    points.push(new THREE.Vector2(0.0, 0.71));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 4. Micro-Bubbles Instanced Setup ---
  const BUBBLE_COUNT = 220;
  const bubbleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const radius = Math.sqrt(Math.random()) * 0.48;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -1.15 + Math.random() * 1.80;
      const scale = 0.007 + Math.random() * 0.016;
      const speed = 0.12 + Math.random() * 0.26;
      const wobbleSpeed = 1.2 + Math.random() * 2.5;
      const wobbleRadius = 0.015 + Math.random() * 0.025;
      data.push({ x, y, z, scale, speed, wobbleSpeed, wobbleRadius, seed: Math.random() * 10 });
    }
    return data;
  }, []);

  // --- 5. Surface Condensation Droplets Instanced Setup ---
  const CONDENSATION_COUNT = 550;
  const condensationData = useMemo(() => {
    const data = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    for (let i = 0; i < CONDENSATION_COUNT; i++) {
      const t = i / CONDENSATION_COUNT;
      const y = -1.25 + t * 1.85; // Distributed across body and shoulder
      const angle = i * 2 * Math.PI * (phi - 1) + (Math.random() - 0.5) * 0.25;

      // Radius matching bottle profile at height y
      let r = 0.585;
      if (y > 0.55 && y <= 0.95) {
        // Shoulder taper
        const st = (y - 0.55) / 0.40;
        r = THREE.MathUtils.lerp(0.585, 0.225, st * st);
      } else if (y > 0.95) {
        r = 0.225;
      }

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const baseScale = 0.006 + Math.random() * 0.015;
      data.push({ x, y, z, angle, baseScale, elongation: 1.25, seed: Math.random() });
    }
    return data;
  }, []);

  // --- 6. Exploded Orbitals Geometries ---
  // Crystal Ice Blocks
  const iceGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(0.28, 0.28, 0.28, 4, 4, 4);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      // Subtle vertex noise perturbation
      const noise = (Math.sin(vx * 12) + Math.cos(vy * 12) + Math.sin(vz * 12)) * 0.018;
      pos.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Suspended Elixir Spheres
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);

  // Charred Yuzu Discs
  const yuzuGeometry = useMemo(() => new THREE.CylinderGeometry(0.32, 0.32, 0.025, 32), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  // Color targets for Serve Ritual
  const liquidNeatColor = useMemo(() => new THREE.Color('#B84509'), []);
  const liquidIceColor = useMemo(() => new THREE.Color('#D97724'), []);
  const currentLiquidColor = useRef(new THREE.Color('#B84509'));

  // --- 7. Main 60fps Animation Loop ---
  useFrame((state, delta) => {
    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isIce = scrollStore.serveMode === 'ice';
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();

    if (!masterBottleRef.current) return;

    // --- Master Bottle Spatial Positioning & Rotation ---
    let bX = 0;
    let bY = 0;
    let bRotX = 0;
    let bRotY = 0;
    let bRotZ = 0;

    if (p < 0.20) {
      // STAGE 1 (0% - 20%): Silhouette Reveal
      const t = p / 0.20;
      bY = THREE.MathUtils.lerp(-0.25, 0.05, t);
      bX = 0;
      bRotY = THREE.MathUtils.lerp(-0.40, Math.PI * 0.45, t);
      bRotZ = THREE.MathUtils.lerp(0.04, -0.02, t);
      bRotX = 0.02;
    } else if (p < 0.45) {
      // STAGE 2 (20% - 45%): 360° Macro Surface Inspection
      const t = (p - 0.20) / 0.25;
      bY = THREE.MathUtils.lerp(0.05, 0.12, t);
      // On desktop, push bottle right to x: 0.48, centered on mobile
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.48, t);
      // Full 360° axial spin
      bRotY = THREE.MathUtils.lerp(Math.PI * 0.45, Math.PI * 2.45, t);
      bRotZ = THREE.MathUtils.lerp(-0.02, -0.09, t);
      bRotX = THREE.MathUtils.lerp(0.02, 0.06, t);
    } else if (p < 0.70) {
      // STAGE 3 (45% - 70%): Exploded View Wide
      const t = (p - 0.45) / 0.25;
      bY = THREE.MathUtils.lerp(0.12, 0.0, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.48, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 2.45, Math.PI * 3.10, t);
      bRotZ = THREE.MathUtils.lerp(-0.09, 0, t);
      bRotX = THREE.MathUtils.lerp(0.06, 0.16, t); // Architectural isometric tilt
    } else if (p < 0.88) {
      // STAGE 4 (70% - 88%): Reassembled Serve Ritual
      const t = (p - 0.70) / 0.18;
      bY = 0.02;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.75, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 3.10, Math.PI * 4.15, t);
      bRotZ = THREE.MathUtils.lerp(0, -0.06, t);
      bRotX = THREE.MathUtils.lerp(0.16, 0.04, t);
    } else {
      // STAGE 5 (88% - 100%): Bento & Allocation Pedestal
      const t = Math.min(1, (p - 0.88) / 0.12);
      bY = 0.08;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.75, 0.95, t);
      // Slow continuous luxury idle rotation in Stage 5
      bRotY = Math.PI * 4.15 + (time * 0.18);
      bRotZ = -0.03;
      bRotX = 0.04;
    }

    // Apply damped transformation to master bottle group
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 4, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 4, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, bRotX, 4, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 4, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, bRotZ, 4, delta);

    // --- Dynamic Liquid Slosh Reaction to Scroll Momentum ---
    if (liquidCoreRef.current) {
      const sloshZ = THREE.MathUtils.clamp(velocity * 0.015, -0.08, 0.08);
      const sloshX = THREE.MathUtils.clamp(velocity * 0.012, -0.06, 0.06);
      liquidCoreRef.current.rotation.z = THREE.MathUtils.damp(liquidCoreRef.current.rotation.z, sloshZ, 5, delta);
      liquidCoreRef.current.rotation.x = THREE.MathUtils.damp(liquidCoreRef.current.rotation.x, sloshX, 5, delta);
    }

    // --- Liquid Material Color Lerping (Neat vs Ice) ---
    if (liquidMaterialRef.current) {
      const targetColor = isIce ? liquidIceColor : liquidNeatColor;
      currentLiquidColor.current.lerp(targetColor, delta * 3);
      liquidMaterialRef.current.color.copy(currentLiquidColor.current);
    }

    // --- STAGE 3: Exploded Mechanical Component Separation ---
    // Normalized Stage 3 progress 'e' (0 -> 1 -> 0)
    let e = 0;
    if (p >= 0.45 && p < 0.60) {
      e = (p - 0.45) / 0.15; // Separate
    } else if (p >= 0.60 && p < 0.68) {
      e = 1.0; // Hold full explosion
    } else if (p >= 0.68 && p < 0.74) {
      e = 1.0 - (p - 0.68) / 0.06; // Reassemble
    } else {
      e = 0;
    }

    // 1. Cap group levitates upward
    if (capGroupRef.current) {
      const capTargetY = 0 + e * 0.95;
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * 0.35 * e;
    }

    // 2. Liquid core levitates upward out of glass shell
    if (liquidCoreRef.current) {
      const liquidTargetY = 0 + e * 0.42;
      liquidCoreRef.current.position.y = THREE.MathUtils.damp(liquidCoreRef.current.position.y, liquidTargetY, 5, delta);
    }

    // 3. Label slides downward to reveal internal liquid
    if (labelMeshRef.current) {
      const labelTargetY = -0.32 - e * 0.35;
      labelMeshRef.current.position.y = THREE.MathUtils.damp(labelMeshRef.current.position.y, labelTargetY, 5, delta);
    }

    // 4. Orbitals Group expansion
    if (orbitalsGroupRef.current) {
      // In Stage 3, scale = e. In Stage 4 Ice mode, also keep orbitals visible!
      const targetScale = Math.max(e, isIce && p >= 0.72 && p < 0.88 ? 0.85 : 0);
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      // Gentle orbital spin
      orbitalsGroupRef.current.rotation.y += delta * 0.22;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
    }

    // --- Micro-Bubbles Animation Loop ---
    if (bubblesRef.current) {
      const bubbleSpeedMultiplier = isIce ? 1.8 : 1.0;
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const b = bubbleData[i];
        b.y += delta * b.speed * bubbleSpeedMultiplier;

        // Reset loop
        if (b.y > 0.58) {
          b.y = -1.15;
        }

        // Helical drift
        const currentAngle = b.seed + time * b.wobbleSpeed;
        const driftX = b.x + Math.sin(currentAngle) * b.wobbleRadius;
        const driftZ = b.z + Math.cos(currentAngle) * b.wobbleRadius;

        // Exploded view expansion along Y
        const explodedYOffset = e * 0.42;
        dummyPos.set(driftX * (1 + e * 0.2), b.y + explodedYOffset, driftZ * (1 + e * 0.2));
        dummyScale.setScalar(b.scale);
        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        bubblesRef.current.setMatrixAt(i, dummyMatrix);
      }
      bubblesRef.current.instanceMatrix.needsUpdate = true;
    }

    // --- Surface Condensation Droplets Interactive Scaling ---
    if (condensationRef.current) {
      // Scale up in Stage 2 (macro) and Stage 4 Ice mode
      let condScaleMultiplier = 1.0;
      if (p >= 0.20 && p < 0.45) {
        condScaleMultiplier = 1.35;
      } else if (isIce && p >= 0.72) {
        condScaleMultiplier = 1.50;
      }

      for (let i = 0; i < CONDENSATION_COUNT; i++) {
        const c = condensationData[i];
        dummyPos.set(c.x, c.y, c.z);

        // Orient droplet along outward radial normal
        const normalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), c.angle);
        const finalScale = c.baseScale * condScaleMultiplier;
        dummyScale.set(finalScale, finalScale * c.elongation, finalScale * 0.6); // Hug surface

        dummyMatrix.compose(dummyPos, normalQuat, dummyScale);
        condensationRef.current.setMatrixAt(i, dummyMatrix);
      }
      condensationRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={masterBottleRef} position={[0, -0.25, 0]}>
      {/* 1. Heavy-Flint Apothecary Glass Vessel */}
      <mesh ref={outerGlassRef} geometry={glassGeometry} castShadow receiveShadow>
        <MeshTransmissionMaterial
          backside={true}
          samples={8}
          resolution={512}
          transmission={0.98}
          roughness={0.05}
          ior={1.48}
          thickness={0.48}
          chromaticAberration={0.035}
          anisotropy={0.15}
          distortion={0.08}
          distortionScale={0.2}
          temporalDistortion={0.05}
          attenuationDistance={1.35}
          attenuationColor="#D97724"
          color="#FFFFFF"
        />
      </mesh>

      {/* 2. Glowing Botanical Liquid Core & Meniscus */}
      <mesh ref={liquidCoreRef} geometry={liquidGeometry}>
        <meshPhysicalMaterial
          ref={liquidMaterialRef}
          color="#B84509"
          emissive="#4A1600"
          emissiveIntensity={0.42}
          transmission={0.88}
          ior={1.333}
          roughness={0.06}
          thickness={0.9}
          attenuationColor="#F59E0B"
          attenuationDistance={0.55}
          transparent={true}
          opacity={0.95}
        />
      </mesh>

      {/* 3. Rising Effervescent Micro-Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[sphereGeometry, undefined, BUBBLE_COUNT]}
      >
        <meshPhysicalMaterial
          color="#FFD89B"
          transmission={0.95}
          ior={1.0}
          roughness={0.0}
          metalness={0.1}
          emissive="#F4B860"
          emissiveIntensity={0.25}
          transparent={true}
        />
      </instancedMesh>

      {/* 4. Procedural Surface Condensation Droplets */}
      <instancedMesh
        ref={condensationRef}
        args={[sphereGeometry, undefined, CONDENSATION_COUNT]}
      >
        <meshPhysicalMaterial
          transmission={0.99}
          ior={1.333}
          roughness={0.01}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          reflectivity={1.0}
          transparent={true}
        />
      </instancedMesh>

      {/* 5. CNC-Knurled Gunmetal Cap & Brushed Brass Medallion */}
      <group ref={capGroupRef}>
        {/* Main Closure Cylinder */}
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.265, 0.265, 0.34, 64]} />
          <meshStandardMaterial
            color="#1C1E24"
            metalness={0.88}
            roughness={0.28}
          />
        </mesh>

        {/* Vertical Knurling Band (Outer Ribs) */}
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.272, 0.272, 0.22, 96]} />
          <meshStandardMaterial
            color="#14161B"
            metalness={0.92}
            roughness={0.35}
            wireframe={false}
          />
        </mesh>

        {/* Top Inset Medallion Disc in Champagne Brass */}
        <mesh position={[0, 1.652, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.02, 48]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.24}
          />
        </mesh>

        {/* Matte Obsidian Tamper Neck Band */}
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.232, 0.232, 0.16, 48]} />
          <meshStandardMaterial
            color="#0A0B0E"
            metalness={0.65}
            roughness={0.45}
          />
        </mesh>
      </group>

      {/* 6. High-DPI Procedural Embossed Label */}
      <mesh
        ref={labelMeshRef}
        position={[0, -0.32, 0]}
      >
        <cylinderGeometry
          args={[0.584, 0.584, 1.15, 64, 1, true, -Math.PI * 0.55, Math.PI * 1.1]}
        />
        <meshStandardMaterial
          map={diffuseMap}
          bumpMap={bumpMap}
          bumpScale={0.008}
          roughness={0.35}
          metalness={0.45}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>

      {/* 7. Exploded-View Botanical, Ice & Liquid Orbitals */}
      <group ref={orbitalsGroupRef} scale={0}>
        {/* 6 Artisanal Hand-Carved Crystal Ice Blocks */}
        {[
          { pos: [-1.25, 0.85, 0.6], rot: [0.4, 0.6, 0.2] },
          { pos: [1.35, 0.95, -0.4], rot: [-0.3, 0.8, 0.5] },
          { pos: [-1.10, -0.65, -0.7], rot: [0.7, -0.4, 0.3] },
          { pos: [1.20, -0.55, 0.8], rot: [-0.5, -0.6, 0.4] },
          { pos: [-0.75, 1.45, -0.8], rot: [0.2, 0.3, 0.9] },
          { pos: [0.85, 1.55, 0.7], rot: [-0.6, 0.2, -0.4] },
        ].map((ice, i) => (
          <mesh
            key={`ice-${i}`}
            geometry={iceGeometry}
            position={ice.pos as [number, number, number]}
            rotation={ice.rot as [number, number, number]}
          >
            <MeshTransmissionMaterial
              transmission={0.96}
              ior={1.309}
              roughness={0.14}
              thickness={0.35}
              chromaticAberration={0.02}
              color="#E0F4FF"
              attenuationColor="#9CE0FF"
              attenuationDistance={1.0}
            />
          </mesh>
        ))}

        {/* 8 Suspended Amber Elixir Spheres */}
        {[
          { pos: [-0.95, 0.35, 0.9], scale: 0.12 },
          { pos: [1.05, 0.25, 0.7], scale: 0.09 },
          { pos: [-0.85, 1.15, 0.4], scale: 0.07 },
          { pos: [0.95, 1.05, -0.6], scale: 0.11 },
          { pos: [-1.2, -0.15, -0.5], scale: 0.08 },
          { pos: [1.15, -0.25, -0.7], scale: 0.10 },
          { pos: [0.55, 1.75, 0.3], scale: 0.06 },
          { pos: [-0.45, -1.05, 0.9], scale: 0.13 },
        ].map((sphere, i) => (
          <mesh
            key={`sphere-${i}`}
            geometry={sphereGeometry}
            position={sphere.pos as [number, number, number]}
            scale={sphere.scale}
          >
            <meshPhysicalMaterial
              color="#F59E0B"
              emissive="#FF6A00"
              emissiveIntensity={0.5}
              transmission={0.9}
              ior={1.35}
              roughness={0.04}
              transparent={true}
            />
          </mesh>
        ))}

        {/* 3 Charred Yuzu & Botanical Wheels */}
        {[
          { pos: [-1.35, 0.15, -0.2], rot: [0.8, 0.5, 0.3] },
          { pos: [1.40, -0.10, 0.3], rot: [-0.7, -0.6, 0.4] },
          { pos: [0.15, 1.65, -0.9], rot: [0.3, 0.9, -0.5] },
        ].map((yuzu, i) => (
          <group
            key={`yuzu-${i}`}
            position={yuzu.pos as [number, number, number]}
            rotation={yuzu.rot as [number, number, number]}
          >
            {/* Inner Citrus Flesh */}
            <mesh geometry={yuzuGeometry}>
              <meshPhysicalMaterial
                color="#EAB308"
                emissive="#D97724"
                emissiveIntensity={0.35}
                transmission={0.82}
                roughness={0.25}
                transparent={true}
              />
            </mesh>
            {/* Charred Dark Outer Rind */}
            <mesh>
              <torusGeometry args={[0.32, 0.02, 16, 32]} />
              <meshStandardMaterial
                color="#1C1814"
                roughness={0.7}
                metalness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

