import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scrollStore } from '../store/scrollStore';

export function CameraRig() {
  const { camera, size } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 0.1, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollStore.progress;
    const isMobile = size.width < 768;
    const cursor = scrollStore.cursor;

    // Base coordinate targets
    let cx = 0;
    let cy = 0.1;
    let cz = isMobile ? 6.2 : 5.2;

    let lx = 0;
    let ly = 0;
    let lz = 0;

    // --- Spline interpolation across the 5 Stages ---
    if (p < 0.20) {
      // STAGE 1 (0% - 20%): Silhouette Reveal to First Dolly
      const t = p / 0.20;
      const startZ = isMobile ? 6.2 : 5.2;
      const endZ = isMobile ? 5.1 : 4.15;
      cz = THREE.MathUtils.lerp(startZ, endZ, t);
      cy = THREE.MathUtils.lerp(0.1, 0.15, t);
      cx = 0;
      lx = 0;
      ly = THREE.MathUtils.lerp(-0.05, 0.05, t);
    } else if (p < 0.45) {
      // STAGE 2 (20% - 45%): 360° Macro Surface Inspection
      const t = (p - 0.20) / 0.25;
      const startZ = isMobile ? 5.1 : 4.15;
      const endZ = isMobile ? 3.3 : 2.55;
      cz = THREE.MathUtils.lerp(startZ, endZ, t);
      cy = THREE.MathUtils.lerp(0.15, 0.22, t);
      // On desktop, shift camera slightly left so bottle frames on the right (x: 0.48)
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.42, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.08, t);
      ly = THREE.MathUtils.lerp(0.05, 0.18, t);
    } else if (p < 0.70) {
      // STAGE 3 (45% - 70%): Exploded View Wide
      const t = (p - 0.45) / 0.25;
      const startZ = isMobile ? 3.3 : 2.55;
      const endZ = isMobile ? 6.2 : 4.95;
      cz = THREE.MathUtils.lerp(startZ, endZ, t);
      cy = THREE.MathUtils.lerp(0.22, 0.15, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(-0.42, 0, t);
      lx = 0;
      ly = 0.1;
    } else if (p < 0.88) {
      // STAGE 4 (70% - 88%): Reassembled Serve Ritual
      const t = (p - 0.70) / 0.18;
      const startZ = isMobile ? 6.2 : 4.95;
      const endZ = isMobile ? 4.8 : 3.45;
      cz = THREE.MathUtils.lerp(startZ, endZ, t);
      cy = THREE.MathUtils.lerp(0.15, 0.08, t);
      // Shift camera right on desktop so bottle frames on the left (x: -0.75)
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.55, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.15, t);
      ly = 0;
    } else {
      // STAGE 5 (88% - 100%): Bento & Allocation Pedestal
      const t = Math.min(1, (p - 0.88) / 0.12);
      const startZ = isMobile ? 4.8 : 3.45;
      const endZ = isMobile ? 5.6 : 4.3;
      cz = THREE.MathUtils.lerp(startZ, endZ, t);
      cy = THREE.MathUtils.lerp(0.08, 0.12, t);
      // Bottle framed on the far right pedestal on desktop
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.55, -0.75, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(-0.15, 0.25, t);
      ly = 0.05;
    }

    // Apply damped cursor parallax (gentle luxury tilt)
    const parallaxX = cursor.x * 0.18;
    const parallaxY = cursor.y * 0.12;

    targetCamPos.current.set(cx + parallaxX, cy + parallaxY, cz);
    targetLookAt.current.set(lx, ly, lz);

    // Smooth damp camera position
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.5, delta);

    // Smooth damp camera lookAt target
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.0, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.0, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.0, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}

