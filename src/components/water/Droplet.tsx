import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { WaterUniforms } from "./types";

export interface DropletHandle {
  drop: () => void;
}

interface Props {
  uniforms: WaterUniforms;
  onImpact: () => void;
  addRipple: (x: number, z: number, time: number) => void;
}

const START_Y = 4.2;
const END_Y = 0.0;
const FALL_DURATION = 0.65;

// water-blue palette
const DROP_COLOR = "#3b82f6";
const DROP_EMISSIVE = "#1d4ed8";

const Droplet = forwardRef<DropletHandle, Props>(function Droplet(
  { uniforms, onImpact, addRipple },
  ref,
) {
  const meshRef = useRef<THREE.Mesh>(null);
  const stateRef = useRef<{ active: boolean; startTime: number }>({
    active: false,
    startTime: 0,
  });

  useImperativeHandle(ref, () => ({
    drop() {
      stateRef.current = {
        active: true,
        startTime: uniforms.uTime.value,
      };
      if (meshRef.current) {
        meshRef.current.visible = true;
        meshRef.current.position.set(0, START_Y, 0);
        meshRef.current.scale.set(1, 1, 1);
      }
    },
  }));

  const spawnRipples = (t: number) => {
    // primary impact + two soft trailing echoes for a natural spread
    addRipple(0, 0, t);
    addRipple(0, 0, t + 0.18);
    addRipple(0.08, 0.05, t + 0.38);
  };

  useFrame(() => {
    const mesh = meshRef.current;
    const st = stateRef.current;
    if (!st.active || !mesh) return;

    const elapsed = uniforms.uTime.value - st.startTime;

    if (elapsed >= FALL_DURATION) {
      mesh.visible = false;
      st.active = false;
      spawnRipples(uniforms.uTime.value);
      onImpact();
      return;
    }

    const t = elapsed / FALL_DURATION;
    // ease-in gravity curve
    const eased = t * t;
    mesh.position.y = START_Y + (END_Y - START_Y) * eased;

    // subtle teardrop stretch as it falls
    const stretch = 1 + t * 0.35;
    const squish = 1 - t * 0.12;
    mesh.scale.set(squish, stretch, squish);
  });

  return (
    <mesh ref={meshRef} position={[0, START_Y, 0]} visible={false}>
      <sphereGeometry args={[0.13, 32, 32]} />
      <meshStandardMaterial
        color={DROP_COLOR}
        emissive={DROP_EMISSIVE}
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.05}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
});

export default Droplet;
