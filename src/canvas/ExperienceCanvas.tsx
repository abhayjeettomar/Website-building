import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
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
          gl.toneMappingExposure = 1.15;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        dpr={[1, Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <CameraRig />
          <BottleAssembly />
          {/* Subtle warm contact shadow plinth */}
          <ContactShadows
            position={[0, -1.62, 0]}
            opacity={0.32}
            scale={4.2}
            blur={2.2}
            far={3.5}
            color="#2A231C"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
