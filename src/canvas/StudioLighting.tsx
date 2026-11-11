import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { scrollStore } from '../store/scrollStore';

export function StudioLighting() {
  const frontLightRef = useRef<THREE.DirectionalLight>(null);
  const upLightRef = useRef<THREE.PointLight>(null);

  const baseUplights = {
    yuzu: new THREE.Color('#FF8C00'),
    blood_orange: new THREE.Color('#FF2222'),
    juniper: new THREE.Color('#10B981'),
  };

  const currentUpColor = useRef(new THREE.Color('#FF8C00'));

  useFrame((_, delta) => {
    const p = scrollStore.progress;
    const formula = scrollStore.formula;

    // Up light follows liquid distillate color
    const targetColor = baseUplights[formula.base] || baseUplights.yuzu;
    currentUpColor.current.lerp(targetColor, delta * 3.5);

    if (upLightRef.current) {
      upLightRef.current.color.copy(currentUpColor.current);
      // Up light is dimmer when bottle is empty in Stage 1, then brightens
      const targetIntensity = p < 0.12 ? 1.0 : (formula.chill === 'ice' ? 8.5 : 7.0);
      upLightRef.current.intensity = THREE.MathUtils.damp(
        upLightRef.current.intensity,
        targetIntensity,
        4,
        delta
      );
    }

    if (frontLightRef.current) {
      const frontIntensity = p < 0.15 ? 0.35 : 2.5;
      frontLightRef.current.intensity = THREE.MathUtils.damp(
        frontLightRef.current.intensity,
        frontIntensity,
        4,
        delta
      );
    }
  });

  return (
    <>
      <Environment resolution={512}>
        {/* Left vertical edge rim strip */}
        <Lightformer
          form="rect"
          intensity={6.5}
          scale={[1.2, 8, 1]}
          position={[-3.8, 0, -1.5]}
          rotation={[0, Math.PI / 3, 0]}
          color="#FFFFFF"
        />

        {/* Right vertical edge rim strip */}
        <Lightformer
          form="rect"
          intensity={6.5}
          scale={[1.2, 8, 1]}
          position={[3.8, 0, -1.5]}
          rotation={[0, -Math.PI / 3, 0]}
          color="#E5A958"
        />

        {/* Overhead softbox key */}
        <Lightformer
          form="rect"
          intensity={4.0}
          scale={[4, 2, 1]}
          position={[0, 4.5, 2]}
          rotation={[Math.PI / 2.5, 0, 0]}
          color="#FAF7F2"
        />

        {/* Floor bounce */}
        <Lightformer
          form="ring"
          intensity={2.5}
          scale={[3, 3, 1]}
          position={[0, -2.5, -2]}
          color="#E5A958"
        />
      </Environment>

      <directionalLight
        ref={frontLightRef}
        position={[0.5, 2.5, 4.2]}
        intensity={0.35}
        color="#FAF7F2"
      />

      <directionalLight
        position={[-3, 1.5, -2]}
        intensity={4.2}
        color="#FFFFFF"
      />

      <directionalLight
        position={[3, 1.5, -2]}
        intensity={4.2}
        color="#E5A958"
      />

      {/* Internal liquid uplight */}
      <pointLight
        ref={upLightRef}
        position={[0, -1.8, 0.2]}
        color="#FF8C00"
        intensity={1.0}
        distance={4.2}
        decay={2}
      />
    </>
  );
}
