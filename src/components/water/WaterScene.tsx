import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import WaterPlane from "./WaterPlane";
import Droplet, { DropletHandle } from "./Droplet";
import { createWaterUniforms, MAX_RIPPLES } from "./types";

export interface WaterSceneHandle {
  dropDroplet: () => void;
}

interface Props {
  onSplash: () => void;
}

const WaterScene = forwardRef<WaterSceneHandle, Props>(function WaterScene(
  { onSplash },
  ref,
) {
  const uniforms = useMemo(() => createWaterUniforms(), []);
  const rippleIndexRef = useRef(0);
  const dropletRef = useRef<DropletHandle>(null);

  const addRipple = useCallback(
    (x: number, z: number, time: number) => {
      const slot = rippleIndexRef.current % MAX_RIPPLES;
      uniforms.uRipples.value[slot].set(x, z, time);
      rippleIndexRef.current += 1;
      uniforms.uRippleCount.value = Math.min(
        rippleIndexRef.current,
        MAX_RIPPLES,
      );
    },
    [uniforms],
  );

  useImperativeHandle(
    ref,
    () => ({
      dropDroplet() {
        dropletRef.current?.drop();
      },
    }),
    [],
  );

  return (
    <Canvas
      camera={{ position: [0, 4.2, 8.5], fov: 42, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#000000" }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 8, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffffff" />

      <WaterPlane uniforms={uniforms} />
      <Droplet
        ref={dropletRef}
        uniforms={uniforms}
        onImpact={onSplash}
        addRipple={addRipple}
      />
    </Canvas>
  );
});

export default WaterScene;
