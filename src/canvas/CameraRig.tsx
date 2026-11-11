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

    let cx = 0;
    let cy = 0.1;
    let cz = isMobile ? 6.2 : 5.2;

    let lx = 0;
    let ly = 0;
    let lz = 0;

    // --- Camera Spline Across the 6 Stages ---
    if (p < 0.16) {
      // Stage 1: Empty vessel
      const t = p / 0.16;
      cz = THREE.MathUtils.lerp(isMobile ? 6.2 : 5.2, isMobile ? 5.2 : 4.4, t);
      cy = 0.1;
      cx = 0;
    } else if (p < 0.36) {
      // Stage 2: Base filling (bottle on right, UI on left)
      const t = (p - 0.16) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 5.2 : 4.4, isMobile ? 4.2 : 3.4, t);
      cy = 0.15;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.38, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.08, t);
    } else if (p < 0.56) {
      // Stage 3: Exploded view wide
      const t = (p - 0.36) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 4.2 : 3.4, isMobile ? 6.4 : 5.2, t);
      cy = 0.12;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(-0.38, 0, t);
      lx = 0;
      ly = 0.08;
    } else if (p < 0.74) {
      // Stage 4: Chill & Serve (bottle on left, UI on right)
      const t = (p - 0.56) / 0.18;
      cz = THREE.MathUtils.lerp(isMobile ? 6.4 : 5.2, isMobile ? 4.8 : 3.8, t);
      cy = 0.08;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.48, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.15, t);
    } else if (p < 0.88) {
      // Stage 5: Label Personalization (centered head-on)
      const t = (p - 0.74) / 0.14;
      cz = THREE.MathUtils.lerp(isMobile ? 4.8 : 3.8, isMobile ? 4.2 : 3.2, t);
      cy = 0.06;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.48, 0, t);
      lx = 0;
      ly = -0.05;
    } else {
      // Stage 6: Dispatch Vault (bottle on left, form on right)
      const t = Math.min(1, (p - 0.88) / 0.12);
      cz = THREE.MathUtils.lerp(isMobile ? 4.2 : 3.2, isMobile ? 4.6 : 3.7, t);
      cy = 0.08;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.52, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.18, t);
      ly = 0;
    }

    // Cursor parallax
    const parallaxX = cursor.x * 0.12;
    const parallaxY = cursor.y * 0.08;

    targetCamPos.current.set(cx + parallaxX, cy + parallaxY, cz);
    targetLookAt.current.set(lx, ly, lz);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.5, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.0, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.0, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.0, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
