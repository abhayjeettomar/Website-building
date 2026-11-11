---
name: threejs-photorealistic-liquids
description: Architecture, shaders, and physics for rendering hyper-realistic liquids, fluid pouring streams, vortex draining, and menisci inside glass vessels in Three.js and React Three Fiber.
---

# Three.js Photorealistic Liquid Systems

When rendering beverages, perfumes, or botanical elixirs inside glass vessels, standard single-color meshes look like cartoon plastic cylinders. Follow these rules for gallery-grade realism.

## 1. Meniscus & Fluid Surface Geometry
- Liquid never ends abruptly in a flat cut. Surface tension creates a concave curve (the meniscus) creeping slightly up against the glass boundary.
- Always include an interactive top fluid disc (`CylinderGeometry` with `radiusTop` slightly curved or a subdivided disc) with vertex wave displacement driven by `sin(time * speed + distance)`.

## 2. Beer-Lambert Law Absorption (Volumetric Depth)
- Real liquid absorbs light exponentially based on path length:
  - Thin layers (near surface edges) appear bright, luminous, and translucent.
  - Deep layers (core and base punt) are rich, dark, and saturated.
- Use `MeshPhysicalMaterial`:
  - `transmission: 0.88` to `0.94`
  - `ior: 1.333` (water) or `1.36` (elixir/syrup)
  - `thickness: 0.85`
  - `attenuationColor`: Warm tinted hue matching the botanical profile
  - `attenuationDistance: 0.45` to `0.65`
  - `roughness: 0.02` to `0.05`

## 3. Dynamic Pouring Stream (Laminar Flow)
- Never use a static cylinder. A real pouring stream exhibits:
  - **Gravity acceleration tapering**: The stream is thicker near the neck and narrows as it accelerates downward.
  - **Helical shimmer**: A rotating turbulence normal map or subtle vertex wiggle (`sin(time * 24 + y * 8)`).
  - **Surface impact foam & ripples**: A radial ripple wave expanding outward from the impact point.

## 4. Vortex Draining Animation
- When emptying, liquids swirl into a rotational vortex funnel:
  - Increase `rotation.y` velocity (`delta * 5.0`).
  - Depress the center of the liquid surface (`y` lower in center, higher at outer walls).
  - Rapidly collapse the volume down into the punt punt depression.

