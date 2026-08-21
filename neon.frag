precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // The nebula itself never moves or warps.
  vec2 uv = vTexCoord;

  // Keep the source image crisp while adding a tiny fixed RGB separation.
  float aberration = 0.0035;
  float red = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
  float green = texture2D(uTexture, uv).g;
  float blue = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
  vec3 col = vec3(red, green, blue);

  col = pow(max(col, 0.0), vec3(0.82));
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luminance), col, 1.65);
  col *= 1.35;

  // Make the original blues and reds pop.
  float energy = smoothstep(0.20, 0.90, luminance);
  col += vec3(0.02, 0.10, 0.20) * energy;
  col += vec3(0.18, 0.015, 0.12) * smoothstep(0.55, 1.0, col.r);

  // Moving cyberpunk scanner: effect moves, image does not.
  float scanPos = fract(uTime * 0.16);
  float scanCoord = fract(uv.x * 1.08 + uv.y * 0.10);
  float distanceToScan = abs(scanCoord - scanPos);
  distanceToScan = min(distanceToScan, 1.0 - distanceToScan);

  // Soft aura plus a sharp luminous leading edge.
  float scanGlow = exp(-distanceToScan * 22.0);
  float scanCore = exp(-distanceToScan * 180.0);

  // Cyan/magenta scanner light.
  vec3 scanColor = mix(
    vec3(0.02, 0.95, 1.0),
    vec3(1.0, 0.03, 0.65),
    smoothstep(0.25, 0.75, scanCoord)
  );

  col += scanColor * scanGlow * 0.38;
  col += scanColor * scanCore * 1.15;

  // Briefly boost existing image colours as the scan passes.
  col *= 1.0 + scanGlow * 0.42;

  // Very subtle stationary neon lift.
  float glow = smoothstep(0.55, 0.95, luminance);
  col += vec3(0.03, 0.12, 0.24) * glow;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
