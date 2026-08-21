precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // Reference image: completely fixed and colour-faithful.
  vec2 uv = vTexCoord;
  vec3 source = texture2D(uTexture, uv).rgb;
  vec3 col = source;

  // Detect detail that is already present in the photograph.
  vec2 px = 1.0 / uResolution;
  vec3 n1 = texture2D(uTexture, uv + vec2(px.x * 2.0, 0.0)).rgb;
  vec3 n2 = texture2D(uTexture, uv - vec2(px.x * 2.0, 0.0)).rgb;
  vec3 n3 = texture2D(uTexture, uv + vec2(0.0, px.y * 2.0)).rgb;
  vec3 n4 = texture2D(uTexture, uv - vec2(0.0, px.y * 2.0)).rgb;
  vec3 localMax = max(source, max(max(n1, n2), max(n3, n4)));

  float sourceLum = dot(source, vec3(0.2126, 0.7152, 0.0722));
  float maxLum = dot(localMax, vec3(0.2126, 0.7152, 0.0722));
  float detail = smoothstep(0.48, 0.82, maxLum);

  // Select only naturally saturated reds/oranges and blues/cyans.
  float redOrange = smoothstep(0.22, 0.62, source.r) *
                    smoothstep(0.04, 0.38, source.r - source.b * 0.65);
  float blue = smoothstep(0.18, 0.62, source.b) *
               smoothstep(0.02, 0.28, source.b - source.r * 0.60);
  float selected = max(redOrange, blue);

  // Gentle energy boost: deliberately restrained to preserve the original image.
  float energyMask = detail * selected;
  vec3 energy = source * energyMask * 0.28;
  col += energy;

  // Very small same-colour sparkle on the brightest existing detail.
  float seed = fract(sin(dot(uv, vec2(127.1, 311.7))) * 43758.5453);
  float starMask = step(0.995, seed) * energyMask;
  float twinkle = pow(max(0.0, sin(uTime * (1.3 + seed * 2.0) + seed * 40.0)), 12.0);
  col += source * starMask * twinkle * 0.35;

  // Soft highlight roll-off: compress only the very brightest values.
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float rolloff = 1.0 / (1.0 + max(lum - 0.78, 0.0) * 1.8);
  col *= rolloff;

  // Preserve the original colour relationships and saturation.
  col = mix(source, col, 0.78);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
