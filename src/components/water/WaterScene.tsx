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
  onImpact: () => void;
}

const WaterScene = forwardRef<WaterSceneHandle, Props>(function WaterScene(
  { onImpact },
  ref,
) {
  const uniforms      = useMemo(() => createWaterUniforms(), []);
  const rippleIdx     = useRef(0);
  const dropletRef    = useRef<DropletHandle>(null);

  const spawnRipple = useCallback(() => {
    const slot = rippleIdx.current % MAX_RIPPLES;
    uniforms.uRipples.value[slot].set(0, 0, uniforms.uTime.value);
    rippleIdx.current++;
    uniforms.uRippleCount.value = Math.min(rippleIdx.current, MAX_RIPPLES);
  }, [uniforms]);

  const handleImpact = useCallback(() => {
    spawnRipple();
    onImpact();
  }, [spawnRipple, onImpact]);

  useImperativeHandle(ref, () => ({
    dropDroplet() { dropletRef.current?.drop(); },
  }), []);

  return (
    <Canvas
      camera={{ position: [0, 5.5, 11.5], fov: 48, near: 0.1, far: 120 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#000000" }}
    >
      <color attach="background" args={["#000000"]} />

      {/* Key light from upper-left — gives drop a highlight edge */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[-3, 9, 5]} intensity={2.2} color="#9ac8ff" />
      <directionalLight position={[5, 4, -3]} intensity={0.55} color="#ffffff" />
      {/* Soft under-fill so the drop bottom isn't completely black */}
      <pointLight position={[0, -1, 4]} intensity={0.4} color="#3a7acc" distance={18} decay={2} />

      <WaterPlane uniforms={uniforms} />
      <Droplet ref={dropletRef} onImpact={handleImpact} />
    </Canvas>
  );
});

export default WaterScene;
