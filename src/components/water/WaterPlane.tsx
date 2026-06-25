import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import type { WaterUniforms } from "./types";

interface Props {
  uniforms: WaterUniforms;
}

export default function WaterPlane({ uniforms }: Props) {
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    if (uniforms.uIntro.value < 1) {
      uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + delta * 0.7);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 40, 250, 250]} />
      <shaderMaterial
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        uniforms={uniforms as any}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
