import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { scrollStore } from '../store/scrollStore';

export function StudioLighting() {
  const frontLightRef = useRef<THREE.DirectionalLight>(null);
  const upLightRef = useRef<THREE.PointLight>(null);
  const rimLightLeftRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRightRef = useRef<THREE.DirectionalLight>(null);

  // Dynamic color targets for Serve Ritual
  const targetWarmKey = useRef(new THREE.Color('#FFF5E4'));
  const targetGlacialKey = useRef(new THREE.Color('#9CE0FF'));
  const targetAmberUp = useRef(new THREE.Color('#FF6A00'));
  const targetIceUp = useRef(new THREE.Color('#38BDF8'));
  const currentKeyColor = useRef(new THREE.Color('#FFF5E4'));
  const currentUpColor = useRef(new THREE.Color('#FF6A00'));

  useFrame((_, delta) => {
    const p = scrollStore.progress;
    const isIce = scrollStore.serveMode === 'ice';

    // 1. Stage 1 Silhouette to Stage 2 Studio Key Ramp
    // In Stage 1 (p < 0.2), keep front key subdued for dramatic backlit silhouette
    let targetFrontIntensity = 0.35;
    if (p >= 0.15 && p < 0.45) {
      // Stage 2 Macro: Full studio lighting
      targetFrontIntensity = 2.8;
    } else if (p >= 0.45 && p < 0.70) {
      // Stage 3 Exploded: High detail architectural lighting
      targetFrontIntensity = 3.2;
    } else if (p >= 0.70 && p < 0.88) {
      // Stage 4 Reassembled / Serve
      targetFrontIntensity = 2.4;
    } else if (p >= 0.88) {
      // Stage 5 Bento Pedestal
      targetFrontIntensity = 1.8;
    }

    if (frontLightRef.current) {
      frontLightRef.current.intensity = THREE.MathUtils.damp(
        frontLightRef.current.intensity,
        targetFrontIntensity,
        4,
        delta
      );
    }

    // 2. Serve Ritual Color Transition (Neat Amber vs Artisanal Ice Glacial)
    const activeKeyTarget = isIce ? targetGlacialKey.current : targetWarmKey.current;
    const activeUpTarget = isIce ? targetIceUp.current : targetAmberUp.current;

    currentKeyColor.current.lerp(activeKeyTarget, delta * 3.5);
    currentUpColor.current.lerp(activeUpTarget, delta * 3.5);

    if (frontLightRef.current) {
      frontLightRef.current.color.copy(currentKeyColor.current);
    }

    if (upLightRef.current) {
      upLightRef.current.color.copy(currentUpColor.current);
      // Pulsing amber/cyan core intensity tied to velocity
      const velocityPulse = Math.min(Math.abs(scrollStore.velocity) * 0.4, 3.5);
      const baseUpIntensity = isIce ? 7.0 : 8.5;
      upLightRef.current.intensity = THREE.MathUtils.damp(
        upLightRef.current.intensity,
        baseUpIntensity + velocityPulse,
        5,
        delta
      );
    }
  });

  return (
    <>
      {/* Studio Environment HDR lightformers to carve razor-sharp edges */}
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
          color="#F4B860"
        />

        {/* Overhead softbox key */}
        <Lightformer
          form="rect"
          intensity={4.0}
          scale={[4, 2, 1]}
          position={[0, 4.5, 2]}
          rotation={[Math.PI / 2.5, 0, 0]}
          color="#FFF5E4"
        />

        {/* Backlight floor bounce */}
        <Lightformer
          form="ring"
          intensity={3.0}
          scale={[3, 3, 1]}
          position={[0, -2.5, -2]}
          rotation={[0, 0, 0]}
          color="#D97724"
        />
      </Environment>

      {/* Front directional key light */}
      <directionalLight
        ref={frontLightRef}
        position={[0.5, 2.5, 4.2]}
        intensity={0.35}
        color="#FFF5E4"
      />

      {/* Left crisp accent rim */}
      <directionalLight
        ref={rimLightLeftRef}
        position={[-3, 1.5, -2]}
        intensity={4.2}
        color="#FFFFFF"
      />

      {/* Right champagne accent rim */}
      <directionalLight
        ref={rimLightRightRef}
        position={[3, 1.5, -2]}
        intensity={4.2}
        color="#F4B860"
      />

      {/* Internal molten amber liquid uplight directly beneath punt */}
      <pointLight
        ref={upLightRef}
        position={[0, -1.8, 0.2]}
        color="#FF6A00"
        intensity={8.5}
        distance={4.2}
        decay={2}
      />
    </>
  );
}

