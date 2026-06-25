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

const START_Y = 5.5;
const SURFACE_Y = 0.0;
const FALL_DURATION = 0.85;
const IMPACT_DURATION = 0.18;

type Phase = "idle" | "falling" | "impact";

const Droplet = forwardRef<DropletHandle, Props>(function Droplet(
  { onImpact },
  ref,
) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);
  const clockRef = useRef(0);

  const geometry = useMemo(() => createTeardropGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#48aaff"),
        emissive: new THREE.Color("#0a3a6e"),
        emissiveIntensity: 0.3,
        roughness: 0.05,
        metalness: 0.08,
        transparent: true,
        opacity: 0.82,
        side: THREE.FrontSide,
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
      mesh.scale.set(1, 1, 1);
    },
  }));

  useFrame((_, delta) => {
    clockRef.current += delta;
    const mesh = meshRef.current;
    if (!mesh || phaseRef.current === "idle") return;

    const elapsed = clockRef.current - startRef.current;

    if (phaseRef.current === "falling") {
      const t = Math.min(elapsed / FALL_DURATION, 1);
      // Gravity: accelerate as it falls
      const eased = t * t;
      mesh.position.y = START_Y + (SURFACE_Y - START_Y) * eased;

      // Subtle liquid wobble — less rigid than a ball
      mesh.rotation.z = Math.sin(elapsed * 5.5) * 0.06 * (1 - t);
      mesh.rotation.x = Math.sin(elapsed * 3.8) * 0.04 * (1 - t);

      // Slight vertical stretch from drag
      const stretchY = 1 + t * 0.18;
      const squishXZ = 1 - t * 0.07;
      mesh.scale.set(squishXZ, stretchY, squishXZ);

      if (t >= 1) {
        phaseRef.current = "impact";
        startRef.current = clockRef.current;
      }
      return;
    }

    if (phaseRef.current === "impact") {
      const t = Math.min(elapsed / IMPACT_DURATION, 1);
      // Flatten: squish vertically, spread horizontally like water hitting a surface
      mesh.position.y = SURFACE_Y - t * 0.04;
      mesh.scale.set(1 + t * 1.4, 1 - t * 0.95, 1 + t * 1.4);

      if (t >= 1) {
        mesh.visible = false;
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
