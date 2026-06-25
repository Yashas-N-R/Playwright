export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform vec3 uRipples[8];
  uniform int uRippleCount;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vHeight;

  void main() {
    vec3 pos = position;
    float h = 0.0;
    vec2 grad = vec2(0.0);

    for (int i = 0; i < 8; i++) {
      if (i >= uRippleCount) break;

      float age = uTime - uRipples[i].z;
      if (age < 0.0 || age > 9.0) continue;

      vec2 delta = pos.xy - uRipples[i].xy;
      float d = length(delta) + 0.0001;
      vec2 dir = delta / d;

      // Ring propagation
      float ringR  = age * 1.55;
      float width  = 0.9 + age * 0.28;
      float off    = (d - ringR) / width;
      float env    = exp(-off * off * 1.6);
      float decay  = exp(-age * 0.36);
      float freq   = 5.8;
      float phase  = d * freq - age * 6.2;

      float wave   = env * decay * sin(phase);
      // Slope = d(wave)/dd — needed to compute displaced normals
      float dWave  = env * decay * (
        cos(phase) * freq
        - 2.0 * off / width * sin(phase)
      );

      float amp = 0.14;
      h    += wave  * amp;
      grad += dir * dWave * amp;
    }

    // Very faint ambient surface ripple so the plane is not dead-flat at rest
    h += sin(pos.x * 0.22 + uTime * 0.14) * sin(pos.y * 0.28 + uTime * 0.19) * 0.004;

    pos.z += h;
    vHeight = h;

    // Displaced normal from gradient
    vec3 localNormal = normalize(vec3(-grad.x, -grad.y, 1.0));
    vWorldNormal = normalize(mat3(modelMatrix) * localNormal);

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uIntro;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vHeight;

  void main() {
    // Soft vignette toward edges
    float dist     = length(vWorldPos.xz);
    float vignette = 1.0 - smoothstep(5.0, 17.0, dist);

    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(vec3(-0.4, 2.0, 1.2));
    vec3 H = normalize(L + V);

    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float NdotV = max(dot(N, V), 0.0001);
    float rippleMask = smoothstep(0.008, 0.045, abs(vHeight));

    // Blinn-Phong specular — tight highlight on wave crests
    float spec = pow(NdotH, 110.0) * 0.28;

    // Fresnel — slight brightening at glancing angles
    float fresnel = pow(1.0 - NdotV, 4.0) * 0.10;

    // Near-black base — water is dark, only waves catch light
    vec3 color = vec3(0.006, 0.010, 0.018);
    // Diffuse: very subtle blue wash on lit normals
    color += vec3(0.016, 0.032, 0.065) * NdotL;
    // Specular: sharp blue-white crest highlight
    color += vec3(0.38, 0.58, 1.0) * spec;
    // Fresnel rim
    color += vec3(0.04, 0.08, 0.15) * fresnel;
    // Ripple crest boost so the ring itself reads as bright white.
    color += vec3(1.0) * rippleMask * 0.95;

    color *= vignette * uIntro;

    gl_FragColor = vec4(color, 1.0);
  }
`;
