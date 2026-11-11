import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { scrollStore } from '../store/scrollStore';

export function CameraRig() {
  const { camera, size } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 0.05, 5.4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollStore.progress;
    const velocity = scrollStore.velocity;
    const isMobile = size.width < 768;
    const cursor = scrollStore.cursor;

    let cx = 0;
    let cy = 0.04;
    let cz = isMobile ? 6.4 : 5.3;

    let lx = 0;
    let ly = -0.06;
    let lz = 0;

    // --- Continuous Smooth Camera Spline ---
    if (p < 0.16) {
      // Stage 1: Genesis (Center hero, breathing float)
      const t = p / 0.16;
      cz = THREE.MathUtils.lerp(isMobile ? 6.5 : 5.4, isMobile ? 6.2 : 5.2, t);
      cx = 0;
      lx = 0;
    } else if (p < 0.36) {
      // Stage 2: Base Distillate Pour (Bottle on right, camera offsets to frame left card)
      const t = (p - 0.16) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 6.2 : 5.2, isMobile ? 6.0 : 5.1, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.0, -0.26, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0.0, 0.15, t);
    } else if (p < 0.56) {
      // Stage 3: Exploded Formulation (Bottle on left, camera offsets to frame right card)
      const t = (p - 0.36) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 6.0 : 5.1, isMobile ? 6.6 : 5.5, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(-0.26, 0.26, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0.15, -0.15, t);
      ly = THREE.MathUtils.lerp(-0.06, 0.02, t);
    } else if (p < 0.74) {
      // Stage 4: Chill Architecture (Bottle on left, camera frames right modifier cards)
      const t = (p - 0.56) / 0.18;
      cz = THREE.MathUtils.lerp(isMobile ? 6.6 : 5.5, isMobile ? 6.2 : 5.2, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.26, 0.24, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(-0.15, -0.14, t);
      ly = THREE.MathUtils.lerp(0.02, -0.04, t);
    } else if (p < 0.88) {
      // Stage 5: Bespoke Engraving (Bottle on right, camera offsets to frame left card)
      const t = (p - 0.74) / 0.14;
      cz = THREE.MathUtils.lerp(isMobile ? 6.2 : 5.2, isMobile ? 5.9 : 4.9, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.24, -0.25, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(-0.14, 0.15, t);
      ly = -0.04;
    } else {
      // Stage 6: Dispatch Vault (Bottle on left, checkout form on right)
      const t = Math.min(1, (p - 0.88) / 0.12);
      cz = THREE.MathUtils.lerp(isMobile ? 5.9 : 4.9, isMobile ? 6.2 : 5.2, t);
      cx = isMobile ? 0 : THREE.MathUtils.lerp(-0.25, 0.28, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0.15, -0.16, t);
      ly = -0.02;
    }

    // Dynamic speed dolly expansion when scrolling fast
    const velocityZoom = Math.min(0.4, Math.abs(velocity) * 0.003);
    cz += velocityZoom;

    // Interactive cursor parallax (subtle magnetic camera tilt)
    const parallaxX = cursor.x * 0.10;
    const parallaxY = cursor.y * 0.06;

    targetCamPos.current.set(cx + parallaxX, cy + parallaxY, cz);
    targetLookAt.current.set(lx, ly, lz);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.5, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
