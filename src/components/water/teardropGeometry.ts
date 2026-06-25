import * as THREE from "three";

/**
 * Asymmetric teardrop: rounded top, elongated pointed tip at bottom.
 * Rotated around Y axis using LatheGeometry.
 */
export function createTeardropGeometry(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 40;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = tip (bottom), 1 = top crown

    // Parametric teardrop: sin gives the width profile,
    // bias (1 - 0.45*cos) makes the top rounder and bottom pointier
    const angle = t * Math.PI;
    const r = Math.sin(angle) * 0.38 * (1 - 0.45 * Math.cos(angle));

    // Stretch vertically so it looks elongated like a falling drop
    const y = t * 1.05 - 0.35; // tip at y≈-0.35, crown at y≈0.70

    points.push(new THREE.Vector2(Math.max(0, r), y));
  }

  const geo = new THREE.LatheGeometry(points, 48);
  geo.computeVertexNormals();
  return geo;
}
