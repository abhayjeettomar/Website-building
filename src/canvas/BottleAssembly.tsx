import React, { useEffect, useMemo, useRef } from 'react';
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
  const capMedallionRef = useRef<THREE.Mesh>(null);
  const labelMeshRef = useRef<THREE.Mesh>(null);
  const orbitalsGroupRef = useRef<THREE.Group>(null);

  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // --- 1. Procedural Label Textures & Live Updater ---
  const { diffuseMap, bumpMap, updateLabel } = useMemo(() => createProceduralLabel(), []);

  // Listen for changes in formula (name, initials, seal) to update label texture
  useEffect(() => {
    const unsub = scrollStore.subscribe(() => {
      const f = scrollStore.formula;
      updateLabel(f.customName, f.engravedInitials, f.seal);
    });
    return unsub;
  }, [updateLabel]);

  // --- 2. Heavy-Flint Glass Lathe Geometry ---
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
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 3. Liquid Core Lathe Geometry ---
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
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // --- 4. Micro-Bubbles Setup ---
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

  // --- 5. Surface Condensation Setup ---
  const CONDENSATION_COUNT = 550;
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
      const baseScale = 0.006 + Math.random() * 0.015;
      data.push({ x, y, z, angle, baseScale, elongation: 1.25, seed: Math.random() });
    }
    return data;
  }, []);

  // --- 6. Orbitals Geometries ---
  const iceGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(0.28, 0.28, 0.28, 4, 4, 4);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = (Math.sin(vx * 12) + Math.cos(vy * 12) + Math.sin(vz * 12)) * 0.018;
      pos.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const yuzuGeometry = useMemo(() => new THREE.CylinderGeometry(0.32, 0.32, 0.025, 32), []);

  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const dummyQuat = useMemo(() => new THREE.Quaternion(), []);
  const dummyScale = useMemo(() => new THREE.Vector3(), []);
  const dummyPos = useMemo(() => new THREE.Vector3(), []);

  // Dynamic Liquid Colors
  const colorPalette = useMemo(() => ({
    yuzu: { color: new THREE.Color('#E59535'), emissive: new THREE.Color('#663300') },
    blood_orange: { color: new THREE.Color('#B82A2A'), emissive: new THREE.Color('#4D0A0A') },
    juniper: { color: new THREE.Color('#2E7D52'), emissive: new THREE.Color('#0A331A') },
  }), []);

  const currentLiquidColor = useRef(new THREE.Color('#E59535'));
  const currentEmissiveColor = useRef(new THREE.Color('#663300'));

  // --- 7. Main 60fps Animation Loop ---
  useFrame((state, delta) => {
    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = state.size.width < 768;
    const time = state.clock.getElapsedTime();
    const formula = scrollStore.formula;

    if (!masterBottleRef.current) return;

    // --- Master Bottle Spatial Positioning & Spline Across ALL 6 Stages ---
    let bX = 0;
    let bY = 0;
    let bRotX = 0;
    let bRotY = 0;
    let bRotZ = 0;

    if (p < 0.18) {
      // STAGE 1: EMPTY VESSEL (Top hero)
      const t = p / 0.18;
      bY = THREE.MathUtils.lerp(-0.25, 0.05, t);
      bX = 0;
      bRotY = THREE.MathUtils.lerp(-0.40, Math.PI * 0.45, t);
      bRotZ = THREE.MathUtils.lerp(0.04, -0.02, t);
      bRotX = 0.02;
    } else if (p < 0.38) {
      // STAGE 2: BASE DISTILLATE FILLING
      const t = (p - 0.18) / 0.20;
      bY = THREE.MathUtils.lerp(0.05, 0.12, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.48, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 0.45, Math.PI * 1.85, t);
      bRotZ = THREE.MathUtils.lerp(-0.02, -0.08, t);
      bRotX = 0.04;
    } else if (p < 0.58) {
      // STAGE 3: NOOTROPIC INFUSION & EXPLODED FORMULATION
      const t = (p - 0.38) / 0.20;
      bY = THREE.MathUtils.lerp(0.12, 0.0, t);
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0.48, 0, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 1.85, Math.PI * 2.85, t);
      bRotZ = 0;
      bRotX = THREE.MathUtils.lerp(0.04, 0.16, t);
    } else if (p < 0.76) {
      // STAGE 4: CHILL & SERVE ARCHITECTURE
      const t = (p - 0.58) / 0.18;
      bY = 0.02;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.65, t);
      bRotY = THREE.MathUtils.lerp(Math.PI * 2.85, Math.PI * 3.85, t);
      bRotZ = -0.04;
      bRotX = 0.04;
    } else if (p < 0.90) {
      // STAGE 5: BESPOKE LABEL PERSONALIZATION (Head-on frontal view!)
      const t = (p - 0.76) / 0.14;
      bY = 0.05;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(-0.65, 0, t);
      // Face front so label is directly readable:
      bRotY = THREE.MathUtils.lerp(Math.PI * 3.85, Math.PI * 4.0, t);
      bRotZ = 0;
      bRotX = 0.02;
    } else {
      // STAGE 6: DISPATCH VAULT (Bottle on left, address form on right!)
      const t = Math.min(1, (p - 0.90) / 0.10);
      bY = 0.06;
      bX = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.68, t);
      // Gentle continuous luxury display spin:
      bRotY = Math.PI * 4.0 + (time * 0.25);
      bRotZ = -0.02;
      bRotX = 0.03;
    }

    // Apply damped transformation to bottle group
    masterBottleRef.current.position.x = THREE.MathUtils.damp(masterBottleRef.current.position.x, bX, 4, delta);
    masterBottleRef.current.position.y = THREE.MathUtils.damp(masterBottleRef.current.position.y, bY, 4, delta);
    masterBottleRef.current.rotation.x = THREE.MathUtils.damp(masterBottleRef.current.rotation.x, bRotX, 4, delta);
    masterBottleRef.current.rotation.y = THREE.MathUtils.damp(masterBottleRef.current.rotation.y, bRotY, 4, delta);
    masterBottleRef.current.rotation.z = THREE.MathUtils.damp(masterBottleRef.current.rotation.z, bRotZ, 4, delta);

    // --- Dynamic Liquid Fill Level (Empty at top -> Filling in Stage 2) ---
    if (liquidCoreRef.current) {
      let fillScale = 1.0;
      if (p < 0.10) {
        fillScale = 0.001; // Completely empty vessel!
      } else if (p < 0.26) {
        // Liquid visibly pours & rises from bottom
        fillScale = THREE.MathUtils.lerp(0.001, 1.0, (p - 0.10) / 0.16);
      } else {
        fillScale = 1.0;
      }

      liquidCoreRef.current.scale.set(1, fillScale, 1);
      liquidCoreRef.current.visible = fillScale > 0.01;

      // Dynamic liquid slosh reacting to scroll velocity
      const sloshZ = THREE.MathUtils.clamp(velocity * 0.015, -0.08, 0.08);
      const sloshX = THREE.MathUtils.clamp(velocity * 0.012, -0.06, 0.06);
      liquidCoreRef.current.rotation.z = THREE.MathUtils.damp(liquidCoreRef.current.rotation.z, sloshZ, 5, delta);
      liquidCoreRef.current.rotation.x = THREE.MathUtils.damp(liquidCoreRef.current.rotation.x, sloshX, 5, delta);
    }

    // --- Dynamic Liquid Color Transition ---
    if (liquidMaterialRef.current) {
      const activePalette = colorPalette[formula.base] || colorPalette.yuzu;
      currentLiquidColor.current.lerp(activePalette.color, delta * 3.5);
      currentEmissiveColor.current.lerp(activePalette.emissive, delta * 3.5);
      liquidMaterialRef.current.color.copy(currentLiquidColor.current);
      liquidMaterialRef.current.emissive.copy(currentEmissiveColor.current);
    }

    // --- Cap Medallion Foil Color ---
    if (capMedallionRef.current) {
      const mat = capMedallionRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        let targetMedallion = '#D4AF37'; // Gold
        if (formula.seal === 'noir') targetMedallion = '#222222';
        else if (formula.seal === 'copper') targetMedallion = '#C85A32';
        mat.color.lerp(new THREE.Color(targetMedallion), delta * 4);
      }
    }

    // --- Stage 3: Exploded Mechanical Formulation ---
    let e = 0;
    if (p >= 0.38 && p < 0.50) {
      e = (p - 0.38) / 0.12; // Separate
    } else if (p >= 0.50 && p < 0.56) {
      e = 1.0; // Hold explosion
    } else if (p >= 0.56 && p < 0.62) {
      e = 1.0 - (p - 0.56) / 0.06; // Reassemble
    } else {
      e = 0;
    }

    // Cap levitates upward
    if (capGroupRef.current) {
      const capTargetY = 0 + e * 0.95;
      capGroupRef.current.position.y = THREE.MathUtils.damp(capGroupRef.current.position.y, capTargetY, 5, delta);
      capGroupRef.current.rotation.y += delta * 0.35 * e;
    }

    // Liquid core slight levitation
    if (liquidCoreRef.current && e > 0) {
      liquidCoreRef.current.position.y = THREE.MathUtils.damp(liquidCoreRef.current.position.y, e * 0.38, 5, delta);
    }

    // Orbitals expansion
    if (orbitalsGroupRef.current) {
      const targetScale = Math.max(e, formula.chill === 'ice' && p >= 0.60 && p < 0.78 ? 0.85 : 0);
      orbitalsGroupRef.current.scale.setScalar(
        THREE.MathUtils.damp(orbitalsGroupRef.current.scale.x, targetScale, 4, delta)
      );
      orbitalsGroupRef.current.rotation.y += delta * 0.22;
      orbitalsGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.08;
    }

    // --- Micro-Bubbles Animation (Only visible when liquid is present) ---
    if (bubblesRef.current) {
      const isLiquidFilled = p >= 0.15;
      bubblesRef.current.visible = isLiquidFilled;
      if (isLiquidFilled) {
        const bubbleSpeedMultiplier = formula.chill === 'ice' ? 1.8 : 1.0;
        for (let i = 0; i < BUBBLE_COUNT; i++) {
          const b = bubbleData[i];
          b.y += delta * b.speed * bubbleSpeedMultiplier;
          if (b.y > 0.58) b.y = -1.15;

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

    // --- Surface Condensation Droplets ---
    if (condensationRef.current) {
      const hasCondensation = p >= 0.18;
      condensationRef.current.visible = hasCondensation;
      if (hasCondensation) {
        const condMultiplier = formula.chill === 'ice' ? 1.45 : 1.0;
        for (let i = 0; i < CONDENSATION_COUNT; i++) {
          const c = condensationData[i];
          dummyPos.set(c.x, c.y, c.z);
          const normalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), c.angle);
          const finalScale = c.baseScale * condMultiplier;
          dummyScale.set(finalScale, finalScale * c.elongation, finalScale * 0.6);
          dummyMatrix.compose(dummyPos, normalQuat, dummyScale);
          condensationRef.current.setMatrixAt(i, dummyMatrix);
        }
        condensationRef.current.instanceMatrix.needsUpdate = true;
      }
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
          attenuationColor="#E59535"
          color="#FFFFFF"
        />
      </mesh>

      {/* 2. Dynamic Liquid Core (Pours in Stage 2) */}
      <mesh ref={liquidCoreRef} geometry={liquidGeometry}>
        <meshPhysicalMaterial
          ref={liquidMaterialRef}
          color="#E59535"
          emissive="#663300"
          emissiveIntensity={0.45}
          transmission={0.88}
          ior={1.333}
          roughness={0.06}
          thickness={0.9}
          attenuationDistance={0.55}
          transparent={true}
          opacity={0.96}
        />
      </mesh>

      {/* 3. Micro-Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[sphereGeometry, undefined, BUBBLE_COUNT]}
      >
        <meshPhysicalMaterial
          color="#FFE0B2"
          transmission={0.95}
          ior={1.0}
          roughness={0.0}
          emissive="#E5A958"
          emissiveIntensity={0.3}
          transparent={true}
        />
      </instancedMesh>

      {/* 4. Surface Condensation */}
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

      {/* 5. CNC-Knurled Gunmetal Cap & Medallion */}
      <group ref={capGroupRef}>
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.265, 0.265, 0.34, 64]} />
          <meshStandardMaterial color="#1C1E24" metalness={0.88} roughness={0.28} />
        </mesh>

        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.272, 0.272, 0.22, 96]} />
          <meshStandardMaterial color="#14161B" metalness={0.92} roughness={0.35} />
        </mesh>

        {/* Dynamic Seal Medallion */}
        <mesh ref={capMedallionRef} position={[0, 1.652, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.02, 48]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.24} />
        </mesh>

        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.232, 0.232, 0.16, 48]} />
          <meshStandardMaterial color="#0A0B0E" metalness={0.65} roughness={0.45} />
        </mesh>
      </group>

      {/* 6. Dynamic Procedural Embossed Label */}
      <mesh ref={labelMeshRef} position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.584, 0.584, 1.15, 64, 1, true, -Math.PI * 0.55, Math.PI * 1.1]} />
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

      {/* 7. Exploded Orbitals */}
      <group ref={orbitalsGroupRef} scale={0}>
        {[
          { pos: [-1.25, 0.85, 0.6], rot: [0.4, 0.6, 0.2] },
          { pos: [1.35, 0.95, -0.4], rot: [-0.3, 0.8, 0.5] },
          { pos: [-1.10, -0.65, -0.7], rot: [0.7, -0.4, 0.3] },
          { pos: [1.20, -0.55, 0.8], rot: [-0.5, -0.6, 0.4] },
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
            />
          </mesh>
        ))}

        {[
          { pos: [-0.95, 0.35, 0.9], scale: 0.12 },
          { pos: [1.05, 0.25, 0.7], scale: 0.09 },
          { pos: [-0.85, 1.15, 0.4], scale: 0.07 },
          { pos: [0.95, 1.05, -0.6], scale: 0.11 },
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
              transparent={true}
            />
          </mesh>
        ))}

        {[
          { pos: [-1.35, 0.15, -0.2], rot: [0.8, 0.5, 0.3] },
          { pos: [1.40, -0.10, 0.3], rot: [-0.7, -0.6, 0.4] },
        ].map((yuzu, i) => (
          <group
            key={`yuzu-${i}`}
            position={yuzu.pos as [number, number, number]}
            rotation={yuzu.rot as [number, number, number]}
          >
            <mesh geometry={yuzuGeometry}>
              <meshPhysicalMaterial
                color="#EAB308"
                emissive="#D97724"
                emissiveIntensity={0.35}
                transmission={0.82}
                transparent={true}
              />
            </mesh>
            <mesh>
              <torusGeometry args={[0.32, 0.02, 16, 32]} />
              <meshStandardMaterial color="#1C1814" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
