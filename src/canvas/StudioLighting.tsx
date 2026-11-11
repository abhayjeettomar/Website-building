import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { scrollStore } from '../store/scrollStore';

export function StudioLighting() {
  const frontLightRef = useRef<THREE.DirectionalLight>(null);
  const upLightRef = useRef<THREE.PointLight>(null);
  const backRimRef = useRef<THREE.DirectionalLight>(null);

  const baseUplights: Record<string, { main: THREE.Color; rim: THREE.Color }> = {
    yuzu: { 
      main: new THREE.Color('#F59E0B'),
      rim: new THREE.Color('#FEF3C7')
    },
    blood_orange: { 
      main: new THREE.Color('#DC2626'),
      rim: new THREE.Color('#FEE2E2')
    },
    juniper: { 
      main: new THREE.Color('#10B981'),
      rim: new THREE.Color('#D1FAE5')
    },
  };

  const defaultColors = {
    main: new THREE.Color('#E5A84B'),
    rim: new THREE.Color('#FFF8EE')
  };

  const currentMainColor = useRef(new THREE.Color('#F59E0B'));

  useFrame((_, delta) => {
    const formula = scrollStore.formula;
    const pour = scrollStore.pour;

    // Up light follows liquid distillate color and proportional volume
    const targetColors = formula.base ? (baseUplights[formula.base] || defaultColors) : defaultColors;
    currentMainColor.current.lerp(targetColors.main, delta * 4);

    if (upLightRef.current) {
      upLightRef.current.color.copy(currentMainColor.current);
      // Brightens gracefully as liquid fills the vessel
      const targetIntensity = pour.fillLevel > 0.04
        ? 3.8 * Math.max(0.2, pour.fillLevel)
        : 0.2;

      upLightRef.current.intensity = THREE.MathUtils.damp(
        upLightRef.current.intensity,
        targetIntensity,
        4,
        delta
      );
    }

    if (frontLightRef.current) {
      frontLightRef.current.intensity = 1.6;
    }

    if (backRimRef.current) {
      backRimRef.current.intensity = 2.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} color="#FCFAF7" />

      {/* Primary Key Light */}
      <directionalLight
        ref={frontLightRef}
        position={[2.5, 4.0, 3.5]}
        intensity={1.6}
        color="#FFFDF9"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Dramatic Back Rim Light (Carves the liquid silhouette with golden edge light) */}
      <directionalLight
        ref={backRimRef}
        position={[-1.5, 2.5, -3.5]}
        intensity={2.4}
        color="#FFF6E8"
      />

      {/* Inner Punt Uplight (Internal luminous core inside the liquid) */}
      <pointLight
        ref={upLightRef}
        position={[0, -1.00, 0]}
        intensity={0.2}
        distance={3.5}
        decay={2}
      />

      {/* Gallery Studio HDRI Lightformers */}
      <Environment resolution={512}>
        {/* Soft Luxury Studio Specular Highlight - Left Flank */}
        <Lightformer
          form="rect"
          intensity={3.4}
          scale={[0.85, 7.0, 1]}
          position={[-3.0, 0.5, 1.8]}
          rotation={[0, Math.PI / 4, 0]}
          color="#FFFAF2"
        />

        {/* Soft Champagne Specular Highlight - Right Flank */}
        <Lightformer
          form="rect"
          intensity={2.8}
          scale={[0.85, 7.0, 1]}
          position={[3.0, 0.5, 1.8]}
          rotation={[0, -Math.PI / 4, 0]}
          color="#FFF6EB"
        />

        {/* Overhead Softbox */}
        <Lightformer
          form="rect"
          intensity={3.5}
          scale={[4, 4, 1]}
          position={[0, 5, 1]}
          rotation={[Math.PI / 3, 0, 0]}
          color="#FFFDF9"
        />

        {/* Rear Translucent Backplate (Illuminates glass caustics from behind) */}
        <Lightformer
          form="rect"
          intensity={2.8}
          scale={[6, 6, 1]}
          position={[0, 1, -4]}
          rotation={[0, 0, 0]}
          color="#FAF5EE"
        />

        {/* Warm Studio Floor Bounce */}
        <Lightformer
          form="ring"
          intensity={1.8}
          scale={[5, 5, 1]}
          position={[0, -3.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#F5EFE6"
        />
      </Environment>
    </>
  );
}
