import * as THREE from "three";

export interface WaterUniforms {
  uTime: { value: number };
  uIntro: { value: number };
  uRipples: { value: THREE.Vector3[] };
  uRippleCount: { value: number };
}

export const MAX_RIPPLES = 8;

export function createWaterUniforms(): WaterUniforms {
  return {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uRipples: {
      value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3()),
    },
    uRippleCount: { value: 0 },
  };
}
