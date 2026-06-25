import { forwardRef, useImperativeHandle, useRef } from "react";
import { Canvas } from "@react-three/fiber";
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

  useImperativeHandle(ref, () => ({
    dropDroplet() {
      dropletRef.current?.drop();
    },
  }), []);

  return (
    <Canvas
      camera={{ position: [0, 3.0, 9.5], fov: 42, near: 0.1, far: 80 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Key light from upper-left — catches the drop edge */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={2.5}
        color="#a8d4ff"
      />
      <directionalLight
        position={[4, 4, -2]}
        intensity={0.8}
        color="#ffffff"
      />
      {/* Soft fill from below to show the underside of the drop */}
      <pointLight position={[0, -1, 3]} intensity={0.5} color="#4488cc" />

      <Droplet ref={dropletRef} onImpact={onImpact} />
    </Canvas>
  );
});

export default WaterScene;
