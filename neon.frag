precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // Rock-steady source image: UV coordinates are never displaced.
  vec2 uv = vTexCoord;

  // Static chromatic separation around the existing pixels.
  float aberration = 0.0035;
  float red = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
  float green = texture2D(uTexture, uv).g;
  float blue = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
  vec3 col = vec3(red, green, blue);

  // Strong cyberpunk contrast and saturation.
  col = pow(max(col, 0.0), vec3(0.82));
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luminance), col, 1.65);
  col *= 1.35;

  // Make the existing blues and reds electrically vivid.
  float energy = smoothstep(0.20, 0.90, luminance);
  col += vec3(0.02, 0.10, 0.20) * energy;
  col += vec3(0.18, 0.015, 0.12) * smoothstep(0.55, 1.0, col.r);

  // Very gentle animated brightness pulse only. No image movement.
  float pulse = 0.96 + 0.04 * sin(uTime * 2.0);
  col *= pulse;

  // Neon lift toward bright areas.
  float glow = smoothstep(0.55, 0.95, luminance);
  col += vec3(0.03, 0.12, 0.24) * glow;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
