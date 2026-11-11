---
name: minimalist-luxury-editorial
description: Principles for restrained, gallery-grade luxury digital showcases (Aesop, Le Labo, Apple Special Projects, Byredo, Kin Euphorics). Eliminates visual clutter, text collisions, and generic AI artifacts.
---

# Minimalist Luxury Editorial Craft

High-end luxury brands operate on radical restraint. Clutter is the tell of cheap marketing; stillness and disciplined whitespace are the hallmarks of craft.

## 1. The Opening Screen (Radical Restraint)
- The first viewport must never compete with the hero artifact.
- **Rule of One**: Exactly one headline, one quiet subtitle, one minimal indicator.
- Never place giant watermarks, overlapping ghost type, technical telemetry strings, coordinates, and multiple badges simultaneously in the hero.
- Allow the 3D vessel to breathe in natural, sculpted gallery light.

## 2. Spatial Stage Separation & Zero Collision
- 3D hero objects must be framed with at least 15–20% margin from the viewport boundary.
- When an interactive drawer or HUD panel opens on the left or right, the 3D object must dolly or translate to the opposite quadrant with generous negative space.
- Never zoom the camera into macro range when options are open; the user must see the entire product reacting to their selection.

## 3. Strict DOM Element Isolation
- Unused stages must be completely hidden (`display: none` or `pointer-events: none` with `opacity: 0`) to guarantee that text elements from different scroll stages never stack or overlap.
- Card panels must enforce `max-height: 85vh` with smooth interior overflow to prevent clipping on laptops and mobile devices.

