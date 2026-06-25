import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Droplet, { DropletHandle } from "./Droplet";

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
  const dropletRef = useRef<DropletHandle>(null);

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
      camera={{ position: [0, 1.8, 5.5], fov: 38, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* just enough light to catch the glass edges — no glow */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 6, 3]} intensity={0.45} color="#c8dff5" />
      <directionalLight position={[-3, 2, -2]} intensity={0.12} color="#6090c0" />

      <Environment preset="night" />

      <Droplet ref={dropletRef} onImpact={onImpact} />
    </Canvas>
  );
});

export default WaterScene;
