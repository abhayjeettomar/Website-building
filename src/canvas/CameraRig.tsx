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
    const isMobile = size.width < 768;
    const cursor = scrollStore.cursor;

    let cx = 0;
    let cy = 0.05;
    // Comfortable gallery distance: entire bottle always framed with ample negative space
    let cz = isMobile ? 6.5 : 5.4;

    let lx = 0;
    let ly = 0;
    let lz = 0;

    // --- Camera Spline Across the 6 Stages (No excessive macro zoom) ---
    if (p < 0.16) {
      // Stage 1: Genesis (Center hero, comfortable framing)
      const t = p / 0.16;
      cz = THREE.MathUtils.lerp(isMobile ? 6.5 : 5.5, isMobile ? 6.2 : 5.3, t);
      cy = THREE.MathUtils.lerp(0.08, 0.04, t);
      cx = 0;
      lx = 0;
      ly = 0;
    } else if (p < 0.36) {
      // Stage 2: Base Distillate Pour (Bottle shifts right on desktop, ample breathing room)
      const t = (p - 0.16) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 6.2 : 5.3, isMobile ? 6.0 : 5.2, t);
      cy = 0.06;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.32, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.06, t);
      ly = 0.02;
    } else if (p < 0.56) {
      // Stage 3: Exploded Formulation (Slightly pulled back to show full explosion)
      const t = (p - 0.36) / 0.20;
      cz = THREE.MathUtils.lerp(isMobile ? 6.0 : 5.2, isMobile ? 6.6 : 5.6, t);
      cy = 0.08;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(-0.32, 0, t);
      lx = 0;
      ly = 0.06;
    } else if (p < 0.74) {
      // Stage 4: Chill Architecture (Bottle shifts left, full view of ice & condensation)
      const t = (p - 0.56) / 0.18;
      cz = THREE.MathUtils.lerp(isMobile ? 6.6 : 5.6, isMobile ? 6.2 : 5.3, t);
      cy = 0.05;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.34, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.06, t);
      ly = 0.02;
    } else if (p < 0.88) {
      // Stage 5: Bespoke Engraving (Centered, frontal view with label fully legible)
      const t = (p - 0.74) / 0.14;
      cz = THREE.MathUtils.lerp(isMobile ? 6.2 : 5.3, isMobile ? 5.8 : 5.0, t);
      cy = 0.04;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0.34, 0, t);
      lx = 0;
      ly = -0.02;
    } else {
      // Stage 6: Dispatch Vault (Bottle on left, checkout form on right)
      const t = Math.min(1, (p - 0.88) / 0.12);
      cz = THREE.MathUtils.lerp(isMobile ? 5.8 : 5.0, isMobile ? 6.2 : 5.3, t);
      cy = 0.06;
      cx = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.38, t);
      lx = isMobile ? 0 : THREE.MathUtils.lerp(0, -0.08, t);
      ly = 0.02;
    }

    // Micro cursor parallax (subtle, non-distracting)
    const parallaxX = cursor.x * 0.08;
    const parallaxY = cursor.y * 0.05;

    targetCamPos.current.set(cx + parallaxX, cy + parallaxY, cz);
    targetLookAt.current.set(lx, ly, lz);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.8, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.2, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.2, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.2, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
