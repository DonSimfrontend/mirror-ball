precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // The nebula remains completely fixed.
  vec2 uv = vTexCoord;
  vec3 source = texture2D(uTexture, uv).rgb;

  // Stronger original colour preservation; no grey wash.
  vec3 col = pow(max(source, 0.0), vec3(0.95));
  col *= 1.08;

  // Select genuinely colourful red/orange pixels.
  float redOrange = smoothstep(0.20, 0.58, source.r) *
                    smoothstep(0.03, 0.40, source.r - source.b * 0.62);

  // Select genuinely colourful blue/cyan pixels.
  float blue = smoothstep(0.17, 0.58, source.b) *
               smoothstep(0.015, 0.30, source.b - source.r * 0.58);

  float selected = max(redOrange, blue);

  // Sparse, sharp twinkles. Each pixel has its own independent phase.
  float seed1 = sin(dot(uv, vec2(631.7, 217.3)));
  float seed2 = sin(dot(uv, vec2(127.1, 719.9)));
  float phase = fract((seed1 + seed2) * 43758.5453);
  float sparkle = pow(max(0.0, sin(uTime * (2.2 + phase * 3.0) + phase * 6.28318)), 18.0);

  // Only selected pixels twinkle, using their own colour.
  float twinkle = selected * sparkle;
  col += source * twinkle * 1.35;

  // Tiny same-colour bloom at the brightest individual sparkles.
  col += pow(max(source, 0.0), vec3(2.8)) * twinkle * 0.55;

  // Protect saturation: no white/grey disco-ball wash.
  float maxC = max(col.r, max(col.g, col.b));
  float minC = min(col.r, min(col.g, col.b));
  float chroma = maxC - minC;
  col += (col - vec3(minC)) * twinkle * chroma * 0.35;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
