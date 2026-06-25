import * as THREE from "three";

/** Teardrop profile rotated so the tip points downward. */
export function createTeardropGeometry(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 28;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const phi = t * Math.PI;
    const radius = Math.sin(phi) * 0.042;
    const y = -Math.cos(phi) * 0.11;
    points.push(new THREE.Vector2(radius, y));
  }

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}
