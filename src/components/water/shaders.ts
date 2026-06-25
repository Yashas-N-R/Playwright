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
      if (age < 0.0 || age > 6.0) continue;

      float d = distance(pos.xy, r.xy);
      float ringRadius = age * 1.8;
      float ringWidth = 0.55 + age * 0.18;
      float envelope = exp(-pow((d - ringRadius) / ringWidth, 2.0));
      float damp = exp(-age * 0.5);
      float phase = (d - ringRadius) * 7.0 - age * 5.0;
      float osc = sin(phase);
      float wave = envelope * damp * osc * 0.24;

      height += wave;
      slope += envelope * damp * cos(phase) * 7.0;
    }

    // very subtle ambient surface motion
    height += sin(pos.x * 0.4 + uTime * 0.25) * sin(pos.y * 0.5 + uTime * 0.3) * 0.004;

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
    float vignette = 1.0 - smoothstep(6.0, 16.0, dist);

    // bright on crests + slope edges
    float amp = abs(vHeight) * 5.0;
    float edge = abs(vSlope) * 0.18;
    float intensity = pow(amp + edge, 0.85);

    // faint base glow near origin so the plane is barely visible at rest
    float base = exp(-dist * 0.18) * 0.04;

    float c = (intensity + base) * vignette * uIntro;
    c = clamp(c, 0.0, 1.0);

    gl_FragColor = vec4(vec3(c), 1.0);
  }
`;
