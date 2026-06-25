import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createTeardropGeometry } from "./teardropGeometry";

export interface DropletHandle {
  drop: () => void;
}

interface Props {
  onImpact: () => void;
}

// Start high enough to be in upper frame, fall to surface
const START_Y   = 7.0;
const SURFACE_Y = 0.05;
const FALL_DUR  = 0.90;   // seconds
const SPLAT_DUR = 0.16;   // squish-into-surface duration

type Phase = "idle" | "falling" | "splat";

const Droplet = forwardRef<DropletHandle, Props>(function Droplet(
  { onImpact },
  ref,
) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);
  const clockRef = useRef(0);

  const geometry = useMemo(() => createTeardropGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:            new THREE.Color("#5bb8ff"),
        emissive:         new THREE.Color("#0c2d5e"),
        emissiveIntensity: 0.25,
        roughness:        0.04,
        metalness:        0.0,
        transparent:      true,
        opacity:          0.80,
        side:             THREE.FrontSide,
      }),
    [],
  );

  useImperativeHandle(ref, () => ({
    drop() {
      phaseRef.current = "falling";
      startRef.current = clockRef.current;
      const mesh = meshRef.current;
      if (!mesh) return;
      mesh.visible = true;
      mesh.position.set(0, START_Y, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.setScalar(1);
    },
  }));

  useFrame((_, delta) => {
    clockRef.current += delta;
    const mesh = meshRef.current;
    if (!mesh || phaseRef.current === "idle") return;

    const elapsed = clockRef.current - startRef.current;

    if (phaseRef.current === "falling") {
      const t       = Math.min(elapsed / FALL_DUR, 1);
      const gravity = t * t;                           // accelerate downward
      mesh.position.y = START_Y + (SURFACE_Y - START_Y) * gravity;

      // Tiny liquid wobble — not a rigid ball
      mesh.rotation.z = Math.sin(elapsed * 5.0) * 0.05 * (1 - t);
      mesh.rotation.x = Math.sin(elapsed * 3.5) * 0.03 * (1 - t);

      // Streamline: stretch vertically as it picks up speed
      const stretchY  = 1 + t * 0.22;
      const squishXZ  = 1 - t * 0.09;
      mesh.scale.set(squishXZ, stretchY, squishXZ);

      if (t >= 1) {
        phaseRef.current = "splat";
        startRef.current  = clockRef.current;
      }
      return;
    }

    if (phaseRef.current === "splat") {
      // Flatten fast — drop merges into the water surface
      const t = Math.min(elapsed / SPLAT_DUR, 1);
      mesh.scale.set(1 + t * 1.6, 1 - t * 0.97, 1 + t * 1.6);
      mesh.position.y = SURFACE_Y - t * 0.05;

      if (t >= 1) {
        mesh.visible     = false;
        phaseRef.current = "idle";
        onImpact();
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      visible={false}
    />
  );
});

export default Droplet;
