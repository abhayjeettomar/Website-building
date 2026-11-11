import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { StudioLighting } from './StudioLighting';
import { CameraRig } from './CameraRig';
import { BottleAssembly } from './BottleAssembly';

export function ExperienceCanvas() {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-20 overflow-hidden">
      <Canvas
        camera={{
          fov: 38,
          near: 0.1,
          far: 50,
          position: [0, 0.1, 5.2],
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 2)]}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <CameraRig />
          <BottleAssembly />
        </Suspense>
      </Canvas>
    </div>
  );
}

