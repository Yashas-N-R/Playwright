export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uRipples[8];
  uniform int uRippleCount;
  uniform float uIntro;

  varying float vHeight;
  varying float vSlope;
  varying vec3 vWorldPos;

  void main() {
    vec3 pos = position;
    float height = 0.0;
    float slope = 0.0;

    for (int i = 0; i < 8; i++) {
      if (i >= uRippleCount) break;
      vec3 r = uRipples[i];
      float age = uTime - r.z;
      if (age < 0.0 || age > 8.0) continue;

      float d = distance(pos.xy, r.xy);

      // slower, wider rings — closer to real water propagation
      float ringRadius = age * 1.15;
      float ringWidth = 0.9 + age * 0.35;
      float envelope = exp(-pow((d - ringRadius) / ringWidth, 2.0));

      // gentle decay so ripples fade out naturally
      float damp = exp(-age * 0.38);

      // lower frequency = smoother, less "strobing" waves
      float phase = (d - ringRadius) * 4.2 - age * 2.8;
      float osc = sin(phase);

      // soft harmonic for a more organic feel
      float harmonic = sin(phase * 1.6 + 0.4) * 0.25;
      float wave = envelope * damp * (osc + harmonic) * 0.09;

      height += wave;
      slope += envelope * damp * cos(phase) * 3.5;
    }

    // barely-there ambient surface drift
    height += sin(pos.x * 0.25 + uTime * 0.18) * sin(pos.y * 0.3 + uTime * 0.22) * 0.002;

    pos.z += height;
    vHeight = height;
    vSlope = slope;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;

  varying float vHeight;
  varying float vSlope;
  varying vec3 vWorldPos;

  void main() {
    float dist = length(vWorldPos.xz);
    float vignette = 1.0 - smoothstep(5.0, 18.0, dist);

    // much softer highlight — crests only, not full white blast
    float amp = abs(vHeight) * 2.2;
    float edge = abs(vSlope) * 0.06;
    float intensity = pow(amp + edge, 1.4);

    // faint cool-blue pool glow at center, barely visible at rest
    float base = exp(-dist * 0.22) * 0.018;

    float alpha = clamp((intensity + base) * vignette * uIntro, 0.0, 0.42);

    // soft water-blue tint instead of harsh white
    vec3 waterColor = vec3(0.22, 0.48, 0.82);
    vec3 highlight  = vec3(0.55, 0.72, 0.95);
    vec3 color = mix(waterColor, highlight, intensity * 0.55) * alpha;

    gl_FragColor = vec4(color, alpha);
  }
`;
