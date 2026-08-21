precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // The nebula stays completely fixed. Only its own pixels are amplified.
  vec2 uv = vTexCoord;

  float aberration = 0.0025;
  float red = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
  float green = texture2D(uTexture, uv).g;
  float blue = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
  vec3 col = vec3(red, green, blue);

  col = pow(max(col, 0.0), vec3(0.82));
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luminance), col, 1.65);
  col *= 1.35;

  // Existing colours remain the source of the glow.
  float energy = smoothstep(0.20, 0.90, luminance);
  col += vec3(0.02, 0.10, 0.20) * energy;
  col += vec3(0.18, 0.015, 0.12) * smoothstep(0.55, 1.0, col.r);

  // Pixel-level scan: no solid blue/magenta line is added.
  // The scan only magnifies the colour already present in each pixel.
  float scanPos = fract(uTime * 0.16);
  float scanCoord = fract(uv.x * 1.08 + uv.y * 0.10);
  float d = abs(scanCoord - scanPos);
  d = min(d, 1.0 - d);

  float scan = exp(-d * 24.0);
  float hot = exp(-d * 180.0);

  // Each pixel gets its own colour-preserving boost.
  vec3 pixelGlow = col;
  float colourStrength = smoothstep(0.03, 0.85, luminance);
  col += pixelGlow * scan * (0.65 + 0.75 * colourStrength);
  col += pixelGlow * hot * 1.10;

  // Pull bright individual colours toward their own neon intensity.
  col += pow(max(pixelGlow, 0.0), vec3(2.2)) * scan * 0.65;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
