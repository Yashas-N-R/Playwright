import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createTeardropGeometry } from "./teardropGeometry";

export interface DropletHandle {
  drop: () => void;
}

interface Props {
  onImpact: () => void;
}

const START_Y = 3.2;
const SURFACE_Y = 0.02;
const FALL_DURATION = 0.72;
const IMPACT_DURATION = 0.14;

type DropPhase = "idle" | "falling" | "impact";

const Droplet = forwardRef<DropletHandle, Props>(function Droplet(
  { onImpact },
  ref,
) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef<DropPhase>("idle");
  const startRef = useRef(0);
  const clockRef = useRef(0);

  const geometry = useMemo(() => createTeardropGeometry(), []);

  useImperativeHandle(ref, () => ({
    drop() {
      phaseRef.current = "falling";
      startRef.current = clockRef.current;
      const mesh = meshRef.current;
      if (mesh) {
        mesh.visible = true;
        mesh.position.set(0, START_Y, 0);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
      }
    },
  }));

  useFrame((_, delta) => {
    clockRef.current += delta;
    const mesh = meshRef.current;
    if (!mesh || phaseRef.current === "idle") return;

    const elapsed = clockRef.current - startRef.current;

    if (phaseRef.current === "falling") {
      const t = Math.min(elapsed / FALL_DURATION, 1);
      const gravity = t * t * t;
      mesh.position.y = START_Y + (SURFACE_Y - START_Y) * gravity;

      // slight wobble — feels like liquid, not a rigid ball
      mesh.rotation.z = Math.sin(elapsed * 6) * 0.04 * (1 - t);
      mesh.rotation.x = Math.sin(elapsed * 4.5) * 0.03 * (1 - t);

      if (t >= 1) {
        phaseRef.current = "impact";
        startRef.current = clockRef.current;
      }
      return;
    }

    if (phaseRef.current === "impact") {
      const t = Math.min(elapsed / IMPACT_DURATION, 1);
      // flatten into the surface like real water hitting
      mesh.position.y = SURFACE_Y - t * 0.025;
      mesh.scale.set(1 + t * 0.55, 1 - t * 0.82, 1 + t * 0.55);
      mesh.rotation.z *= 1 - t;

      if (t >= 1) {
        mesh.visible = false;
        phaseRef.current = "idle";
        onImpact();
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} visible={false} castShadow>
      <meshPhysicalMaterial
        color="#5eb3f5"
        transmission={0.92}
        thickness={0.18}
        roughness={0.04}
        metalness={0}
        ior={1.33}
        transparent
        opacity={1}
        clearcoat={0.9}
        clearcoatRoughness={0.08}
        attenuationColor="#1a4a7a"
        attenuationDistance={0.35}
        envMapIntensity={0.6}
      />
    </mesh>
  );
});

export default Droplet;
