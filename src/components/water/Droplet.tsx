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

const START_Y = 4.8;
const END_Y = 0.0;
const FALL_DURATION = 0.55;

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

  useFrame(() => {
    const mesh = meshRef.current;
    const st = stateRef.current;
    if (!st.active || !mesh) return;

    const elapsed = uniforms.uTime.value - st.startTime;

    if (elapsed >= FALL_DURATION) {
      mesh.visible = false;
      st.active = false;
      addRipple(0, 0, uniforms.uTime.value);
      onImpact();
      return;
    }

    const t = elapsed / FALL_DURATION;
    const eased = t * t * (1 + t * 0.3);
    mesh.position.y = START_Y + (END_Y - START_Y) * Math.min(eased, 1);

    const stretch = 1 + (1 - t) * 0.0 + t * 0.6;
    const squish = 1 - t * 0.25;
    mesh.scale.set(squish, stretch, squish);
  });

  return (
    <mesh ref={meshRef} position={[0, START_Y, 0]} visible={false}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial
        color={"#ffffff"}
        emissive={"#ffffff"}
        emissiveIntensity={2.5}
        roughness={0.1}
        metalness={0}
      />
    </mesh>
  );
});

export default Droplet;
