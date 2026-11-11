import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { scrollStore } from '../store/scrollStore';

export function StudioLighting() {
  const frontLightRef = useRef<THREE.DirectionalLight>(null);
  const upLightRef = useRef<THREE.PointLight>(null);

  const baseUplights: Record<string, THREE.Color> = {
    yuzu: new THREE.Color('#D97706'),
    blood_orange: new THREE.Color('#991B1B'),
    juniper: new THREE.Color('#065F46'),
  };

  const defaultUplight = new THREE.Color('#C59B27');
  const currentUpColor = useRef(new THREE.Color('#D97706'));

  useFrame((_, delta) => {
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    // Up light follows liquid distillate color and proportional volume
    const targetColor = formula.base ? baseUplights[formula.base] : defaultUplight;
    currentUpColor.current.lerp(targetColor, delta * 3.5);

    if (upLightRef.current) {
      upLightRef.current.color.copy(currentUpColor.current);
      // Illuminates only as liquid fills the vessel
      const targetIntensity = pour.fillLevel > 0.05 
        ? (formula.chill === 'glacial' ? 5.2 * pour.fillLevel : 4.4 * pour.fillLevel)
        : 0.15;

      upLightRef.current.intensity = THREE.MathUtils.damp(
        upLightRef.current.intensity,
        targetIntensity,
        4,
        delta
      );
    }

    if (frontLightRef.current) {
      frontLightRef.current.intensity = THREE.MathUtils.damp(
        frontLightRef.current.intensity,
        1.8,
        4,
        delta
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} color="#FBF8F3" />

      <Environment resolution={256}>
        {/* Gallery studio softbox - top */}
        <Lightformer
          form="rect"
          intensity={3.8}
          scale={[5, 4, 1]}
          position={[0, 5, 2]}
          rotation={[Math.PI / 3, 0, 0]}
          color="#FFFDF9"
        />

        {/* Sculpting dark rim flags - essential for glass clarity against light backgrounds! */}
        <Lightformer
          form="rect"
          intensity={3.2}
          scale={[0.8, 8, 1]}
          position={[-3.5, 0, -1]}
          rotation={[0, Math.PI / 3, 0]}
          color="#1A1816"
        />

        <Lightformer
          form="rect"
          intensity={3.2}
          scale={[0.8, 8, 1]}
          position={[3.5, 0, -1]}
          rotation={[0, -Math.PI / 3, 0]}
          color="#1A1816"
        />

        {/* Warm amber floor bounce */}
        <Lightformer
          form="ring"
          intensity={2.0}
          scale={[4, 4, 1]}
          position={[0, -3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#F2E8DC"
        />
      </Environment>

      {/* Main key light */}
      <directionalLight
        ref={frontLightRef}
        position={[2.5, 4.5, 3.5]}
        intensity={1.8}
        color="#FFFFFF"
        castShadow
      />

      {/* Subtle rim backlight for glass refraction */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={2.4}
        color="#F8F3EC"
      />
      <directionalLight
        position={[3, 2, -3]}
        intensity={2.4}
        color="#EFE8DE"
      />

      {/* Liquid internal punt illumination */}
      <pointLight
        ref={upLightRef}
        position={[0, -1.3, 0.1]}
        color="#D97706"
        intensity={0.2}
        distance={3.5}
        decay={2}
      />
    </>
  );
}
