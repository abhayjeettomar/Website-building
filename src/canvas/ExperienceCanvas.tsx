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
          fov: 36,
          near: 0.1,
          far: 50,
          position: [0, 0.05, 5.4],
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          localClippingEnabled: true,
        }}
        onCreated={({ gl, scene }) => {
          (window as any).__THREE_SCENE__ = scene;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.localClippingEnabled = true;
        }}
        dpr={[1, Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <CameraRig />
          <BottleAssembly />
          {/* Refined warm contact shadow plinth */}
          <ContactShadows
            position={[0, -1.60, 0]}
            opacity={0.38}
            scale={4.8}
            blur={2.0}
            far={3.8}
            color="#2A2118"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
