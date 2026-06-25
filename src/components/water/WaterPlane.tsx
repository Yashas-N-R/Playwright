import { useFrame } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "./shaders";
import type { WaterUniforms } from "./types";

interface Props {
  uniforms: WaterUniforms;
}

export default function WaterPlane({ uniforms }: Props) {
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    if (uniforms.uIntro.value < 1) {
      // Slow fade-in so the surface doesn't pop in
      uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + delta * 0.55);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* 220×220 = 48k quads — enough detail for smooth concentric rings */}
      <planeGeometry args={[40, 40, 220, 220]} />
      <shaderMaterial
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        uniforms={uniforms as any}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
