import * as THREE from "three";

/**
 * Asymmetric teardrop: pointed tip at the bottom, rounded crown at the top.
 * Wider in the upper half — matches a real falling water drop.
 */
export function createTeardropGeometry(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 48;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;             // 0 = bottom tip, 1 = top crown
    const phi = t * Math.PI;

    // r peaks just above centre and narrows toward both ends
    // (1 - 0.45 cos φ) shifts the widest point up from the equator
    const r = Math.sin(phi) * 0.42 * (1 - 0.45 * Math.cos(phi));
    // y: tip at -0.38, crown at +0.78  → total height ≈ 1.16
    const y = t * 1.16 - 0.38;

    points.push(new THREE.Vector2(Math.max(0, r), y));
  }

  const geo = new THREE.LatheGeometry(points, 52);
  geo.computeVertexNormals();
  return geo;
}
