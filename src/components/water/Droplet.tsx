import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createTeardropGeometry } from "./teardropGeometry";

export interface DropletHandle {
  drop: () => void;
}

interface Props {
  onImpact: () => void;
  onMounted?: () => void;
}

// Start high enough to be in upper frame, fall to surface
const START_Y   = 5.2;
const SURFACE_Y = 0.05;
const FALL_DUR  = 0.72;   // seconds
const SPLAT_DUR = 0.16;   // squish-into-surface duration

type Phase = "idle" | "falling" | "splat";

const MAX_FRAME_DELTA = 1 / 30;

const Droplet = forwardRef<DropletHandle, Props>(function Droplet(
  { onImpact, onMounted },
  ref,
) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);
  const clockRef = useRef(0);
  const pendingStartRef = useRef(false);
  const mountedRef = useRef(false);

  const beginDrop = (mesh: THREE.Mesh) => {
    phaseRef.current = "falling";
    startRef.current = clockRef.current;
    mesh.visible = true;
    mesh.position.set(0, START_Y, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.setScalar(1);
  };

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
      const mesh = meshRef.current;
      if (!mesh) {
        pendingStartRef.current = true;
        return;
      }
      pendingStartRef.current = false;
      beginDrop(mesh);
    },
  }));

  useFrame((_, delta) => {
    clockRef.current += Math.min(delta, MAX_FRAME_DELTA);
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!mountedRef.current) {
      mountedRef.current = true;
      onMounted?.();
    }

    if (pendingStartRef.current) {
      pendingStartRef.current = false;
      beginDrop(mesh);
    }

    if (phaseRef.current === "idle") return;

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
